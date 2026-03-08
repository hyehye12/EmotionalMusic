import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { supabase } from '../lib/supabase';

const router = Router();

// 대시보드 데이터 조회
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const days = typeof req.query.days === 'string' ? parseInt(req.query.days, 10) : 30;

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const { data: emotionStats, error: emotionError } = await supabase
      .from('emotion_analyses')
      .select('detected_emotion, created_at')
      .eq('user_id', userId)
      .gte('created_at', fromDate.toISOString())
      .order('created_at', { ascending: false });

    if (emotionError) throw emotionError;

    const { data: recentDiaries, error: diaryError } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (diaryError) throw diaryError;

    const { data: recentMusic, error: musicError } = await supabase
      .from('music_recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (musicError) throw musicError;

    const emotionCounts: Record<string, number> = {};
    (emotionStats || []).forEach((analysis) => {
      const emotion = analysis.detected_emotion as string;
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });

    const { count: totalDiaries, error: diaryCountError } = await supabase
      .from('diaries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (diaryCountError) throw diaryCountError;

    const { count: totalMusic, error: musicCountError } = await supabase
      .from('music_recommendations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (musicCountError) throw musicCountError;

    const mostCommonEmotion = Object.entries(emotionCounts).reduce<[string, number]>(
      (a, b) => (a[1] > b[1] ? a : b),
      ['알 수 없음', 0]
    )[0];

    res.json({
      summary: {
        totalDiaries: totalDiaries || 0,
        totalMusic: totalMusic || 0,
        totalEmotionAnalyses: (emotionStats || []).length,
        mostCommonEmotion,
      },
      emotionStats: emotionCounts,
      recentDiaries: recentDiaries || [],
      recentMusic: recentMusic || [],
      chartData: (emotionStats || []).map((analysis) => ({
        date: (analysis.created_at as string).split('T')[0],
        emotion: analysis.detected_emotion,
      })),
    });
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    res.status(500).json({ error: '대시보드 데이터를 가져올 수 없습니다.' });
  }
});

// 감정 통계 조회
router.get('/emotions', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const days = typeof req.query.days === 'string' ? parseInt(req.query.days, 10) : 30;

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const { data: emotionStats, error } = await supabase
      .from('emotion_analyses')
      .select('detected_emotion, created_at')
      .eq('user_id', userId)
      .gte('created_at', fromDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    const dailyEmotions: Record<string, Record<string, number>> = {};
    const emotionCounts: Record<string, number> = {};

    (emotionStats || []).forEach((analysis) => {
      const date = (analysis.created_at as string).split('T')[0];
      const emotion = analysis.detected_emotion as string;

      if (!dailyEmotions[date]) dailyEmotions[date] = {};
      dailyEmotions[date][emotion] = (dailyEmotions[date][emotion] || 0) + 1;
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });

    res.json({
      dailyEmotions,
      emotionCounts,
      totalAnalyses: (emotionStats || []).length,
    });
  } catch (error) {
    console.error('Emotion stats fetch error:', error);
    res.status(500).json({ error: '감정 통계를 가져올 수 없습니다.' });
  }
});

export default router;
