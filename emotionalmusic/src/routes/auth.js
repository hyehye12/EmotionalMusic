const express = require('express');
const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Supabase 설정
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 유효성 검사 함수들
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  if (password.length < 8) {
    return { isValid: false, message: '비밀번호는 최소 8자 이상이어야 합니다.' };
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return { isValid: false, message: '비밀번호에 소문자가 포함되어야 합니다.' };
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return { isValid: false, message: '비밀번호에 대문자가 포함되어야 합니다.' };
  }
  if (!/(?=.*\d)/.test(password)) {
    return { isValid: false, message: '비밀번호에 숫자가 포함되어야 합니다.' };
  }
  return { isValid: true };
};

// 회원가입
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
    }

    // 이메일 유효성 검사
    if (!validateEmail(email)) {
      return res.status(400).json({ error: '올바른 이메일 형식을 입력해주세요.' });
    }

    // 비밀번호 유효성 검사
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return res.status(400).json({ error: passwordValidation.message });
    }

    // 이미 존재하는 사용자인지 확인
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: '이미 등록된 이메일입니다.' });
    }

    // 비밀번호 해시
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새 사용자 생성
    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        email,
        password: hashedPassword
      })
      .select()
      .single();

    if (error) throw error;

    // 세션에 사용자 정보 저장
    req.session.userId = newUser.id;
    req.session.user = {
      id: newUser.id,
      email: newUser.email
    };

    res.status(201).json({
      message: '회원가입이 완료되었습니다.',
      user: {
        id: newUser.id,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
  }
});

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '이메일과 비밀번호를 입력해주세요.' });
    }

    // 이메일 유효성 검사
    if (!validateEmail(email)) {
      return res.status(400).json({ error: '올바른 이메일 형식을 입력해주세요.' });
    }

    // 사용자 찾기
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(400).json({ error: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    // 세션에 사용자 정보 저장
    req.session.userId = user.id;
    req.session.user = {
      id: user.id,
      email: user.email
    };

    res.json({
      message: '로그인 성공',
      user: {
        id: user.id,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: '로그인 중 오류가 발생했습니다.' });
  }
});

// 세션 검증 미들웨어
const authenticateSession = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }
  next();
};

// 사용자 정보 조회
router.get('/me', authenticateSession, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, created_at')
      .eq('id', req.session.userId)
      .single();

    if (error) throw error;

    res.json(user);
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({ error: '사용자 정보를 가져올 수 없습니다.' });
  }
});

// 로그아웃
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: '로그아웃 중 오류가 발생했습니다.' });
    }
    res.clearCookie('connect.sid'); // 세션 쿠키 제거
    res.json({ message: '로그아웃 성공' });
  });
});

module.exports = router;