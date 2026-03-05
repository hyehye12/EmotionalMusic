// src/lib/supabase.ts - Supabase 클라이언트 단일 관리
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "환경변수 REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY가 설정되지 않았습니다."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
