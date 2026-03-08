import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { supabase } from '../lib/supabase';

const router = Router();

router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    res.json({
      id: req.userId,
      email: req.userEmail,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('User fetch error:', error);
    res.status(500).json({ error: '사용자 정보를 가져올 수 없습니다.' });
  }
});

router.post('/logout', (_req: Request, res: Response) => {
  res.json({ message: '로그아웃 성공' });
});

export default router;
