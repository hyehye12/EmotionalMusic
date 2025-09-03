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

// 음악 추천 저장
router.post('/recommendations', authenticateSession, async (req, res) => {
  try {
    const { emotion, track_name, artist_name, album_name, preview_url, artwork_url } = req.body;
    
    if (!emotion || !track_name || !artist_name) {
      return res.status(400).json({ error: '감정, 곡명, 아티스트명은 필수입니다.' });
    }

    const { data: recommendation, error } = await supabase
      .from('music_recommendations')
      .insert({
        user_id: req.session.userId,
        emotion,
        track_name,
        artist_name,
        album_name,
        preview_url,
        artwork_url
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: '음악 추천이 저장되었습니다.',
      recommendation
    });
  } catch (error) {
    console.error('Music recommendation save error:', error);
    res.status(500).json({ error: '음악 추천 저장 중 오류가 발생했습니다.' });
  }
});

// 사용자의 모든 음악 추천 조회
router.get('/recommendations', authenticateSession, async (req, res) => {
  try {
    const { data: recommendations, error } = await supabase
      .from('music_recommendations')
      .select('*')
      .eq('user_id', req.session.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(recommendations);
  } catch (error) {
    console.error('Music recommendations fetch error:', error);
    res.status(500).json({ error: '음악 추천을 가져올 수 없습니다.' });
  }
});

// 특정 감정의 음악 추천 조회
router.get('/recommendations/emotion/:emotion', authenticateSession, async (req, res) => {
  try {
    const { data: recommendations, error } = await supabase
      .from('music_recommendations')
      .select('*')
      .eq('user_id', req.session.userId)
      .eq('emotion', req.params.emotion)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(recommendations);
  } catch (error) {
    console.error('Emotion-specific recommendations fetch error:', error);
    res.status(500).json({ error: '감정별 음악 추천을 가져올 수 없습니다.' });
  }
});

// 음악 추천 삭제
router.delete('/recommendations/:id', authenticateSession, async (req, res) => {
  try {
    const { error } = await supabase
      .from('music_recommendations')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.session.userId);

    if (error) throw error;

    res.json({ message: '음악 추천이 삭제되었습니다.' });
  } catch (error) {
    console.error('Music recommendation deletion error:', error);
    res.status(500).json({ error: '음악 추천 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;