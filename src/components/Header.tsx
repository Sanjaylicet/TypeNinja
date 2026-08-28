import React from 'react';
import { AppViewMode, UserCourseProgress } from '../types/course';
import { COURSE_MODULES } from '../data/courseData';
import { ArrowRight, BookOpen, Flame, GraduationCap, Sparkles, Trophy, Zap } from 'lucide-react';

interface HeaderProps {
  currentView: AppViewMode;
  onSelectView: (view: AppViewMode) => void;
  progress: UserCourseProgress;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  progress,
}) => {
  // Calculate total lessons and completed count
  const allLessons = COURSE_MODULES.flatMap((m) => m.lessons);
  const totalLessons = allLessons.length;
  const completedCount = Object.keys(progress.completedLessons || {}).length;
  const completionPercent = Math.round((completedCount / totalLessons) * 100);

  // Total stars
  const totalStars = (Object.values(progress.completedLessons || {}) as import('../types/course').LessonResult[]).reduce(
    (acc: number, curr) => acc + (curr.stars || 0),
    0
  );
  const maxPossibleStars = totalLessons * 3;

  const isInsideTraining = currentView === 'course' || currentView === 'lesson' || currentView === 'weak-key-lab';

  return (
    <header className="w-full bg-[#FFDE03] brutal-border-thick brutal-shadow-lg p-4 sm:p-5 mb-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectView('speed-test')}
            className="cursor-pointer bg-[#00E5FF] px-4 py-2 brutal-border brutal-shadow hover:-translate-y-0.5 transition-transform flex items-center gap-2 text-left brutal-btn-press"
          >
            <Zap className="w-7 h-7 fill-black text-black" />
            <div>
              <span className="text-2xl sm:text-3xl font-black tracking-tight uppercase leading-none block">
                TypeNinja
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider block text-black/80">
                Speed Test & Academy
              </span>
            </div>
          </button>
        </div>

        {/* Center / Navigation Controls */}
        {isInsideTraining ? (
          <nav className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={() => onSelectView('course')}
              className={`px-3.5 py-2 font-black text-xs sm:text-sm uppercase tracking-wider brutal-border transition-all flex items-center gap-1.5 ${
                currentView === 'course' || currentView === 'lesson'
                  ? 'bg-black text-white brutal-shadow-sm -translate-y-0.5'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Curriculum (5 Modules)</span>
            </button>

            <button
              onClick={() => onSelectView('weak-key-lab')}
              className={`px-3.5 py-2 font-black text-xs sm:text-sm uppercase tracking-wider brutal-border transition-all flex items-center gap-1.5 ${
                currentView === 'weak-key-lab'
                  ? 'bg-[#FF6B6B] text-black brutal-shadow-sm -translate-y-0.5'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Weak-Key Lab</span>
            </button>
          </nav>
        ) : (
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <div className="bg-white px-3 py-1.5 brutal-border flex items-center gap-1.5 text-xs font-black">
              <Flame className="w-4 h-4 text-[#FF6B6B] fill-[#FF6B6B]" />
              <span>{progress.currentStreakDays}D STREAK</span>
            </div>

            <div className="bg-[#FFFDF7] px-3 py-1.5 brutal-border flex items-center gap-1.5 text-xs font-black">
              <Trophy className="w-4 h-4 text-black" />
              <span>BEST: {progress.highestWpm} WPM</span>
            </div>

            {completedCount > 0 && (
              <div className="bg-[#6BCB77] text-black px-3 py-1.5 brutal-border flex items-center gap-1 text-xs font-black">
                <span>⭐ {totalStars} STARS ({completionPercent}% ACADEMY)</span>
              </div>
            )}
          </div>
        )}

        {/* Top Right Action Button */}
        <div className="flex items-center gap-2 shrink-0">
          {!isInsideTraining ? (
            <button
              onClick={() => onSelectView('course')}
              className="bg-black text-[#FFDE03] hover:text-white px-4 sm:px-5 py-2.5 brutal-border-thick brutal-shadow hover:bg-neutral-900 flex items-center gap-2 font-black text-xs sm:text-sm uppercase tracking-wider transition-all brutal-btn-press group cursor-pointer"
            >
              <GraduationCap className="w-5 h-5 text-[#FFDE03] group-hover:rotate-12 transition-transform" />
              <span>Training Lessons & Course</span>
              <ArrowRight className="w-4 h-4 text-[#FFDE03] group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="hidden lg:flex items-center gap-1.5 bg-white px-3 py-2 brutal-border text-xs font-black">
                <span>⭐ {totalStars}/{maxPossibleStars}</span>
              </div>

              <button
                onClick={() => onSelectView('speed-test')}
                className="bg-[#00E5FF] text-black hover:bg-[#33ebff] px-4 py-2.5 brutal-border-thick brutal-shadow flex items-center gap-2 font-black text-xs sm:text-sm uppercase tracking-wider transition-all brutal-btn-press cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-black" />
                <span>Speed Test Arena</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
