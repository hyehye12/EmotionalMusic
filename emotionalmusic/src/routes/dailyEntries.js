const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Supabase 설정
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseServiceKey = process.env.REACT_APP_SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 일기 목록 조회
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { data: entries, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', req.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(entries);
  } catch (error) {
    console.error('일기 목록 조회 오류:', error);
    res.status(500).json({ error: '일기 목록을 가져올 수 없습니다.' });
  }
});

// 특정 일기 조회
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: entry, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.userId)
      .single();

    if (error) throw error;

    res.json(entry);
  } catch (error) {
    console.error('일기 조회 오류:', error);
    res.status(500).json({ error: '일기를 가져올 수 없습니다.' });
  }
});

// 일기 생성
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, content, emotion } = req.body;

    if (!title || !content || !emotion) {
      return res.status(400).json({ error: '제목, 내용, 감정을 모두 입력해주세요.' });
    }

    const { data: entry, error } = await supabase
      .from('diaries')
      .insert({
        user_id: req.userId,
        title,
        content,
        emotion
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(entry);
  } catch (error) {
    console.error('일기 생성 오류:', error);
    res.status(500).json({ error: '일기를 저장할 수 없습니다.' });
  }
});

// 일기 수정
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, emotion } = req.body;

    const { data: entry, error } = await supabase
      .from('diaries')
      .update({
        title,
        content,
        emotion,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', req.userId)
      .select()
      .single();

    if (error) throw error;

    res.json(entry);
  } catch (error) {
    console.error('일기 수정 오류:', error);
    res.status(500).json({ error: '일기를 수정할 수 없습니다.' });
  }
});

// 일기 삭제
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('diaries')
      .delete()
      .eq('id', id)
      .eq('user_id', req.userId);

    if (error) throw error;

    res.json({ message: '일기가 삭제되었습니다.' });
  } catch (error) {
    console.error('일기 삭제 오류:', error);
    res.status(500).json({ error: '일기를 삭제할 수 없습니다.' });
  }
});

// 최근 일기 조회 (7일)
router.get('/recent/week', authenticateToken, async (req, res) => {
  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { data: entries, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', req.userId)
      .gte('created_at', weekAgo.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(entries);
  } catch (error) {
    console.error('최근 일기 조회 오류:', error);
    res.status(500).json({ error: '최근 일기를 가져올 수 없습니다.' });
  }
});

// 월별 일기 조회
router.get('/month/:year/:month', authenticateToken, async (req, res) => {
  try {
    const { year, month } = req.params;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const { data: entries, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', req.userId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(entries);
  } catch (error) {
    console.error('월별 일기 조회 오류:', error);
    res.status(500).json({ error: '월별 일기를 가져올 수 없습니다.' });
  }
});

// 감정별 일기 조회
router.get('/emotion/:emotion', authenticateToken, async (req, res) => {
  try {
    const { emotion } = req.params;

    const { data: entries, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', req.userId)
      .eq('emotion', emotion)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(entries);
  } catch (error) {
    console.error('감정별 일기 조회 오류:', error);
    res.status(500).json({ error: '감정별 일기를 가져올 수 없습니다.' });
  }
});

// 일기 통계 조회
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    const { data: entries, error } = await supabase
      .from('diaries')
      .select('emotion, created_at')
      .eq('user_id', req.userId);

    if (error) throw error;

    // 감정별 통계
    const emotionStats = {};
    const monthlyStats = {};

    entries.forEach(entry => {
      // 감정별 카운트
      emotionStats[entry.emotion] = (emotionStats[entry.emotion] || 0) + 1;

      // 월별 카운트
      const date = new Date(entry.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyStats[monthKey] = (monthlyStats[monthKey] || 0) + 1;
    });

    res.json({
      totalEntries: entries.length,
      emotionStats,
      monthlyStats,
      recentEntries: entries.slice(0, 5)
    });
  } catch (error) {
    console.error('일기 통계 조회 오류:', error);
    res.status(500).json({ error: '일기 통계를 가져올 수 없습니다.' });
  }
});

module.exports = router;