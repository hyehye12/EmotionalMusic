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
    // 1차: JWT 시크릿으로 직접 검증
    if (SUPABASE_JWT_SECRET) {
      const decoded = jwt.verify(token, SUPABASE_JWT_SECRET);
      req.userId = decoded.sub; // Supabase는 사용자 ID를 'sub'에 저장
      req.userEmail = decoded.email;
      return next();
    }

    // 2차: Supabase API로 검증 (fallback)
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
    }
    
    req.userId = user.id;
    req.userEmail = user.email;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: '잘못된 토큰 형식입니다.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: '토큰이 만료되었습니다.' });
    }
    return res.status(403).json({ error: '토큰 검증에 실패했습니다.' });
  }
};

module.exports = {
  authenticateToken,
  SUPABASE_JWT_SECRET
};