import { createClient } from '@supabase/supabase-js';

// 임시로 실제 Supabase 정보를 입력하세요
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://YOUR_PROJECT_ID.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY_HERE';

console.log('환경 변수 확인:');
console.log('REACT_APP_SUPABASE_URL:', supabaseUrl);
console.log('REACT_APP_SUPABASE_ANON_KEY:', supabaseAnonKey ? '설정됨' : '설정되지 않음');

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('YOUR_PROJECT_ID') || supabaseAnonKey.includes('YOUR_ANON_KEY')) {
  throw new Error('Please replace YOUR_PROJECT_ID and YOUR_ANON_KEY_HERE with actual Supabase values');
}

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