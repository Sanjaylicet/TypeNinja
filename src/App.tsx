import React, { useEffect, useState } from 'react';
import { AppViewMode, CourseModule, Lesson, LessonResult, UserCourseProgress } from './types/course';
import { COURSE_MODULES } from './data/courseData';
import {
  getInitialUserProgress,
  loadUserCourseProgress,
  saveUserCourseProgress,
} from './utils/weakKeyAlgorithm';
import { Header } from './components/Header';
import { CourseCurriculum } from './components/CourseCurriculum';
import { LessonDrill } from './components/LessonDrill';
import { WeakKeyLab } from './components/WeakKeyLab';
import { SpeedTestMode } from './components/SpeedTestMode';

export const App: React.FC = () => {
  const [progress, setProgress] = useState<UserCourseProgress>(() => loadUserCourseProgress());
  const [currentView, setCurrentView] = useState<AppViewMode>('speed-test');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeModule, setActiveModule] = useState<CourseModule | null>(null);

  // Sync progress state to localStorage
  useEffect(() => {
    saveUserCourseProgress(progress);
  }, [progress]);

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
            />
          )}
        </main>
      </div>

      {/* Footer info */}
      <footer className="w-full border-t-2 border-black bg-white p-4 text-center text-xs font-bold text-gray-600">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TypeNinja • 5-Module Pedagogical Touch Typing Architecture</span>
          <span className="font-mono-code text-[11px] bg-[#FFDE03] px-2 py-0.5 brutal-border text-black font-black">
            Zero-Cost Static Serverless
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
