import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다. .env 파일을 확인하세요.');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
