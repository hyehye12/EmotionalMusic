import { useState, useEffect, useCallback } from "react";
import {
  getMockEmotionAdvice,
  analyzeDiaryWithGPT,
  getMockGPTAnalysis,
  GPTAnalysisResult,
} from "../utils/gptService";

interface EmotionAdviceResult {
  emotion: string;
  advice: string;
}

export const useGPTAnalysis = (input: string) => {
  const [emotion, setEmotion] = useState("");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvice = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let result: EmotionAdviceResult;

      // API 키가 있으면 실제 GPT 호출, 없으면 모의 응답 사용
      if (process.env.REACT_APP_OPENAI_API_KEY) {
        result = await analyzeDiaryWithGPT(input);
      } else {
        // 모의 응답 사용 (약간의 지연 추가)
        await new Promise((resolve) => setTimeout(resolve, 1500));
        result = getMockEmotionAdvice(input);
      }

      setEmotion(result.emotion);
      setAdvice(result.advice);
    } catch (error) {
      console.error("GPT 호출 실패:", error);
      setError("감정 분석에 실패했어요. 잠시 후 다시 시도해주세요.");
      setEmotion("알 수 없음");
      setAdvice("감정 분석에 실패했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }, [input]);

  useEffect(() => {
    if (input) {
      fetchAdvice();
    }
  }, [input, fetchAdvice]);

  return { emotion, advice, loading, error, retry: fetchAdvice };
};

export const useDiaryAnalysis = (diaryText: string) => {
  const [analysis, setAnalysis] = useState<GPTAnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const performAnalysis = useCallback(async () => {
    if (!diaryText) return;

    try {
      setLoading(true);
      setError(null);

      // 실제 GPT API 호출 (API 키가 있으면)
      let result: GPTAnalysisResult;

      if (process.env.REACT_APP_OPENAI_API_KEY) {
        result = await analyzeDiaryWithGPT(diaryText);
      } else {
        // API 키가 없으면 모의 응답 사용
        result = getMockGPTAnalysis(diaryText);
        // 실제 API 호출처럼 약간의 지연 추가
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

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
