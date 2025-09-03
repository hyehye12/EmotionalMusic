import { useState, useCallback } from 'react';

export const useDiaryStore = () => {
  const [diaryText, setDiaryTextState] = useState<string>('');

  const setDiaryText = useCallback((text: string) => {
    setDiaryTextState(text);
  }, []);

  const getDiaryText = useCallback((): string => {
    return diaryText;
  }, [diaryText]);

  const clearDiaryText = useCallback(() => {
    setDiaryTextState('');
  }, []);

  return {
    diaryText,
    setDiaryText,
    getDiaryText,
    clearDiaryText,
  };
}; 