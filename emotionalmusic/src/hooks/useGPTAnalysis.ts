import { useState, useEffect, useCallback } from "react";
import {
  analyzeDiaryWithGPT,
  GPTAnalysisResult,
} from "../utils/gptService";

export const useDiaryAnalysis = (diaryText: string) => {
  const [analysis, setAnalysis] = useState<GPTAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const performAnalysis = useCallback(async () => {
    if (!diaryText) return;

    try {
      setLoading(true);
      setError(null);

      const result: GPTAnalysisResult = await analyzeDiaryWithGPT(diaryText);

      setAnalysis(result);
    } catch (err) {
      console.error("GPT 분석 오류:", err);
      setError("분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }, [diaryText]);

  useEffect(() => {
    performAnalysis();
  }, [performAnalysis]);

  return { analysis, loading, error, retry: performAnalysis };
};
