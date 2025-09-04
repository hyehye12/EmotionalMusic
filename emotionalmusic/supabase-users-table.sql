-- users 테이블 생성 (기본 인증용)

-- 1. users 테이블 생성
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS (Row Level Security) 정책 설정
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 3. users 테이블에 대한 정책 생성 (모든 사용자가 읽기/쓰기 가능)
CREATE POLICY "Enable all access for users" ON users
FOR ALL USING (true) WITH CHECK (true);

-- 4. 테스트용 사용자 데이터 추가
INSERT INTO users (email, password) VALUES 
('joak0201@naver.com', 'password123')
ON CONFLICT (email) DO NOTHING;

-- 5. 테이블 생성 확인
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'users';

-- 6. 사용자 데이터 확인
SELECT * FROM users WHERE email = 'joak0201@naver.com';
