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

// 오늘의 엔트리 생성 또는 업데이트
router.post('/', authenticateSession, async (req, res) => {
  try {
    const {
      diary_content,
      detected_emotion,
      selected_track_name,
      selected_artist_name,
      selected_album_name,
      selected_preview_url,
      selected_artwork_url,
      selected_track_view_url,
      ai_analysis,
      ai_advice,
      ai_encouragement
    } = req.body;
    
    if (!diary_content || !detected_emotion || !selected_track_name || !selected_artist_name) {
      return res.status(400).json({ error: '필수 정보가 누락되었습니다.' });
    }

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD 형식

    // 오늘 날짜의 기존 엔트리가 있는지 확인
    const { data: existingEntry } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', req.session.userId)
      .eq('date', today)
      .single();

    let result;
    
    if (existingEntry) {
      // 기존 엔트리 업데이트
      const { data, error } = await supabase
        .from('daily_entries')
        .update({
          diary_content,
          detected_emotion,
          selected_track_name,
          selected_artist_name,
          selected_album_name,
          selected_preview_url,
          selected_artwork_url,
          selected_track_view_url,
          ai_analysis,
          ai_advice,
          ai_encouragement,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingEntry.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // 새 엔트리 생성
      const { data, error } = await supabase
        .from('daily_entries')
        .insert({
          user_id: req.session.userId,
          date: today,
          diary_content,
          detected_emotion,
          selected_track_name,
          selected_artist_name,
          selected_album_name,
          selected_preview_url,
          selected_artwork_url,
          selected_track_view_url,
          ai_analysis,
          ai_advice,
          ai_encouragement
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    res.status(201).json({
      message: '오늘의 엔트리가 저장되었습니다.',
      entry: result
    });
  } catch (error) {
    console.error('Daily entry save error:', error);
    res.status(500).json({ error: '엔트리 저장 중 오류가 발생했습니다.' });
  }
});

// 사용자의 모든 일별 엔트리 조회
router.get('/', authenticateSession, async (req, res) => {
  try {
    const { limit = 30, offset = 0 } = req.query;

    const { data: entries, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', req.session.userId)
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    res.json(entries || []);
  } catch (error) {
    console.error('Daily entries fetch error:', error);
    res.status(500).json({ error: '엔트리를 가져올 수 없습니다.' });
  }
});

// ID로 엔트리 조회 (백워드 호환성)
router.get('/by-id/:id', authenticateSession, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: entry, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', req.session.userId)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: '해당 엔트리를 찾을 수 없습니다.' });
      }
      throw error;
    }

    res.json(entry);
  } catch (error) {
    console.error('Daily entry fetch by ID error:', error);
    res.status(500).json({ error: '엔트리를 가져올 수 없습니다.' });
  }
});

// 특정 날짜의 엔트리 조회
router.get('/:date', authenticateSession, async (req, res) => {
  try {
    const { date } = req.params;

    const { data: entry, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', req.session.userId)
      .eq('date', date)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: '해당 날짜의 엔트리를 찾을 수 없습니다.' });
      }
      throw error;
    }

    res.json(entry);
  } catch (error) {
    console.error('Daily entry fetch error:', error);
    res.status(500).json({ error: '엔트리를 가져올 수 없습니다.' });
  }
});

// 오늘의 엔트리 조회
router.get('/today/entry', authenticateSession, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: entry, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', req.session.userId)
      .eq('date', today)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.json({ entry: null, message: '오늘의 엔트리가 없습니다.' });
      }
      throw error;
    }

    res.json({ entry });
  } catch (error) {
    console.error('Today entry fetch error:', error);
    res.status(500).json({ error: '오늘의 엔트리를 가져올 수 없습니다.' });
  }
});

// 엔트리 삭제
router.delete('/:date', authenticateSession, async (req, res) => {
  try {
    const { date } = req.params;

    const { error } = await supabase
      .from('daily_entries')
      .delete()
      .eq('user_id', req.session.userId)
      .eq('date', date);

    if (error) throw error;

    res.json({ message: '엔트리가 삭제되었습니다.' });
  } catch (error) {
    console.error('Daily entry deletion error:', error);
    res.status(500).json({ error: '엔트리 삭제 중 오류가 발생했습니다.' });
  }
});

module.exports = router;