// GPT API 서비스 - 서버 프록시를 통해 호출 (API 키 브라우저 노출 방지)
import { safeJsonParse } from "./apiUtils";
import { analyzeEmotion } from "./emotionAnalyzer";

export interface GPTAnalysisResult {
  emotion: string;
  analysis: string;
  advice: string;
  encouragement: string;
}

export interface EmotionAdviceResult {
  emotion: string;
  advice: string;
}

// 일기 분석 함수 - 서버 프록시(/api/gpt/analyze-diary)를 통해 호출
export const analyzeDiaryWithGPT = async (
  diaryText: string
): Promise<GPTAnalysisResult> => {
  const apiUrl = process.env.REACT_APP_API_URL;

  if (!apiUrl) {
    return getMockGPTAnalysis(diaryText);
  }

  try {
    const response = await fetch(`${apiUrl}/api/gpt/analyze-diary`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ diaryText }),
    });

    if (!response.ok) {
      throw new Error(`서버 오류: ${response.status}`);
    }

    const result = await safeJsonParse(response);

    if (!result.emotion || !result.analysis || !result.advice || !result.encouragement) {
      throw new Error("응답 데이터가 불완전합니다.");
    }

    return {
      emotion: result.emotion,
      analysis: result.analysis,
      advice: result.advice,
      encouragement: result.encouragement,
    };
  } catch (error) {
    console.error("GPT 분석 오류:", error);
    return getMockGPTAnalysis(diaryText);
  }
};

// 모의 GPT 응답 (서버 연결 불가 시 사용)
export const getMockGPTAnalysis = (diaryText: string): GPTAnalysisResult => {
  const detectedEmotion = analyzeEmotion(diaryText);

  const mockResponses = {
    행복함: {
      analysis:
        "당신의 긍정적인 에너지가 일기에서 느껴져요. 좋은 일들이 있었던 하루였군요.",
      advice:
        "이런 기분 좋은 순간들을 잘 기억해두세요. 그리고 주변 사람들과도 기쁨을 나누어보세요.",
      encouragement:
        "당신의 긍정적인 마음가짐이 더 많은 좋은 일들을 불러올 거예요! ✨",
    },
    우울함: {
      analysis:
        "마음이 무겁고 슬픈 하루였군요. 이런 감정을 느끼는 것은 자연스러운 일이에요.",
      advice:
        "자신의 감정을 억누르지 말고, 충분히 느껴보세요. 필요하다면 누군가와 이야기를 나누어보세요.",
      encouragement:
        "이 어려운 시간도 지나갈 거예요. 당신은 혼자가 아니에요. 💙",
    },
    스트레스: {
      analysis:
        "긴장되고 스트레스 받는 하루였네요. 이런 감정이 드는 것은 당연한 일이에요.",
      advice:
        "깊은 호흡을 하고, 잠시 쉬어가는 것도 좋은 방법이에요. 자신에게 너무 많은 것을 요구하지 마세요.",
      encouragement:
        "당신은 충분히 강해요. 이 어려움도 이겨낼 수 있을 거예요! 💪",
    },
    설렘: {
      analysis:
        "두근두근 설레는 마음이 느껴져요! 새로운 경험이나 만남이 있었던 것 같아요.",
      advice:
        "이 설렘을 즐기되, 너무 긴장하지 마세요. 자연스럽게 흘러가는 대로 해보세요.",
      encouragement: "당신의 설렘은 아름다워요. 이 순간을 소중히 여기세요! 🌸",
    },
    평온함: {
      analysis: "차분하고 평온한 하루였군요. 마음의 평화를 찾으신 것 같아요.",
      advice:
        "이런 평온한 순간들을 잘 간직하세요. 명상이나 요가 같은 활동도 도움이 될 수 있어요.",
      encouragement:
        "당신의 평온함이 주변 사람들에게도 좋은 영향을 줄 거예요! 🌸",
    },
    지침: {
      analysis: "지치고 피곤한 하루였네요. 많은 일들이 있었던 것 같아요.",
      advice:
        "충분한 휴식을 취하고, 자신에게 친절하게 대하세요. 무리하지 마세요.",
      encouragement:
        "오늘 하루도 수고했어요. 내일은 더 나은 하루가 될 거예요! 🌙",
    },
  };

  return {
    emotion: detectedEmotion,
    analysis:
      mockResponses[detectedEmotion as keyof typeof mockResponses].analysis,
    advice: mockResponses[detectedEmotion as keyof typeof mockResponses].advice,
    encouragement:
      mockResponses[detectedEmotion as keyof typeof mockResponses].encouragement,
  };
};

// 모의 EmotionAdvice 응답 (서버 연결 불가 시 사용)
export const getMockEmotionAdvice = (
  userInput: string
): EmotionAdviceResult => {
  const emotions = ["행복함", "우울함", "스트레스", "설렘", "평온함", "지침"];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];

  const mockAdvice = {
    행복함: "당신의 긍정적인 에너지가 주변 사람들에게도 좋은 영향을 줄 거예요!",
    우울함: "이 어려운 시간도 지나갈 거예요. 당신은 혼자가 아니에요.",
    스트레스: "깊은 호흡을 하고, 잠시 쉬어가는 것도 좋은 방법이에요.",
    설렘: "당신의 설렘은 아름다워요. 이 순간을 소중히 여기세요!",
    평온함: "당신의 평온함이 주변 사람들에게도 좋은 영향을 줄 거예요!",
    지침: "오늘 하루도 수고했어요. 내일은 더 나은 하루가 될 거예요!",
  };

  return {
    emotion: randomEmotion,
    advice: mockAdvice[randomEmotion as keyof typeof mockAdvice],
  };
};
