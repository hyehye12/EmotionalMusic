-- 일별 엔트리 테이블 추가 (일기 + 그날의 음악 조합)
CREATE TABLE IF NOT EXISTS daily_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  diary_content TEXT NOT NULL,
  detected_emotion VARCHAR(50) NOT NULL,
  selected_track_name VARCHAR(255) NOT NULL,
  selected_artist_name VARCHAR(255) NOT NULL,
  selected_album_name VARCHAR(255),
  selected_preview_url TEXT,
  selected_artwork_url TEXT,
  selected_track_view_url TEXT,
  ai_analysis TEXT,
  ai_advice TEXT,
  ai_encouragement TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date) -- 한 사용자당 하루에 하나의 엔트리만
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_daily_entries_user_id ON daily_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_entries_date ON daily_entries(date);
CREATE INDEX IF NOT EXISTS idx_daily_entries_user_date ON daily_entries(user_id, date);

-- RLS 정책 설정
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;

-- Daily entries 테이블 정책
CREATE POLICY "Users can view own daily entries" ON daily_entries
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own daily entries" ON daily_entries
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own daily entries" ON daily_entries
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own daily entries" ON daily_entries
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- updated_at 트리거 생성
CREATE TRIGGER update_daily_entries_updated_at BEFORE UPDATE ON daily_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();