import React, { useEffect, useRef } from 'react';
import { CourseModule, Lesson, LessonResult } from '../types/course';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { FingerGuideBar } from './FingerGuideBar';
import { VisualKeyboard } from './VisualKeyboard';
import { LessonSummaryModal } from './LessonSummaryModal';
import { ArrowLeft, CheckCircle2, RotateCcw, ShieldAlert, Sparkles, Target, Zap } from 'lucide-react';

interface LessonDrillProps {
  lesson: Lesson;
  currentModule: CourseModule;
  onBack: () => void;
  onSaveResult: (result: LessonResult, keyStatsDelta: Record<string, any>) => void;
  onNextLesson?: () => void;
  hasNextLesson: boolean;
}

export const LessonDrill: React.FC<LessonDrillProps> = ({
  lesson,
  currentModule,
  onBack,
  onSaveResult,
  onNextLesson,
  hasNextLesson,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);

  const [finishedResult, setFinishedResult] = React.useState<LessonResult | null>(null);

  const {
    charStatuses,
    cursorIndex,
    isStarted,
    isCompleted,
    elapsedSeconds,
    wpm,
    rawWpm,
    accuracy,
    totalKeystrokes,
    errorKeystrokes,
    currentTargetChar,
    targetKeyEntry,
    activeShiftKey,
    shiftAlert,
    shiftViolationsCount,
    handleKeyPress,
    resetEngine,
  } = useTypingEngine({
    drillText: lesson.drillText,
    targetWpm: lesson.targetWpm,
    targetAccuracy: lesson.targetAccuracy,
    requiresShiftDiscipline: lesson.requiresShiftDiscipline,
    onComplete: (res) => {
      // Calculate star score:
      // 1 star: finished
      // 2 stars: met target WPM or target Accuracy
      // 3 stars: met BOTH target WPM and target Accuracy
      let stars = 1;
      if (res.wpm >= lesson.targetWpm && res.accuracy >= lesson.targetAccuracy) {
        stars = 3;
      } else if (res.wpm >= lesson.targetWpm || res.accuracy >= lesson.targetAccuracy) {
        stars = 2;
      }

      const lessonResult: LessonResult = {
        lessonId: lesson.id,
        wpm: res.wpm,
        rawWpm: res.rawWpm,
        accuracy: res.accuracy,
        completedAt: new Date().toISOString(),
        durationSeconds: res.durationSeconds,
        totalKeystrokes: res.totalKeystrokes,
        errorCount: res.errorCount,
        stars,
        passed: res.passed,
        shiftDisciplineViolations: res.shiftDisciplineViolations,
      };

      setFinishedResult(lessonResult);
      onSaveResult(lessonResult, res.keyStatsDelta);
    },
  });

  // Focus input automatically on mount & click
  useEffect(() => {
    inputRef.current?.focus();
  }, [lesson.id]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // Auto scroll text container with cursor
  useEffect(() => {
    if (activeCharRef.current && textContainerRef.current) {
      const container = textContainerRef.current;
      const charEl = activeCharRef.current;
      const offsetTop = charEl.offsetTop;
      if (offsetTop > container.scrollTop + 80) {
        container.scrollTop = offsetTop - 40;
      }
    }
  }, [cursorIndex]);

  const progressPercent = Math.min(
    100,
    Math.round((cursorIndex / lesson.drillText.length) * 100)
  );

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-4 animate-in fade-in">
      {/* Hidden input catching keystrokes */}
      <input
        ref={inputRef}
        type="text"
        className="sr-only"
        autoFocus
        autoComplete="off"
        autoCapitalize="off"
        spellCheck="false"
        onKeyDown={handleKeyPress}
        value=""
        onChange={() => {}}
      />

      {/* Top Drill Controls & Module Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white brutal-border brutal-shadow p-3.5">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 bg-gray-100 hover:bg-gray-200 brutal-border text-xs font-black uppercase flex items-center gap-1 brutal-btn-press"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Syllabus</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-black uppercase px-2 py-0.5 brutal-border"
                style={{ backgroundColor: currentModule.color }}
              >
                Module {currentModule.moduleNumber}
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-gray-500">
                Lesson {lesson.lessonNumber}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-black leading-tight">
              {lesson.title}
            </h2>
          </div>
        </div>

        {/* Targets & Reset */}
        <div className="flex items-center gap-2">
          <div className="bg-[#FFFDF7] px-3 py-1.5 brutal-border text-xs font-black flex items-center gap-1.5">
            <Target className="w-4 h-4 text-black" />
            <span>GOAL: {lesson.targetWpm} WPM • {lesson.targetAccuracy}% ACC</span>
          </div>

          <button
            onClick={() => {
              setFinishedResult(null);
              resetEngine();
              inputRef.current?.focus();
            }}
            className="px-3 py-1.5 bg-[#FFDE03] hover:bg-[#ffe338] text-black font-black text-xs uppercase brutal-border brutal-btn-press flex items-center gap-1"
            title="Restart Lesson"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Real-Time Metrics HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#00E5FF] p-3 brutal-border brutal-shadow-sm text-center">
          <div className="text-[10px] font-black uppercase tracking-wider">Live Net WPM</div>
          <div className="text-2xl sm:text-3xl font-black">{wpm}</div>
          <div className="text-[9px] font-bold">Gross: {rawWpm} WPM</div>
        </div>

        <div className="bg-[#6BCB77] p-3 brutal-border brutal-shadow-sm text-center">
          <div className="text-[10px] font-black uppercase tracking-wider">Accuracy</div>
          <div className="text-2xl sm:text-3xl font-black">{accuracy}%</div>
          <div className="text-[9px] font-bold">{errorKeystrokes} errors</div>
        </div>

        <div className="bg-[#FFDE03] p-3 brutal-border brutal-shadow-sm text-center">
          <div className="text-[10px] font-black uppercase tracking-wider">Time</div>
          <div className="text-2xl sm:text-3xl font-black">{elapsedSeconds}s</div>
          <div className="text-[9px] font-bold">{totalKeystrokes} strokes</div>
        </div>

        <div className="bg-[#FF6B6B] p-3 brutal-border brutal-shadow-sm text-center">
          <div className="text-[10px] font-black uppercase tracking-wider">Progress</div>
          <div className="text-2xl sm:text-3xl font-black">{progressPercent}%</div>
          <div className="text-[9px] font-bold">
            {cursorIndex} / {lesson.drillText.length} chars
          </div>
        </div>
      </div>

      {/* Shift Discipline Alert Banner */}
      {shiftAlert && (
        <div className="bg-[#FF6B6B] text-black p-2.5 brutal-border brutal-shadow-sm flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-2 text-xs font-black">
            <ShieldAlert className="w-5 h-5" />
            <span>
              DISCIPLINE ERROR: Target "{shiftAlert.key}" requires {shiftAlert.expectedShift.toUpperCase()}! (Opposite Hand Rule)
            </span>
          </div>
          <span className="text-[10px] bg-black text-white px-2 py-0.5 font-bold">
            Violations: {shiftViolationsCount}
          </span>
        </div>
      )}

      {/* Main Interactive Typing Area */}
      <div
        ref={textContainerRef}
        onClick={handleContainerClick}
        className="w-full min-h-[160px] max-h-[220px] overflow-y-auto bg-white brutal-border-thick brutal-shadow-lg p-6 font-mono-code text-xl sm:text-2xl leading-relaxed cursor-text relative transition-all"
      >
        {/* Helper prompt when not yet started */}
        {!isStarted && (
          <div className="absolute top-2 right-3 text-[10px] font-black uppercase tracking-wider bg-[#FFDE03] px-2 py-0.5 brutal-border">
            Click here & start typing...
          </div>
        )}

        <div className="flex flex-wrap items-center">
          {lesson.drillText.split('').map((char, index) => {
            const status = charStatuses[index];
            const isCurrent = index === cursorIndex;

            let charClass = 'text-gray-400';
            if (status === 'correct') {
              charClass = 'text-black font-bold';
            } else if (status === 'incorrect') {
              charClass = 'bg-[#FF6B6B] text-white underline decoration-2 decoration-black font-black px-0.5 brutal-border';
            }

            return (
              <span
                key={index}
                ref={isCurrent ? activeCharRef : null}
                className={`relative inline-block ${charClass} ${
                  isCurrent ? 'bg-[#FFDE03] text-black font-black ring-2 ring-black px-0.5' : ''
                }`}
              >
                {char === ' ' ? '\u00A0' : char}
                {isCurrent && (
                  <span className="absolute -bottom-1 left-0 right-0 h-1 bg-black animate-caret" />
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* Focus Keys & Lesson Tips */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#FFFDF7] p-2.5 brutal-border text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-black uppercase text-gray-700">Focus Keys:</span>
          {lesson.focusKeys.map((k, i) => (
            <span
              key={i}
              className="bg-white font-mono-code font-black px-1.5 py-0.5 brutal-border text-[11px]"
            >
              {k === ' ' ? 'SPACE' : k}
            </span>
          ))}
        </div>

        {lesson.tip && (
          <div className="flex items-center gap-1 text-[11px] font-bold text-gray-800">
            <Sparkles className="w-3.5 h-3.5 text-[#FFDE03] fill-[#FFDE03]" />
            <span>{lesson.tip}</span>
          </div>
        )}
      </div>

      {/* Dynamic Finger Guide Indicator */}
      <FingerGuideBar
        activeFinger={targetKeyEntry?.finger}
        targetChar={currentTargetChar}
        requiredShiftSide={
          targetKeyEntry?.shiftChar && currentTargetChar === targetKeyEntry.shiftChar
            ? targetKeyEntry.requiredShiftSide
            : null
        }
      />

      {/* Visual On-Screen Keyboard */}
      <VisualKeyboard
        currentTargetChar={currentTargetChar}
        activeShiftKey={activeShiftKey}
        targetKeyEntry={targetKeyEntry}
      />

      {/* Post-Lesson Evaluation Modal */}
      {finishedResult && (
        <LessonSummaryModal
          lesson={lesson}
          result={finishedResult}
          onRetry={() => {
            setFinishedResult(null);
            resetEngine();
            inputRef.current?.focus();
          }}
          onNextLesson={
            hasNextLesson && onNextLesson
              ? () => {
                  setFinishedResult(null);
                  onNextLesson();
                }
              : undefined
          }
          onBackToCourse={onBack}
          hasNextLesson={hasNextLesson}
        />
      )}
    </div>
  );
};
