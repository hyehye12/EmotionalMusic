const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Supabase 설정
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 세션 검증 미들웨어
const authenticateSession = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: '로그인이 필요합니다.' });
  }
  next();
};

// 대시보드 데이터 조회
router.get('/', authenticateSession, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { days = 30 } = req.query;

    // 날짜 범위 설정
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - parseInt(days));

    // 감정 분석 통계
    const { data: emotionStats, error: emotionError } = await supabase
      .from('emotion_analyses')
      .select('detected_emotion, created_at')
      .eq('user_id', userId)
      .gte('created_at', fromDate.toISOString())
      .order('created_at', { ascending: false });

    if (emotionError) throw emotionError;

    // 최근 일기
    const { data: recentDiaries, error: diaryError } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (diaryError) throw diaryError;

    // 최근 음악 추천
    const { data: recentMusic, error: musicError } = await supabase
      .from('music_recommendations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (musicError) throw musicError;

    // 감정 통계 계산
    const emotionCounts = {};
    emotionStats.forEach(analysis => {
      const emotion = analysis.detected_emotion;
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });

    // 총 일기 수
    const { count: totalDiaries, error: diaryCountError } = await supabase
      .from('diaries')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (diaryCountError) throw diaryCountError;

    // 총 음악 추천 수
    const { count: totalMusic, error: musicCountError } = await supabase
      .from('music_recommendations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (musicCountError) throw musicCountError;

    // 가장 많은 감정
    const mostCommonEmotion = Object.entries(emotionCounts).reduce((a, b) => 
      emotionCounts[a[0]] > emotionCounts[b[0]] ? a : b, ['알 수 없음', 0]
    )[0];

    res.json({
      summary: {
        totalDiaries: totalDiaries || 0,
        totalMusic: totalMusic || 0,
        totalEmotionAnalyses: emotionStats.length,
        mostCommonEmotion
      },
      emotionStats: emotionCounts,
      recentDiaries: recentDiaries || [],
      recentMusic: recentMusic || [],
      chartData: emotionStats.map(analysis => ({
        date: analysis.created_at.split('T')[0],
        emotion: analysis.detected_emotion
      }))
    });
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    res.status(500).json({ error: '대시보드 데이터를 가져올 수 없습니다.' });
  }
});

// 감정 통계 조회
router.get('/emotions', authenticateSession, async (req, res) => {
  try {
    const userId = req.session.userId;
    const { days = 30 } = req.query;

    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - parseInt(days));

    const { data: emotionStats, error } = await supabase
      .from('emotion_analyses')
      .select('detected_emotion, created_at')
      .eq('user_id', userId)
      .gte('created_at', fromDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    // 일별 감정 데이터 그룹화
    const dailyEmotions = {};
    emotionStats.forEach(analysis => {
      const date = analysis.created_at.split('T')[0];
      if (!dailyEmotions[date]) {
        dailyEmotions[date] = {};
      }
      const emotion = analysis.detected_emotion;
      dailyEmotions[date][emotion] = (dailyEmotions[date][emotion] || 0) + 1;
    });

    // 감정별 총 개수
    const emotionCounts = {};
    emotionStats.forEach(analysis => {
      const emotion = analysis.detected_emotion;
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });

    res.json({
      dailyEmotions,
      emotionCounts,
      totalAnalyses: emotionStats.length
    });
  } catch (error) {
    console.error('Emotion stats fetch error:', error);
    res.status(500).json({ error: '감정 통계를 가져올 수 없습니다.' });
  }
});

module.exports = router;