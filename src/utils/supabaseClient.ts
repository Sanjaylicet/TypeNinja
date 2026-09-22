import { createClient } from '@supabase/supabase-js';
import { UserCourseProgress } from '../types/course';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://ybacxmaqgaqbpgnmvrti.supabase.co';
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InliYWN4bWFxZ2FxYnBnbm12cnRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwODk2OTMsImV4cCI6MjEwNTY2NTY5M30.sRn4rrf-jQ27qP004EwHN1ZEkKQl1W21Aox80mLzRR0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Fetch progress from Supabase user_progress table
 */
export async function fetchUserCloudProgress(userId: string): Promise<UserCourseProgress | null> {
  try {
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.warn('Supabase fetchUserCloudProgress error:', error.message);
      return null;
    }

    if (!data) return null;

    return {
      unlockedModuleIds: Array.isArray(data.unlocked_module_ids)
        ? data.unlocked_module_ids
        : ['module-1'],
      unlockedLessonIds: Array.isArray(data.unlocked_lesson_ids)
        ? data.unlocked_lesson_ids
        : ['lesson-1-1'],
      completedLessons: data.completed_lessons || {},
      keyStats: data.key_stats || {},
      totalPracticeTimeSeconds: Number(data.total_practice_time_seconds) || 0,
      highestWpm: Number(data.highest_wpm) || 0,
      currentStreakDays: Number(data.current_streak_days) || 1,
      lastPracticedDate: data.updated_at
        ? new Date(data.updated_at).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    };
  } catch (err) {
    console.warn('Network error fetching cloud progress:', err);
    return null;
  }
}

/**
 * Save / Upsert user progress into Supabase user_progress table
 */
export async function saveUserCloudProgress(
  userId: string,
  progress: UserCourseProgress
): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = {
      user_id: userId,
      completed_lessons: progress.completedLessons,
      unlocked_lesson_ids: progress.unlockedLessonIds,
      unlocked_module_ids: progress.unlockedModuleIds,
      key_stats: progress.keyStats,
      highest_wpm: progress.highestWpm,
      current_streak_days: progress.currentStreakDays,
      total_practice_time_seconds: progress.totalPracticeTimeSeconds,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('user_progress')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      console.warn('Supabase saveUserCloudProgress error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.warn('Network error saving cloud progress:', err);
    return { success: false, error: err?.message || 'Network error' };
  }
}
