import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { supabase } from '../lib/supabase';

const router = Router();

// 모든 일별 엔트리 조회
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { data: entries, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', req.userId)
      .order('date', { ascending: false });

    if (error) throw error;

    res.json(entries);
  } catch (error) {
    console.error('일별 엔트리 조회 오류:', error);
    res.status(500).json({ error: '일별 엔트리를 가져올 수 없습니다.' });
  }
});

// 오늘의 엔트리 조회
router.get('/today/entry', authenticateToken, async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: entry, error } = await supabase
      .from('daily_entries')
      .select('*')
      .eq('user_id', req.userId)
      .eq('date', today)
      .maybeSingle();

    if (error) throw error;

    res.json({ entry: entry || null });
  } catch (error) {
    console.error('오늘의 엔트리 조회 오류:', error);
    res.status(500).json({ error: '오늘의 엔트리를 가져올 수 없습니다.' });
  }
});

// 일별 엔트리 생성 또는 업데이트
router.post('/', authenticateToken, async (req: Request, res: Response) => {
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
      ai_encouragement,
    } = req.body as Record<string, string>;

    if (!diary_content || !detected_emotion || !selected_track_name || !selected_artist_name) {
      res.status(400).json({ error: '일기 내용, 감정, 곡명, 아티스트명은 필수입니다.' });
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    const { data: entry, error } = await supabase
      .from('daily_entries')
      .upsert(
        {
          user_id: req.userId,
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
          ai_encouragement,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,date' }
      )
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(entry);
  } catch (error) {
    console.error('일별 엔트리 저장 오류:', error);
    res.status(500).json({ error: '일별 엔트리를 저장할 수 없습니다.' });
  }
});

export default router;
