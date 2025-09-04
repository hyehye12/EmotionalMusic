const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

// Supabase 설정
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// JWT 설정 (Supabase JWT 시크릿)
const SUPABASE_JWT_SECRET = process.env.REACT_APP_SUPABASE_JWT_SECRET || '';

// Supabase JWT 토큰 검증 미들웨어
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }

  try {
    // Supabase JWT 토큰 검증
    if (SUPABASE_JWT_SECRET) {
      // JWT 시크릿이 있으면 직접 검증
      const decoded = jwt.verify(token, SUPABASE_JWT_SECRET);
      req.userId = decoded.sub; // Supabase는 사용자 ID를 'sub'에 저장
      req.userEmail = decoded.email;
      next();
    } else {
      // Supabase API를 통한 토큰 검증
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
      }
      
      req.userId = user.id;
      req.userEmail = user.email;
      next();
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
  }
};

module.exports = {
  authenticateToken,
  SUPABASE_JWT_SECRET
};