const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Supabase 설정
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Supabase Auth를 사용하므로 별도 회원가입/로그인 엔드포인트는 불필요


// 사용자 정보 조회 (Supabase Auth 사용자)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    // Supabase Auth에서 사용자 정보는 이미 토큰에 포함되어 있음
    res.json({
      id: req.userId,
      email: req.userEmail,
      created_at: new Date().toISOString() // 기본값
    });
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({ error: '사용자 정보를 가져올 수 없습니다.' });
  }
});

// 로그아웃 (JWT는 클라이언트에서 토큰 삭제로 처리)
router.post('/logout', (req, res) => {
  res.json({ message: '로그아웃 성공' });
});

module.exports = router;