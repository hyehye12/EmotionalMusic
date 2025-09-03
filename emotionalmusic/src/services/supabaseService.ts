import { supabase } from '../config/supabase';

export interface User {
  id: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
}

export interface Diary {
  id: string;
  user_id: string;
  title: string;
  content: string;
  emotion: string;
  created_at: string;
  updated_at: string;
}

export interface EmotionAnalysis {
  id: string;
  user_id: string;
  input_text: string;
  detected_emotion: string;
  advice: string;
  analysis_type: string;
  created_at: string;
}

export interface MusicRecommendation {
  id: string;
  user_id: string;
  emotion: string;
  track_name: string;
  artist_name: string;
  album_name: string;
  preview_url: string | null;
  artwork_url: string | null;
  created_at: string;
}

export class SupabaseService {
  // User operations
  static async createUser(userData: { email: string; password: string }) {
    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserByEmail(email: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async getUserById(id: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  // Diary operations
  static async createDiary(diaryData: {
    user_id: string;
    title: string;
    content: string;
    emotion: string;
  }) {
    const { data, error } = await supabase
      .from('diaries')
      .insert([diaryData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserDiaries(userId: string) {
    const { data, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getDiaryById(id: string) {
    const { data, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateDiary(id: string, updates: Partial<Diary>) {
    const { data, error } = await supabase
      .from('diaries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async deleteDiary(id: string) {
    const { error } = await supabase
      .from('diaries')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }

  // Emotion Analysis operations
  static async createEmotionAnalysis(analysisData: {
    user_id: string;
    input_text: string;
    detected_emotion: string;
    advice: string;
    analysis_type: string;
  }) {
    const { data, error } = await supabase
      .from('emotion_analyses')
      .insert([analysisData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserEmotionAnalyses(userId: string) {
    const { data, error } = await supabase
      .from('emotion_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Music Recommendation operations
  static async createMusicRecommendation(recommendationData: {
    user_id: string;
    emotion: string;
    track_name: string;
    artist_name: string;
    album_name: string;
    preview_url?: string | null;
    artwork_url?: string | null;
  }) {
    const { data, error } = await supabase
      .from('music_recommendations')
      .insert([recommendationData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  static async getUserMusicRecommendations(userId: string) {
    const { data, error } = await supabase
      .from('music_recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  // Dashboard operations
  static async getUserEmotionStats(userId: string, days: number = 30) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);
    
    const { data, error } = await supabase
      .from('emotion_analyses')
      .select('detected_emotion, created_at')
      .eq('user_id', userId)
      .gte('created_at', fromDate.toISOString())
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async getRecentDiaries(userId: string, limit: number = 5) {
    const { data, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data;
  }
}