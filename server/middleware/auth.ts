import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

export const SUPABASE_JWT_SECRET = process.env.REACT_APP_SUPABASE_JWT_SECRET || '';

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ error: '로그인이 필요합니다.' });
    return;
  }

  try {
    if (SUPABASE_JWT_SECRET) {
      const decoded = jwt.verify(token, SUPABASE_JWT_SECRET) as jwt.JwtPayload;
      req.userId = decoded.sub;
      req.userEmail = decoded.email as string | undefined;
      next();
      return;
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(403).json({ error: '유효하지 않은 토큰입니다.' });
      return;
    }

    req.userId = user.id;
    req.userEmail = user.email;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(403).json({ error: '잘못된 토큰 형식입니다.' });
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      res.status(403).json({ error: '토큰이 만료되었습니다.' });
      return;
    }
    res.status(403).json({ error: '토큰 검증에 실패했습니다.' });
  }
};
