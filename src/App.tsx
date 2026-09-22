import React, { useEffect, useRef, useState } from 'react';
import { AppViewMode, CourseModule, Lesson, LessonResult, UserCourseProgress } from './types/course';
import { COURSE_MODULES } from './data/courseData';
import {
  getInitialUserProgress,
  loadUserCourseProgress,
  saveUserCourseProgress,
} from './utils/weakKeyAlgorithm';
import { fetchUserCloudProgress, saveUserCloudProgress, supabase } from './utils/supabaseClient';
import type { User } from '@supabase/supabase-js';
import { Header } from './components/Header';
import { CourseCurriculum } from './components/CourseCurriculum';
import { LessonDrill } from './components/LessonDrill';
import { WeakKeyLab } from './components/WeakKeyLab';
import { SpeedTestMode } from './components/SpeedTestMode';
import { AuthModal } from './components/AuthModal';

/**
 * Intelligent helper to merge local and cloud progress without data loss
 */
function mergeProgress(local: UserCourseProgress, cloud: UserCourseProgress): UserCourseProgress {
  const mergedUnlockedLessons = Array.from(
    new Set([...(local.unlockedLessonIds || []), ...(cloud.unlockedLessonIds || [])])
  );
  const mergedUnlockedModules = Array.from(
    new Set([...(local.unlockedModuleIds || []), ...(cloud.unlockedModuleIds || [])])
  );

  // Completed lessons: prefer passed, or whichever has higher WPM
  const mergedCompleted: Record<string, LessonResult> = {
    ...(local.completedLessons || {}),
  };
  Object.entries(cloud.completedLessons || {}).forEach(([lessonId, cloudResult]) => {
    const localResult = mergedCompleted[lessonId];
    if (!localResult || cloudResult.wpm > localResult.wpm || (cloudResult.passed && !localResult.passed)) {
      mergedCompleted[lessonId] = cloudResult;
    }
  });

  // Key stats: combine attempts and errors
  const mergedKeyStats = { ...(local.keyStats || {}) };
  Object.entries(cloud.keyStats || {}).forEach(([key, cloudStat]) => {
    if (!mergedKeyStats[key]) {
      mergedKeyStats[key] = { ...cloudStat };
    } else {
      mergedKeyStats[key] = {
        key,
        attempts: Math.max(mergedKeyStats[key].attempts, cloudStat.attempts),
        errors: Math.max(mergedKeyStats[key].errors, cloudStat.errors),
        totalLatencyMs: Math.max(mergedKeyStats[key].totalLatencyMs, cloudStat.totalLatencyMs),
      };
    }
  });

  return {
    unlockedLessonIds: mergedUnlockedLessons.length > 0 ? mergedUnlockedLessons : ['lesson-1-1'],
    unlockedModuleIds: mergedUnlockedModules.length > 0 ? mergedUnlockedModules : ['module-1'],
    completedLessons: mergedCompleted,
    keyStats: mergedKeyStats,
    highestWpm: Math.max(local.highestWpm || 0, cloud.highestWpm || 0),
    currentStreakDays: Math.max(local.currentStreakDays || 1, cloud.currentStreakDays || 1),
    totalPracticeTimeSeconds: Math.max(
      local.totalPracticeTimeSeconds || 0,
      cloud.totalPracticeTimeSeconds || 0
    ),
    lastPracticedDate: cloud.lastPracticedDate || local.lastPracticedDate || new Date().toISOString().split('T')[0],
  };
}

export const App: React.FC = () => {
  const [progress, setProgress] = useState<UserCourseProgress>(() => loadUserCourseProgress());
  const [currentView, setCurrentView] = useState<AppViewMode>('speed-test');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeModule, setActiveModule] = useState<CourseModule | null>(null);

  // Supabase Auth and Cloud Sync State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'offline'>('synced');

  const syncTimeoutRef = useRef<number | null>(null);

  // Initialize Supabase Auth Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        handleLoadAndSyncCloud(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        handleLoadAndSyncCloud(currentUser.id);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch Cloud Progress on login and merge
  const handleLoadAndSyncCloud = async (userId: string) => {
    setSyncStatus('saving');
    const cloudProgress = await fetchUserCloudProgress(userId);
    if (cloudProgress) {
      setProgress((currentLocal) => {
        const merged = mergeProgress(currentLocal, cloudProgress);
        saveUserCourseProgress(merged);
        // Persist merged back to Supabase to keep both fresh
        saveUserCloudProgress(userId, merged).then(() => setSyncStatus('synced'));
        return merged;
      });
    } else {
      // First time user: save local progress up to cloud
      setProgress((currentLocal) => {
        saveUserCloudProgress(userId, currentLocal).then(() => setSyncStatus('synced'));
        return currentLocal;
      });
    }
  };

  // Sync progress state to localStorage and Supabase (debounced)
  useEffect(() => {
    saveUserCourseProgress(progress);

    if (user) {
      setSyncStatus('saving');
      if (syncTimeoutRef.current) {
        window.clearTimeout(syncTimeoutRef.current);
      }
      syncTimeoutRef.current = window.setTimeout(async () => {
        const res = await saveUserCloudProgress(user.id, progress);
        setSyncStatus(res.success ? 'synced' : 'offline');
      }, 500);
    }

    return () => {
      if (syncTimeoutRef.current) window.clearTimeout(syncTimeoutRef.current);
    };
  }, [progress, user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSyncStatus('synced');
  };

  // Handle lesson selection from Curriculum or Weak-Key Lab
  const handleSelectLesson = (lesson: Lesson, module: CourseModule) => {
    setActiveLesson(lesson);
    setActiveModule(module);
    setCurrentView('lesson');
  };

  // Handle Saving Lesson Results & Unlocking Progression
  const handleSaveResult = (result: LessonResult, keyStatsDelta: Record<string, any>) => {
    setProgress((prev) => {
      const nextCompleted = {
        ...prev.completedLessons,
        [result.lessonId]: result,
      };

      const nextUnlockedLessons = new Set(prev.unlockedLessonIds);
      const nextUnlockedModules = new Set(prev.unlockedModuleIds);

      // Merge key stats delta for weak-key telemetry
      const nextKeyStats = { ...prev.keyStats };
      Object.entries(keyStatsDelta).forEach(([key, delta]) => {
        if (!nextKeyStats[key]) {
          nextKeyStats[key] = { key, attempts: 0, errors: 0, totalLatencyMs: 0 };
        }
        nextKeyStats[key].attempts += delta.attempts;
        nextKeyStats[key].errors += delta.errors;
        nextKeyStats[key].totalLatencyMs += delta.totalLatencyMs;
      });

      // If passed, unlock next lesson or next module
      if (result.passed && activeModule && activeLesson) {
        const currentModLessons = activeModule.lessons;
        const currentIdx = currentModLessons.findIndex((l) => l.id === activeLesson.id);

        if (currentIdx !== -1 && currentIdx < currentModLessons.length - 1) {
          // Unlock next lesson in same module
          const nextLesson = currentModLessons[currentIdx + 1];
          nextUnlockedLessons.add(nextLesson.id);
        } else if (currentIdx === currentModLessons.length - 1) {
          // Last lesson in module -> unlock next module and its first lesson!
          const currentModIdx = COURSE_MODULES.findIndex((m) => m.id === activeModule.id);
          if (currentModIdx !== -1 && currentModIdx < COURSE_MODULES.length - 1) {
            const nextMod = COURSE_MODULES[currentModIdx + 1];
            nextUnlockedModules.add(nextMod.id);
            if (nextMod.lessons[0]) {
              nextUnlockedLessons.add(nextMod.lessons[0].id);
            }
          }
        }
      }

      return {
        ...prev,
        completedLessons: nextCompleted,
        unlockedLessonIds: Array.from(nextUnlockedLessons),
        unlockedModuleIds: Array.from(nextUnlockedModules),
        keyStats: nextKeyStats,
        highestWpm: Math.max(prev.highestWpm, result.wpm),
        totalPracticeTimeSeconds: prev.totalPracticeTimeSeconds + result.durationSeconds,
      };
    });
  };

  // Handle Speed Test completion to register highest WPM and practice time
  const handleSpeedTestComplete = (wpm: number, _accuracy: number, durationSeconds: number) => {
    setProgress((prev) => ({
      ...prev,
      highestWpm: Math.max(prev.highestWpm, wpm),
      totalPracticeTimeSeconds: prev.totalPracticeTimeSeconds + durationSeconds,
    }));
  };

  // Find next lesson helper
  const handleNextLesson = () => {
    if (!activeModule || !activeLesson) return;
    const currentModLessons = activeModule.lessons;
    const currentIdx = currentModLessons.findIndex((l) => l.id === activeLesson.id);

    if (currentIdx !== -1 && currentIdx < currentModLessons.length - 1) {
      const nextLesson = currentModLessons[currentIdx + 1];
      setActiveLesson(nextLesson);
    } else {
      // Check next module
      const currentModIdx = COURSE_MODULES.findIndex((m) => m.id === activeModule.id);
      if (currentModIdx !== -1 && currentModIdx < COURSE_MODULES.length - 1) {
        const nextMod = COURSE_MODULES[currentModIdx + 1];
        setActiveModule(nextMod);
        setActiveLesson(nextMod.lessons[0]);
      } else {
        // Curriculum finished!
        setCurrentView('course');
      }
    }
  };

  const hasNextLesson = Boolean(
    activeModule &&
      activeLesson &&
      (activeModule.lessons.findIndex((l) => l.id === activeLesson.id) <
        activeModule.lessons.length - 1 ||
        COURSE_MODULES.findIndex((m) => m.id === activeModule.id) < COURSE_MODULES.length - 1)
  );

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-black font-sans flex flex-col justify-between">
      <div>
        <Header
          currentView={currentView}
          onSelectView={(view) => {
            setCurrentView(view);
            if (view !== 'lesson') {
              setActiveLesson(null);
              setActiveModule(null);
            }
          }}
          progress={progress}
          user={user}
          onOpenAuthModal={() => setIsAuthModalOpen(true)}
          onSignOut={handleSignOut}
          syncStatus={syncStatus}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">
          {currentView === 'course' && (
            <CourseCurriculum
              progress={progress}
              onSelectLesson={handleSelectLesson}
            />
          )}

          {currentView === 'lesson' && activeLesson && activeModule && (
            <LessonDrill
              lesson={activeLesson}
              currentModule={activeModule}
              onBack={() => setCurrentView('course')}
              onSaveResult={handleSaveResult}
              onNextLesson={handleNextLesson}
              hasNextLesson={hasNextLesson}
            />
          )}

          {currentView === 'weak-key-lab' && (
            <WeakKeyLab
              progress={progress}
              onLaunchDynamicDrill={handleSelectLesson}
            />
          )}

          {currentView === 'speed-test' && (
            <SpeedTestMode
              onGoToTraining={() => setCurrentView('course')}
              onGoToWeakKeyLab={() => setCurrentView('weak-key-lab')}
              onTestComplete={handleSpeedTestComplete}
              user={user}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Auth Modal for Supabase Login & Registration */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={() => {
          supabase.auth.getUser().then(({ data: { user: u } }) => {
            if (u) {
              setUser(u);
              handleLoadAndSyncCloud(u.id);
            }
          });
        }}
      />

      {/* Footer info */}
      <footer className="w-full border-t-2 border-black bg-white p-4 text-center text-xs font-bold text-gray-600">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TypeNinja • 5-Module Touch Typing Academy & Speed Arena</span>
          <div className="flex items-center gap-2">
            <span className="font-mono-code text-[11px] bg-[#FFDE03] px-2 py-0.5 brutal-border text-black font-black">
              Supabase Cloud Sync Ready
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
