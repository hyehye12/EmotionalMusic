import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      diaries: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string;
          emotion: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          emotion: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          content?: string;
          emotion?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      emotion_analyses: {
        Row: {
          id: string;
          user_id: string;
          input_text: string;
          detected_emotion: string;
          advice: string;
          analysis_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          input_text: string;
          detected_emotion: string;
          advice: string;
          analysis_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          input_text?: string;
          detected_emotion?: string;
          advice?: string;
          analysis_type?: string;
          created_at?: string;
        };
      };
      music_recommendations: {
        Row: {
          id: string;
          user_id: string;
          emotion: string;
          track_name: string;
          artist_name: string;
          album_name: string;
          preview_url: string | null;
          artwork_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          emotion: string;
          track_name: string;
          artist_name: string;
          album_name: string;
          preview_url?: string | null;
          artwork_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          emotion?: string;
          track_name?: string;
          artist_name?: string;
          album_name?: string;
          preview_url?: string | null;
          artwork_url?: string | null;
          created_at?: string;
        };
      };
    };
  };
};