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

// 일기 생성
router.post('/', authenticateSession, async (req, res) => {
  try {
    const { title, content, emotion } = req.body;
    
    if (!title || !content || !emotion) {
      return res.status(400).json({ error: '제목, 내용, 감정은 필수입니다.' });
    }

    const { data: newDiary, error } = await supabase
      .from('diaries')
      .insert({
        user_id: req.session.userId,
        title,
        content,
        emotion
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      message: '일기가 저장되었습니다.',
      diary: newDiary
    });
  } catch (error) {
    console.error('Diary creation error:', error);
    res.status(500).json({ error: '일기 저장 중 오류가 발생했습니다.' });
  }
});

// 사용자의 모든 일기 조회
router.get('/', authenticateSession, async (req, res) => {
  try {
    const { data: diaries, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('user_id', req.session.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json(diaries);
  } catch (error) {
    console.error('Diary fetch error:', error);
    res.status(500).json({ error: '일기를 가져올 수 없습니다.' });
  }
});

// 특정 일기 조회
router.get('/:id', authenticateSession, async (req, res) => {
  try {
    const { data: diary, error } = await supabase
      .from('diaries')
      .select('*')
      .eq('id', req.params.id)
      .eq('user_id', req.session.userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: '일기를 찾을 수 없습니다.' });
      }
      throw error;
    }

    res.json(diary);
  } catch (error) {
    console.error('Diary fetch error:', error);
    res.status(500).json({ error: '일기를 가져올 수 없습니다.' });
  }
});

// 일기 수정
router.put('/:id', authenticateSession, async (req, res) => {
  try {
    const { title, content, emotion } = req.body;
    
    const { data: updatedDiary, error } = await supabase
      .from('diaries')
      .update({
        title,
        content,
        emotion,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .eq('user_id', req.session.userId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: '일기를 찾을 수 없습니다.' });
      }
      throw error;
    }

    res.json({
      message: '일기가 수정되었습니다.',
      diary: updatedDiary
    });
  } catch (error) {
    console.error('Diary update error:', error);
    res.status(500).json({ error: '일기 수정 중 오류가 발생했습니다.' });
  }
});

// 일기 삭제
router.delete('/:id', authenticateSession, async (req, res) => {
  try {
    const { error } = await supabase
      .from('diaries')
      .delete()
      .eq('id', req.params.id)
      .eq('user_id', req.session.userId);

    if (error) throw error;

    res.json({ message: '일기가 삭제되었습니다.' });
  } catch (error) {
    console.error('Diary deletion error:', error);
    res.status(500).json({ error: '일기 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;