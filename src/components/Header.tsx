import React, { useState } from 'react';
import { AppViewMode, UserCourseProgress } from '../types/course';
import { COURSE_MODULES } from '../data/courseData';
import { ArrowRight, BookOpen, Cloud, CloudUpload, Flame, GraduationCap, LogIn, LogOut, Sparkles, Trophy, User as UserIcon, Zap } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

interface HeaderProps {
  currentView: AppViewMode;
  onSelectView: (view: AppViewMode) => void;
  progress: UserCourseProgress;
  user: User | null;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
  syncStatus: 'synced' | 'saving' | 'offline';
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  progress,
  user,
  onOpenAuthModal,
  onSignOut,
  syncStatus,
}) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

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
    <header className="w-full bg-[#FFDE03] brutal-border-thick brutal-shadow-lg p-3 sm:p-4 mb-6 relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <button
            onClick={() => onSelectView('speed-test')}
            className="cursor-pointer bg-[#00E5FF] px-3.5 py-1.5 sm:px-4 sm:py-2 brutal-border brutal-shadow hover:-translate-y-0.5 transition-transform flex items-center gap-2 text-left brutal-btn-press"
          >
            <Zap className="w-6 h-6 sm:w-7 sm:h-7 fill-black text-black" />
            <div>
              <span className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight uppercase leading-none block">
                TypeNinja
              </span>
              <span className="text-[9px] font-black uppercase tracking-wider block text-black/80">
                Speed Test & Academy
              </span>
            </div>
          </button>

          {/* Mobile Auth Button */}
          <div className="md:hidden flex items-center gap-1.5">
            {user ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="bg-white px-2.5 py-1.5 text-xs font-black brutal-border flex items-center gap-1 brutal-btn-press"
              >
                <UserIcon className="w-3.5 h-3.5 text-black" />
                <span className="max-w-[80px] truncate">{user.email?.split('@')[0]}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="bg-black text-white px-2.5 py-1.5 text-xs font-black uppercase brutal-border flex items-center gap-1 brutal-btn-press"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Center / Navigation Controls */}
        {isInsideTraining ? (
          <nav className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={() => onSelectView('course')}
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 font-black text-xs sm:text-sm uppercase tracking-wider brutal-border transition-all flex items-center gap-1.5 ${
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
              className={`px-3 py-1.5 sm:px-3.5 sm:py-2 font-black text-xs sm:text-sm uppercase tracking-wider brutal-border transition-all flex items-center gap-1.5 ${
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
            <div className="bg-white px-2.5 py-1 sm:px-3 sm:py-1.5 brutal-border flex items-center gap-1.5 text-xs font-black">
              <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF6B6B] fill-[#FF6B6B]" />
              <span>{progress.currentStreakDays}D STREAK</span>
            </div>

            <div className="bg-[#FFFDF7] px-2.5 py-1 sm:px-3 sm:py-1.5 brutal-border flex items-center gap-1.5 text-xs font-black">
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
              <span>BEST: {progress.highestWpm} WPM</span>
            </div>

            {completedCount > 0 && (
              <div className="bg-[#6BCB77] text-black px-2.5 py-1 sm:px-3 sm:py-1.5 brutal-border flex items-center gap-1 text-xs font-black">
                <span>⭐ {totalStars} STARS ({completionPercent}%)</span>
              </div>
            )}
          </div>
        )}

        {/* Top Right: Training Redirect & User Account Controls */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-center">
          {/* Main Action Button (Redirect to Training or Back to Speed Arena) */}
          {!isInsideTraining ? (
            <button
              onClick={() => onSelectView('course')}
              className="bg-black text-[#FFDE03] hover:text-white px-3.5 sm:px-4 py-2 sm:py-2.5 brutal-border-thick brutal-shadow hover:bg-neutral-900 flex items-center gap-1.5 sm:gap-2 font-black text-xs sm:text-sm uppercase tracking-wider transition-all brutal-btn-press group cursor-pointer"
            >
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFDE03] group-hover:rotate-12 transition-transform" />
              <span>Training Lessons</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFDE03] group-hover:translate-x-0.5 transition-transform" />
            </button>
          ) : (
            <button
              onClick={() => onSelectView('speed-test')}
              className="bg-[#00E5FF] text-black hover:bg-[#33ebff] px-3.5 sm:px-4 py-2 sm:py-2.5 brutal-border-thick brutal-shadow flex items-center gap-1.5 sm:gap-2 font-black text-xs sm:text-sm uppercase tracking-wider transition-all brutal-btn-press cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>Speed Test Arena</span>
            </button>
          )}

          {/* Desktop User Auth / Profile Badge */}
          <div className="relative hidden md:block">
            {user ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="bg-white hover:bg-gray-50 px-3 py-2 brutal-border brutal-shadow-sm flex items-center gap-2 font-black text-xs uppercase tracking-wide cursor-pointer transition-colors"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-[#6BCB77] animate-pulse" />
                  <span className="max-w-[120px] truncate">{user.email?.split('@')[0]}</span>
                  {syncStatus === 'saving' ? (
                    <CloudUpload className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
                  ) : (
                    <Cloud className="w-3.5 h-3.5 text-[#6BCB77]" />
                  )}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white brutal-border-thick brutal-shadow-lg p-3 z-50 animate-in fade-in">
                    <div className="pb-2 mb-2 border-b border-gray-200">
                      <div className="text-[10px] font-black uppercase text-gray-500">Logged in as</div>
                      <div className="text-xs font-black truncate text-black">{user.email}</div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-[#6BCB77] mt-1">
                        <Cloud className="w-3 h-3" />
                        <span>Supabase Cloud Synced</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onSignOut();
                      }}
                      className="w-full py-1.5 px-2 text-xs font-black uppercase text-red-600 hover:bg-red-50 brutal-border flex items-center justify-center gap-1.5 brutal-btn-press"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="bg-white hover:bg-gray-100 text-black px-3 py-2 brutal-border brutal-shadow-sm flex items-center gap-1.5 font-black text-xs uppercase tracking-wider transition-all brutal-btn-press cursor-pointer"
                title="Log in to save your typing speed and training progress to the cloud"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Save Progress</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile User Dropdown Menu */}
      {showUserMenu && user && (
        <div className="md:hidden mt-3 p-3 bg-white brutal-border-thick brutal-shadow">
          <div className="flex items-center justify-between pb-2 border-b border-gray-200 mb-2">
            <div>
              <div className="text-[10px] font-black uppercase text-gray-500">Active Account</div>
              <div className="text-xs font-black truncate">{user.email}</div>
            </div>
            <div className="text-[10px] font-black px-2 py-0.5 bg-[#6BCB77] text-black brutal-border">
              CLOUD SYNCED
            </div>
          </div>
          <button
            onClick={() => {
              setShowUserMenu(false);
              onSignOut();
            }}
            className="w-full py-2 bg-red-100 text-red-700 brutal-border font-black text-xs uppercase flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </header>
  );
};

