import React from 'react';
import { Lesson, LessonResult } from '../types/course';
import { AlertTriangle, ArrowRight, CheckCircle2, RotateCcw, Star, Trophy, XCircle } from 'lucide-react';

interface LessonSummaryModalProps {
  lesson: Lesson;
  result: LessonResult;
  onNextLesson?: () => void;
  onRetry: () => void;
  onBackToCourse: () => void;
  hasNextLesson: boolean;
}

export const LessonSummaryModal: React.FC<LessonSummaryModalProps> = ({
  lesson,
  result,
  onNextLesson,
  onRetry,
  onBackToCourse,
  hasNextLesson,
}) => {
  const isPassed = result.passed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-xl bg-[#FFFDF7] brutal-border-thick brutal-shadow-xl p-6 sm:p-8 animate-in zoom-in-95 duration-150 relative">
        {/* Top Status Banner */}
        <div
          className={`p-4 brutal-border text-center mb-6 ${
            isPassed ? 'bg-[#6BCB77] text-black' : 'bg-[#FF6B6B] text-black'
          }`}
        >
          <div className="flex justify-center items-center gap-2 mb-1">
            {isPassed ? (
              <CheckCircle2 className="w-7 h-7" />
            ) : (
              <XCircle className="w-7 h-7" />
            )}
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
              {isPassed ? 'Lesson Passed!' : 'Target Not Met'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-bold">
            {isPassed
              ? 'Congratulations! You met the speed & accuracy threshold.'
              : `Goal was ${lesson.targetWpm} WPM & ${lesson.targetAccuracy}% Accuracy.`}
          </p>
        </div>

        {/* Lesson Title */}
        <div className="text-center mb-6">
          <div className="text-xs font-black uppercase tracking-wider text-gray-500 mb-1">
            Lesson {lesson.lessonNumber} Summary
          </div>
          <h3 className="text-xl font-black text-black">{lesson.title}</h3>

          {/* Stars Awarded */}
          <div className="flex justify-center items-center gap-2 mt-3">
            {[1, 2, 3].map((starIndex) => (
              <div
                key={starIndex}
                className={`p-2 brutal-border ${
                  starIndex <= result.stars
                    ? 'bg-[#FFDE03] text-black scale-110'
                    : 'bg-gray-200 text-gray-400 opacity-60'
                }`}
              >
                <Star
                  className={`w-6 h-6 ${
                    starIndex <= result.stars ? 'fill-black text-black' : ''
                  }`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {/* WPM */}
          <div className="bg-white p-3 brutal-border text-center">
            <div className="text-[11px] font-black uppercase text-gray-600">Net WPM</div>
            <div className="text-3xl font-black text-black">{result.wpm}</div>
            <div className="text-[10px] font-bold text-gray-500">Target: {lesson.targetWpm}</div>
          </div>

          {/* Accuracy */}
          <div className="bg-white p-3 brutal-border text-center">
            <div className="text-[11px] font-black uppercase text-gray-600">Accuracy</div>
            <div className="text-3xl font-black text-black">{result.accuracy}%</div>
            <div className="text-[10px] font-bold text-gray-500">Target: {lesson.targetAccuracy}%</div>
          </div>

          {/* Time */}
          <div className="bg-white p-3 brutal-border text-center">
            <div className="text-[11px] font-black uppercase text-gray-600">Time</div>
            <div className="text-3xl font-black text-black">{result.durationSeconds}s</div>
            <div className="text-[10px] font-bold text-gray-500">{result.totalKeystrokes} keys</div>
          </div>

          {/* Errors */}
          <div className="bg-white p-3 brutal-border text-center">
            <div className="text-[11px] font-black uppercase text-gray-600">Errors</div>
            <div className="text-3xl font-black text-black">{result.errorCount}</div>
            <div className="text-[10px] font-bold text-gray-500">mistakes</div>
          </div>
        </div>

        {/* Shift Discipline Report */}
        {result.shiftDisciplineViolations !== undefined && result.shiftDisciplineViolations > 0 && (
          <div className="bg-[#FFF3C4] p-3 brutal-border mb-6 flex items-start gap-2 text-xs">
            <AlertTriangle className="w-5 h-5 text-black shrink-0 mt-0.5" />
            <div>
              <span className="font-black">Opposite Shift Warning: </span>
              <span>
                You had {result.shiftDisciplineViolations} opposite-shift discipline violations. Remember: use Right Shift for left-hand keys, and Left Shift for right-hand keys.
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onRetry}
            className="flex-1 px-4 py-3 bg-white text-black font-black uppercase tracking-wider text-xs sm:text-sm brutal-border brutal-shadow hover:bg-gray-100 flex items-center justify-center gap-2 brutal-btn-press"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Drill</span>
          </button>

          {isPassed && hasNextLesson && onNextLesson ? (
            <button
              onClick={onNextLesson}
              className="flex-1 px-4 py-3 bg-[#FFDE03] text-black font-black uppercase tracking-wider text-xs sm:text-sm brutal-border brutal-shadow hover:bg-[#ffe338] flex items-center justify-center gap-2 brutal-btn-press"
            >
              <span>Next Lesson</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onBackToCourse}
              className="flex-1 px-4 py-3 bg-black text-white font-black uppercase tracking-wider text-xs sm:text-sm brutal-border brutal-shadow hover:bg-neutral-800 flex items-center justify-center gap-2 brutal-btn-press"
            >
              <Trophy className="w-4 h-4" />
              <span>Back to Syllabus</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
