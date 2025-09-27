import { supabase } from '@/integrations/supabase/client';

export interface CourseProgressRecord {
  user_id: string;
  course_id: string;
  completed_lessons: string[];
  current_module: number;
  current_lesson: number;
  progress: number; // 0..100
  updated_at?: string;
}

class ProgressService {
  private getKey(userId: string, courseId: string) {
    return `course_progress_${userId}_${courseId}`;
  }

  async load(userId: string, courseId: string): Promise<CourseProgressRecord | null> {
    try {
      // Try Supabase first
      const { data, error } = await supabase
        .from('course_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .maybeSingle();

      if (error) throw error;
      if (data) return data as CourseProgressRecord;
    } catch (e) {
      // Fallback to localStorage
      const raw = localStorage.getItem(this.getKey(userId, courseId));
      if (raw) return JSON.parse(raw);
    }
    return null;
  }

  async save(userId: string, courseId: string, record: CourseProgressRecord): Promise<void> {
    // Always persist to localStorage for instant availability
    localStorage.setItem(this.getKey(userId, courseId), JSON.stringify(record));
    try {
      // Upsert into Supabase
      const { error } = await supabase
        .from('course_progress')
        .upsert({ ...record, user_id: userId, course_id: courseId });
      if (error) throw error;
    } catch (e) {
      // Ignore remote errors; local is the fallback
      console.warn('ProgressService remote save failed:', e);
    }
  }
}

export const progressService = new ProgressService();
export default ProgressService;


