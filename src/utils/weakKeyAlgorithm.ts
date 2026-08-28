import { KeyStat, UserCourseProgress, WeakKeySummary } from '../types/course';
import { getKeyEntryForChar } from './keyboardMapping';

const STORAGE_KEY = 'typeninja_course_progress_v2';

/**
 * Word bank categorized by target letters for dynamic drill generation
 */
const WORD_BANK_BY_LETTER: Record<string, string[]> = {
  a: ['alpha', 'about', 'action', 'always', 'animal', 'across', 'actual', 'almost', 'appear', 'around'],
  b: ['bubble', 'balance', 'branch', 'bright', 'broken', 'builder', 'bundle', 'button', 'symbol', 'carbon'],
  c: ['circle', 'chance', 'charge', 'choice', 'clever', 'common', 'corner', 'create', 'custom', 'direct'],
  d: ['double', 'danger', 'decide', 'degree', 'depend', 'design', 'detail', 'device', 'direct', 'doctor'],
  e: ['energy', 'effect', 'either', 'engine', 'enough', 'entire', 'escape', 'estate', 'event', 'expect'],
  f: ['factor', 'family', 'famous', 'father', 'figure', 'finger', 'finish', 'flight', 'flower', 'forest'],
  g: ['global', 'garage', 'gather', 'gentle', 'glance', 'golden', 'govern', 'ground', 'growth', 'guitar'],
  h: ['handle', 'happen', 'harbor', 'health', 'height', 'hidden', 'honest', 'horror', 'hunger', 'hybrid'],
  i: ['impact', 'income', 'indeed', 'inform', 'injury', 'inside', 'intend', 'island', 'itself', 'invite'],
  j: ['jacket', 'jargon', 'jersey', 'jigsaw', 'jockey', 'jovial', 'joyful', 'judges', 'jumble', 'jungle'],
  k: ['keeper', 'kettle', 'kidney', 'killer', 'kindle', 'kingly', 'kisses', 'kitten', 'knight', 'knives'],
  l: ['ladder', 'latter', 'launch', 'leader', 'league', 'legend', 'lesson', 'letter', 'liquid', 'little'],
  m: ['manner', 'manual', 'margin', 'market', 'master', 'matter', 'meadow', 'medium', 'member', 'memory'],
  n: ['narrow', 'native', 'nature', 'nearby', 'needle', 'nephew', 'neural', 'normal', 'notice', 'number'],
  o: ['object', 'obtain', 'occupy', 'office', 'online', 'oppose', 'option', 'orange', 'origin', 'output'],
  p: ['packet', 'palace', 'parade', 'parent', 'partly', 'patent', 'patrol', 'people', 'period', 'person'],
  q: ['quarry', 'quartz', 'queens', 'quench', 'quests', 'quiche', 'quiver', 'quorum', 'quotes', 'opaque'],
  r: ['rabbit', 'random', 'rarely', 'rather', 'reader', 'reason', 'record', 'refine', 'regard', 'relate'],
  s: ['safari', 'sailor', 'sample', 'saving', 'scheme', 'school', 'season', 'second', 'secret', 'sector'],
  t: ['tablet', 'talent', 'target', 'temple', 'tenant', 'terror', 'theory', 'ticket', 'timber', 'tissue'],
  u: ['unique', 'update', 'urgent', 'useful', 'utmost', 'vacuum', 'valley', 'velvet', 'vendor', 'vessel'],
  v: ['vacant', 'valley', 'vanish', 'varied', 'vector', 'velvet', 'vendor', 'verbal', 'victim', 'visual'],
  w: ['walker', 'wallet', 'wander', 'warmth', 'wealth', 'weapon', 'weekly', 'weight', 'window', 'winter'],
  x: ['galaxy', 'matrix', 'maximum', 'oxygen', 'prefix', 'reflex', 'syntax', 'taxing', 'toxic', 'luxury'],
  y: ['yellow', 'yields', 'yogurt', 'youths', 'yearly', 'voyage', 'system', 'player', 'myself', 'layout'],
  z: ['zebras', 'zenith', 'zigzag', 'zipper', 'zodiac', 'zombie', 'bronze', 'freeze', 'hazard', 'puzzle'],
  '1': ['101', '1984', '2026', '12', '144', '1000', '1st', '#1', '10.5'],
  '2': ['200', '2026', '24/7', '2nd', '256', '512', '2+2', '2.50'],
  '3': ['300', '365', '3rd', '3.14', '3D', '333', '3x'],
  '4': ['404', '4k', '400', '4th', '4x4', '42'],
  '5': ['500', '50%', '5G', '5th', '555', '500k'],
  '6': ['60s', '64-bit', '6th', '666', '6.0'],
  '7': ['700', '777', '7th', '7-day', '7.5'],
  '8': ['8080', '8-bit', '8th', '888', '8.0'],
  '9': ['99%', '90s', '9th', '999', '9.9'],
  '0': ['100', '1000', '0.01', '2020', '007', '0-0'],
  '.': ['e.g.', 'etc.', 'i.e.', 'vs.', 'U.S.', 'co.', '3.14', '99.9%'],
  ',': ['apples, oranges', 'yes, sir', 'well, then', 'fast, clean'],
  ';': ['item 1; item 2', 'status = ok;', 'count++;', 'return false;'],
  "'": ["it's", "can't", "don't", "won't", "they're", "user's"],
  '?': ['Why?', 'How so?', 'Ready?', 'Is it fast?', 'Who knows?'],
  '!': ['Great!', 'Faster!', 'Accuracy first!', 'Unbelievable!'],
};

/**
 * Fallback defaults if user has not accumulated enough typing data yet
 */
const DEFAULT_WEAK_KEYS: string[] = ['q', 'p', 'z', 'x', 'b', ';'];

/**
 * Analyzes historical key performance and identifies the top N weakest keys
 */
export function analyzeWeakKeys(keyStats: Record<string, KeyStat>, topN: number = 3): WeakKeySummary[] {
  const entries = Object.entries(keyStats || {});

  const analyzed: WeakKeySummary[] = entries
    .filter(([key, stat]) => stat.attempts >= 3 && key.trim().length > 0)
    .map(([key, stat]) => {
      const errorRate = (stat.errors / stat.attempts) * 100;
      const avgLatencyMs = stat.totalLatencyMs / stat.attempts;

      // Weakness formula: 70% error frequency + 30% latency penalty (capped at 500ms)
      const normalizedLatency = Math.min(100, (avgLatencyMs / 450) * 100);
      const weaknessScore = errorRate * 0.7 + normalizedLatency * 0.3;

      const keyEntry = getKeyEntryForChar(key);
      const finger = keyEntry?.finger || 'left-index';

      return {
        key,
        errorRate: Math.round(errorRate * 10) / 10,
        avgLatencyMs: Math.round(avgLatencyMs),
        attempts: stat.attempts,
        errors: stat.errors,
        weaknessScore: Math.round(weaknessScore * 10) / 10,
        finger,
        recommendedDrills: WORD_BANK_BY_LETTER[key.toLowerCase()] || [key + key + key],
      };
    })
    .sort((a, b) => b.weaknessScore - a.weaknessScore);

  // If user has fewer than topN tracked keys, augment with high-difficulty keys
  if (analyzed.length < topN) {
    for (const fallback of DEFAULT_WEAK_KEYS) {
      if (!analyzed.some((item) => item.key.toLowerCase() === fallback)) {
        const keyEntry = getKeyEntryForChar(fallback);
        analyzed.push({
          key: fallback,
          errorRate: 0,
          avgLatencyMs: 250,
          attempts: 0,
          errors: 0,
          weaknessScore: 25,
          finger: keyEntry?.finger || 'left-pinky',
          recommendedDrills: WORD_BANK_BY_LETTER[fallback] || [],
        });
      }
      if (analyzed.length >= topN) break;
    }
  }

  return analyzed.slice(0, topN);
}

/**
 * Generates an adaptive practice drill string tailored specifically to the given weak keys.
 * Combines repetition bursts, alternating finger transitions, and contextual words.
 */
export function generateWeakKeyDrillText(
  weakKeys: string[],
  length: 'short' | 'medium' | 'long' = 'medium'
): string {
  const cleanKeys = weakKeys.map((k) => k.toLowerCase()).filter(Boolean);
  if (cleanKeys.length === 0) {
    cleanKeys.push('q', 'p', 'b');
  }

  const generatedTokens: string[] = [];

  // 1. Repetition and Alternation Bursts
  cleanKeys.forEach((key) => {
    // Single key 3-burst
    generatedTokens.push(`${key}${key}${key}`);
    // Sandwiched transitions: e.g. f k f -> f<key>f
    generatedTokens.push(`f${key}f`, `j${key}j`, `d${key}d`, `k${key}k`);
  });

  // 2. Interleaved Key Trios (e.g. if keys are p, q, b -> pqb bqp qpb)
  if (cleanKeys.length >= 2) {
    const k1 = cleanKeys[0];
    const k2 = cleanKeys[1];
    const k3 = cleanKeys[2] || 'f';
    generatedTokens.push(`${k1}${k2}${k3}`, `${k3}${k2}${k1}`, `${k1}${k3}${k2}`, `${k2}${k1}${k3}`);
  }

  // 3. Real Vocabulary containing the target weak keys
  cleanKeys.forEach((key) => {
    const words = WORD_BANK_BY_LETTER[key] || [];
    const sample = words.slice(0, 4);
    generatedTokens.push(...sample);
  });

  // 4. Shuffle and adjust length
  const shuffled = [...generatedTokens].sort(() => Math.random() - 0.5);

  const targetCount = length === 'short' ? 18 : length === 'medium' ? 32 : 55;

  while (shuffled.length < targetCount) {
    cleanKeys.forEach((key) => {
      const words = WORD_BANK_BY_LETTER[key] || [`${key}a`, `${key}e`, `${key}o`];
      const randomWord = words[Math.floor(Math.random() * words.length)];
      shuffled.push(randomWord);
    });
  }

  return shuffled.slice(0, targetCount).join(' ');
}

/**
 * LocalStorage Helpers
 */
export function loadUserCourseProgress(): UserCourseProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return getInitialUserProgress();
    }
    const parsed = JSON.parse(raw);
    return {
      unlockedModuleIds: parsed.unlockedModuleIds || ['module-1'],
      unlockedLessonIds: parsed.unlockedLessonIds || ['lesson-1-1'],
      completedLessons: parsed.completedLessons || {},
      keyStats: parsed.keyStats || {},
      totalPracticeTimeSeconds: parsed.totalPracticeTimeSeconds || 0,
      highestWpm: parsed.highestWpm || 0,
      currentStreakDays: parsed.currentStreakDays || 1,
      lastPracticedDate: parsed.lastPracticedDate || new Date().toISOString().split('T')[0],
    };
  } catch (e) {
    console.error('Error loading typing course progress:', e);
    return getInitialUserProgress();
  }
}

export function saveUserCourseProgress(progress: UserCourseProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Error saving typing course progress:', e);
  }
}

export function getInitialUserProgress(): UserCourseProgress {
  return {
    unlockedModuleIds: ['module-1'],
    unlockedLessonIds: ['lesson-1-1'],
    completedLessons: {},
    keyStats: {},
    totalPracticeTimeSeconds: 0,
    highestWpm: 0,
    currentStreakDays: 1,
    lastPracticedDate: new Date().toISOString().split('T')[0],
  };
}
