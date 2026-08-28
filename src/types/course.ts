/**
 * Types and Interfaces for TypeNinja Typing Course & Engine
 */

export type FingerId =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'left-thumb'
  | 'right-thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export type HandId = 'left' | 'right' | 'thumb';

export interface FingerInfo {
  id: FingerId;
  name: string;
  hand: HandId;
  colorBg: string;
  colorBorder: string;
  colorText: string;
  description: string;
}

export interface KeyMapEntry {
  code: string; // e.g. "KeyA", "Digit1", "Space"
  baseChar: string; // e.g. "a", "1", " "
  shiftChar?: string; // e.g. "A", "!", null
  finger: FingerId;
  hand: HandId;
  row: number; // 0 (number) to 4 (space)
  widthMultiplier?: number; // 1 = standard, 1.5, 2, 6 for space
  requiredShiftSide?: 'left' | 'right' | null; // For capital/shifted characters: opposite hand rule
}

export interface Lesson {
  id: string;
  moduleId: string;
  lessonNumber: number;
  title: string;
  description: string;
  focusKeys: string[];
  targetWpm: number;
  targetAccuracy: number;
  drillText: string;
  requiresShiftDiscipline?: boolean;
  type: 'drill' | 'combination' | 'words' | 'sentences' | 'trigrams' | 'pangram' | 'symbols' | 'mastery';
  tip?: string;
}

export interface CourseModule {
  id: string;
  moduleNumber: number;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  targetWpm: number;
  targetAccuracy: number;
  color: string;
  badge: string;
  lessons: Lesson[];
}

export interface LessonResult {
  lessonId: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  completedAt: string;
  durationSeconds: number;
  totalKeystrokes: number;
  errorCount: number;
  stars: number; // 1, 2, or 3
  passed: boolean;
  shiftDisciplineViolations?: number;
}

export interface KeyStat {
  key: string;
  attempts: number;
  errors: number;
  totalLatencyMs: number;
}

export interface WeakKeySummary {
  key: string;
  errorRate: number; // 0 to 100
  avgLatencyMs: number;
  attempts: number;
  errors: number;
  weaknessScore: number; // combined metric
  finger: FingerId;
  recommendedDrills: string[];
}

export interface UserCourseProgress {
  unlockedModuleIds: string[];
  unlockedLessonIds: string[];
  completedLessons: Record<string, LessonResult>;
  keyStats: Record<string, KeyStat>;
  totalPracticeTimeSeconds: number;
  highestWpm: number;
  currentStreakDays: number;
  lastPracticedDate: string;
}

export type AppViewMode = 'course' | 'lesson' | 'weak-key-lab' | 'speed-test';

export interface ShiftDisciplineAlert {
  key: string;
  usedShift: 'ShiftLeft' | 'ShiftRight';
  expectedShift: 'ShiftLeft' | 'ShiftRight';
  timestamp: number;
}
