import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { ShiftDisciplineAlert } from '../types/course';
import { getKeyEntryForChar, validateShiftDiscipline } from '../utils/keyboardMapping';

export interface UseTypingEngineProps {
  drillText: string;
  targetWpm: number;
  targetAccuracy: number;
  requiresShiftDiscipline?: boolean;
  onComplete?: (result: {
    wpm: number;
    rawWpm: number;
    accuracy: number;
    durationSeconds: number;
    errorCount: number;
    totalKeystrokes: number;
    passed: boolean;
    shiftDisciplineViolations: number;
    keyStatsDelta: Record<string, { attempts: number; errors: number; totalLatencyMs: number }>;
  }) => void;
}

export type CharStatus = 'pending' | 'correct' | 'incorrect';

export function useTypingEngine({
  drillText,
  targetWpm,
  targetAccuracy,
  requiresShiftDiscipline = false,
  onComplete,
}: UseTypingEngineProps) {
  const [charStatuses, setCharStatuses] = useState<CharStatus[]>([]);
  const [cursorIndex, setCursorIndex] = useState<number>(0);
  const [isStarted, setIsStarted] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Live Metrics
  const [wpm, setWpm] = useState<number>(0);
  const [rawWpm, setRawWpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [errorKeystrokes, setErrorKeystrokes] = useState<number>(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);

  // Shift Discipline Tracking
  const [activeShiftKey, setActiveShiftKey] = useState<'ShiftLeft' | 'ShiftRight' | null>(null);
  const [shiftAlert, setShiftAlert] = useState<ShiftDisciplineAlert | null>(null);
  const [shiftViolationsCount, setShiftViolationsCount] = useState<number>(0);

  // Per-Key Telemetry (key -> attempts, errors, latency)
  const keyTelemetryRef = useRef<Record<string, { attempts: number; errors: number; totalLatencyMs: number }>>({});
  const lastKeyTimestampRef = useRef<number>(Date.now());
  const timerIntervalRef = useRef<number | null>(null);

  // Reset engine when drillText changes
  const resetEngine = useCallback((newText?: string) => {
    const text = newText !== undefined ? newText : drillText;
    setCharStatuses(new Array(text.length).fill('pending'));
    setCursorIndex(0);
    setIsStarted(false);
    setIsCompleted(false);
    setStartTime(null);
    setElapsedSeconds(0);
    setWpm(0);
    setRawWpm(0);
    setAccuracy(100);
    setTotalKeystrokes(0);
    setErrorKeystrokes(0);
    setCorrectKeystrokes(0);
    setShiftAlert(null);
    setShiftViolationsCount(0);
    keyTelemetryRef.current = {};
    lastKeyTimestampRef.current = Date.now();

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, [drillText]);

  useEffect(() => {
    resetEngine(drillText);
  }, [drillText, resetEngine]);

  // Handle active shift detection via window keydown / keyup
  useEffect(() => {
    const handleKeyDownGlobal = (e: KeyboardEvent) => {
      if (e.code === 'ShiftLeft') {
        setActiveShiftKey('ShiftLeft');
      } else if (e.code === 'ShiftRight') {
        setActiveShiftKey('ShiftRight');
      }
    };

    const handleKeyUpGlobal = (e: KeyboardEvent) => {
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
        setActiveShiftKey(null);
      }
    };

    window.addEventListener('keydown', handleKeyDownGlobal);
    window.addEventListener('keyup', handleKeyUpGlobal);

    return () => {
      window.removeEventListener('keydown', handleKeyDownGlobal);
      window.removeEventListener('keyup', handleKeyUpGlobal);
    };
  }, []);

  // Timer Tick & live calculations
  useEffect(() => {
    if (!isStarted || isCompleted) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
      return;
    }

    timerIntervalRef.current = window.setInterval(() => {
      if (!startTime) return;
      const now = Date.now();
      const seconds = Math.max(1, Math.floor((now - startTime) / 1000));
      const minutes = (now - startTime) / 60000;
      setElapsedSeconds(seconds);

      // WPM = (All correct characters / 5) / minutes
      const calculatedGrossWpm = minutes > 0 ? Math.round((totalKeystrokes / 5) / minutes) : 0;
      const calculatedNetWpm = minutes > 0 ? Math.max(0, Math.round((correctKeystrokes / 5) / minutes)) : 0;
      const calculatedAccuracy =
        totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;

      setWpm(calculatedNetWpm);
      setRawWpm(calculatedGrossWpm);
      setAccuracy(calculatedAccuracy);
    }, 200);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isStarted, isCompleted, startTime, totalKeystrokes, correctKeystrokes]);

  // Finish Trigger
  const handleFinish = useCallback(
    (finalCorrect: number, finalTotal: number, finalErrors: number, finalViolations: number) => {
      setIsCompleted(true);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }

      const now = Date.now();
      const effectiveStart = startTime || now - 1000;
      const durationSeconds = Math.max(1, Math.round((now - effectiveStart) / 1000));
      const minutes = durationSeconds / 60;

      const finalNetWpm = minutes > 0 ? Math.round((finalCorrect / 5) / minutes) : 0;
      const finalGrossWpm = minutes > 0 ? Math.round((finalTotal / 5) / minutes) : 0;
      const finalAcc = finalTotal > 0 ? Math.round((finalCorrect / finalTotal) * 100) : 100;

      const passed = finalNetWpm >= targetWpm && finalAcc >= targetAccuracy;

      if (onComplete) {
        onComplete({
          wpm: finalNetWpm,
          rawWpm: finalGrossWpm,
          accuracy: finalAcc,
          durationSeconds,
          errorCount: finalErrors,
          totalKeystrokes: finalTotal,
          passed,
          shiftDisciplineViolations: finalViolations,
          keyStatsDelta: { ...keyTelemetryRef.current },
        });
      }
    },
    [startTime, targetWpm, targetAccuracy, onComplete]
  );

  // Key Press Handler
  const handleKeyPress = useCallback(
    (e: ReactKeyboardEvent<HTMLInputElement>) => {
      if (isCompleted) return;

      const key = e.key;

      // Ignore functional modifier keystrokes alone
      if (
        key === 'Shift' ||
        key === 'Control' ||
        key === 'Alt' ||
        key === 'Meta' ||
        key === 'CapsLock' ||
        key === 'Tab' ||
        key === 'Escape'
      ) {
        return;
      }

      const now = Date.now();
      const latencyMs = Math.min(1000, now - lastKeyTimestampRef.current);
      lastKeyTimestampRef.current = now;

      // Start on first actual keystroke
      if (!isStarted) {
        setIsStarted(true);
        setStartTime(now);
      }

      // Handle Backspace
      if (key === 'Backspace') {
        e.preventDefault();
        if (cursorIndex > 0) {
          const prevIndex = cursorIndex - 1;
          setCursorIndex(prevIndex);
          setCharStatuses((prev) => {
            const next = [...prev];
            next[prevIndex] = 'pending';
            return next;
          });
        }
        return;
      }

      // Only handle single characters
      if (key.length !== 1) return;
      e.preventDefault();

      if (cursorIndex >= drillText.length) return;

      const expectedChar = drillText[cursorIndex];
      const isCorrect = key === expectedChar;

      // Record Telemetry
      const charKey = expectedChar.toLowerCase();
      if (!keyTelemetryRef.current[charKey]) {
        keyTelemetryRef.current[charKey] = { attempts: 0, errors: 0, totalLatencyMs: 0 };
      }
      keyTelemetryRef.current[charKey].attempts += 1;
      keyTelemetryRef.current[charKey].totalLatencyMs += latencyMs;
      if (!isCorrect) {
        keyTelemetryRef.current[charKey].errors += 1;
      }

      // Validate Opposite Shift Discipline if required
      let newViolations = shiftViolationsCount;
      if (requiresShiftDiscipline && expectedChar !== expectedChar.toLowerCase()) {
        const shiftCheck = validateShiftDiscipline(expectedChar, activeShiftKey);
        if (shiftCheck.isShiftRequired && !shiftCheck.isCorrectShift && shiftCheck.expectedShift) {
          newViolations += 1;
          setShiftViolationsCount(newViolations);
          setShiftAlert({
            key: expectedChar,
            usedShift: activeShiftKey || 'ShiftLeft',
            expectedShift: shiftCheck.expectedShift,
            timestamp: now,
          });
          // Auto clear alert after 2.5s
          setTimeout(() => {
            setShiftAlert((curr) => (curr && curr.timestamp === now ? null : curr));
          }, 2500);
        }
      }

      const nextTotalKeystrokes = totalKeystrokes + 1;
      const nextCorrectKeystrokes = isCorrect ? correctKeystrokes + 1 : correctKeystrokes;
      const nextErrorKeystrokes = !isCorrect ? errorKeystrokes + 1 : errorKeystrokes;

      setTotalKeystrokes(nextTotalKeystrokes);
      if (isCorrect) {
        setCorrectKeystrokes(nextCorrectKeystrokes);
      } else {
        setErrorKeystrokes(nextErrorKeystrokes);
      }

      // Update Character Statuses
      setCharStatuses((prev) => {
        const next = [...prev];
        next[cursorIndex] = isCorrect ? 'correct' : 'incorrect';
        return next;
      });

      const nextCursor = cursorIndex + 1;
      setCursorIndex(nextCursor);

      // Check if finished
      if (nextCursor >= drillText.length) {
        handleFinish(nextCorrectKeystrokes, nextTotalKeystrokes, nextErrorKeystrokes, newViolations);
      }
    },
    [
      isCompleted,
      isStarted,
      cursorIndex,
      drillText,
      totalKeystrokes,
      correctKeystrokes,
      errorKeystrokes,
      requiresShiftDiscipline,
      activeShiftKey,
      shiftViolationsCount,
      handleFinish,
    ]
  );

  // Target Key and Next Chars Metadata
  const currentTargetChar = useMemo(() => {
    if (cursorIndex < drillText.length) {
      return drillText[cursorIndex];
    }
    return '';
  }, [cursorIndex, drillText]);

  const targetKeyEntry = useMemo(() => {
    return getKeyEntryForChar(currentTargetChar);
  }, [currentTargetChar]);

  const upcomingChars = useMemo(() => {
    return drillText.slice(cursorIndex + 1, cursorIndex + 6);
  }, [cursorIndex, drillText]);

  return {
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
    correctKeystrokes,
    currentTargetChar,
    targetKeyEntry,
    upcomingChars,
    activeShiftKey,
    shiftAlert,
    shiftViolationsCount,
    handleKeyPress,
    resetEngine,
  };
}
