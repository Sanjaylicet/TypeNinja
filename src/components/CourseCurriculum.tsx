import React, { useState } from 'react';
import { CourseModule, Lesson, UserCourseProgress } from '../types/course';
import { COURSE_MODULES } from '../data/courseData';
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Lock,
  Play,
  Shield,
  Star,
  Target,
  Trophy,
  Zap,
} from 'lucide-react';

interface CourseCurriculumProps {
  progress: UserCourseProgress;
  onSelectLesson: (lesson: Lesson, module: CourseModule) => void;
}

export const CourseCurriculum: React.FC<CourseCurriculumProps> = ({
  progress,
  onSelectLesson,
}) => {
  // Keep first unlocked module open by default
  const [expandedModuleId, setExpandedModuleId] = useState<string>(
    progress.unlockedModuleIds[progress.unlockedModuleIds.length - 1] || 'module-1'
  );

  const toggleModule = (modId: string) => {
    setExpandedModuleId((prev) => (prev === modId ? '' : modId));
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 animate-in fade-in">
      {/* Course Overview Banner */}
      <div className="bg-[#00E5FF] brutal-border-thick brutal-shadow-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-block bg-black text-white text-xs font-black uppercase px-2.5 py-1 brutal-border mb-2">
            Structured Touch Typing Curriculum
          </div>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-black">
            From Home Row to 65+ WPM Mastery
          </h1>
          <p className="text-sm font-bold text-black/80 max-w-2xl mt-1">
            Complete the 5 pedagogical modules in sequence. Master spatial anchors, vertical reaches, opposite-hand shift discipline, top-row symbols, and real-world high-throughput typing.
          </p>
        </div>

        <div className="bg-white p-4 brutal-border brutal-shadow-sm text-center shrink-0 w-full md:w-auto">
          <div className="text-[11px] font-black uppercase text-gray-600">Graduation Goal</div>
          <div className="text-3xl font-black text-black">65+ WPM</div>
          <div className="text-[11px] font-bold text-gray-500">98% Accuracy Target</div>
        </div>
      </div>

      {/* Module List Accordion */}
      <div className="flex flex-col gap-5">
        {COURSE_MODULES.map((module) => {
          const isModuleUnlocked = progress.unlockedModuleIds.includes(module.id);
          const isExpanded = expandedModuleId === module.id;

          // Compute module stats
          const moduleCompletedLessons = module.lessons.filter((l) =>
            Boolean(progress.completedLessons[l.id]?.passed)
          );
          const isModuleFullyCompleted =
            moduleCompletedLessons.length === module.lessons.length;

          const earnedStarsInModule = module.lessons.reduce((acc, l) => {
            return acc + (progress.completedLessons[l.id]?.stars || 0);
          }, 0);
          const maxStarsInModule = module.lessons.length * 3;

          return (
            <div
              key={module.id}
              className={`bg-white brutal-border-thick brutal-shadow transition-all ${
                !isModuleUnlocked ? 'opacity-75 bg-gray-50' : ''
              }`}
            >
              {/* Module Header Strip */}
              <div
                onClick={() => isModuleUnlocked && toggleModule(module.id)}
                className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none transition-colors ${
                  isExpanded ? 'border-b-2 border-black' : ''
                }`}
                style={{
                  borderLeft: `10px solid ${module.color}`,
                }}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className="w-12 h-12 flex items-center justify-center brutal-border text-black font-black text-xl shrink-0"
                    style={{ backgroundColor: module.color }}
                  >
                    {isModuleFullyCompleted ? (
                      <Trophy className="w-6 h-6 fill-black text-black" />
                    ) : isModuleUnlocked ? (
                      `0${module.moduleNumber}`
                    ) : (
                      <Lock className="w-6 h-6 text-black" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-xs font-black uppercase text-gray-500">
                        Module {module.moduleNumber}
                      </span>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white brutal-border">
                        {module.badge}
                      </span>
                      {isModuleFullyCompleted && (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-[#6BCB77] text-black brutal-border flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Mastered
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-black leading-tight">
                      {module.title}
                    </h2>
                    <p className="text-xs sm:text-sm font-bold text-gray-600">
                      {module.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right Module Metrics & Expand Toggle */}
                <div className="flex items-center justify-between md:justify-end gap-4">
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-[10px] font-black uppercase text-gray-500">Progress</div>
                      <div className="text-sm font-black">
                        {moduleCompletedLessons.length}/{module.lessons.length} Lessons
                      </div>
                    </div>

                    <div className="bg-[#FFFDF7] px-2.5 py-1 brutal-border text-xs font-black">
                      ⭐ {earnedStarsInModule}/{maxStarsInModule}
                    </div>
                  </div>

                  {isModuleUnlocked && (
                    <button
                      className="p-1.5 bg-gray-100 brutal-border hover:bg-gray-200"
                      aria-label="Toggle Module"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Module Description & Lessons List */}
              {isExpanded && isModuleUnlocked && (
                <div className="p-4 sm:p-6 bg-[#FFFDF7]">
                  <p className="text-xs sm:text-sm font-bold text-gray-700 mb-5 p-3 bg-white brutal-border">
                    💡 <span className="font-black">Module Objective:</span> {module.description}
                  </p>

                  <div className="grid grid-cols-1 gap-3">
                    {module.lessons.map((lesson) => {
                      const isLessonUnlocked = progress.unlockedLessonIds.includes(lesson.id);
                      const result = progress.completedLessons[lesson.id];
                      const isPassed = result?.passed;

                      return (
                        <div
                          key={lesson.id}
                          className={`p-4 brutal-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                            isPassed
                              ? 'bg-white hover:bg-emerald-50/50'
                              : isLessonUnlocked
                              ? 'bg-white hover:bg-yellow-50/50 ring-2 ring-black'
                              : 'bg-gray-100 opacity-60'
                          }`}
                        >
                          {/* Lesson Info */}
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-9 h-9 flex items-center justify-center brutal-border text-xs font-black shrink-0 ${
                                isPassed
                                  ? 'bg-[#6BCB77] text-black'
                                  : isLessonUnlocked
                                  ? 'bg-[#FFDE03] text-black'
                                  : 'bg-gray-300 text-gray-600'
                              }`}
                            >
                              {isPassed ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : isLessonUnlocked ? (
                                `${module.moduleNumber}.${lesson.lessonNumber}`
                              ) : (
                                <Lock className="w-4 h-4" />
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-base font-black text-black">
                                  {lesson.title}
                                </h3>
                                {lesson.requiresShiftDiscipline && (
                                  <span className="text-[9px] font-black uppercase bg-[#FF6B6B] text-black px-1.5 py-0.2 brutal-border flex items-center gap-1">
                                    <Shield className="w-2.5 h-2.5" /> Shift Rule
                                  </span>
                                )}
                              </div>
                              <p className="text-xs font-bold text-gray-600 mt-0.5">
                                {lesson.description}
                              </p>

                              {/* Focus keys chip */}
                              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                <span className="text-[10px] font-black uppercase text-gray-500">
                                  Target Keys:
                                </span>
                                {lesson.focusKeys.slice(0, 8).map((k, i) => (
                                  <span
                                    key={i}
                                    className="bg-[#E5E7EB] font-mono-code text-[10px] font-black px-1 border border-black"
                                  >
                                    {k === ' ' ? 'SPACE' : k}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Criteria & Action Button */}
                          <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                            {/* Star Rating if completed */}
                            {result && (
                              <div className="text-right">
                                <div className="flex items-center gap-0.5 justify-end">
                                  {[1, 2, 3].map((starIdx) => (
                                    <Star
                                      key={starIdx}
                                      className={`w-3.5 h-3.5 ${
                                        starIdx <= result.stars
                                          ? 'fill-[#FFDE03] text-black'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <div className="text-[10px] font-black text-black">
                                  {result.wpm} WPM • {result.accuracy}%
                                </div>
                              </div>
                            )}

                            {/* Target threshold badge */}
                            <div className="text-right hidden md:block">
                              <div className="text-[9px] font-black uppercase text-gray-500">Target</div>
                              <div className="text-xs font-black text-gray-700">
                                {lesson.targetWpm} WPM / {lesson.targetAccuracy}%
                              </div>
                            </div>

                            {/* Launch Button */}
                            {isLessonUnlocked ? (
                              <button
                                onClick={() => onSelectLesson(lesson, module)}
                                className={`px-4 py-2 text-xs font-black uppercase tracking-wider brutal-border brutal-shadow-sm brutal-btn-press flex items-center gap-1.5 ${
                                  isPassed
                                    ? 'bg-white hover:bg-gray-100 text-black'
                                    : 'bg-[#FFDE03] hover:bg-[#ffe338] text-black'
                                }`}
                              >
                                <Play className="w-3.5 h-3.5 fill-black" />
                                <span>{isPassed ? 'Retrain' : 'Start'}</span>
                              </button>
                            ) : (
                              <div className="px-3 py-1.5 bg-gray-200 brutal-border text-[11px] font-bold text-gray-500 flex items-center gap-1">
                                <Lock className="w-3.5 h-3.5" />
                                <span>Locked</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
