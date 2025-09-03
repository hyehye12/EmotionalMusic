// GPT API 서비스 - 통합 버전
import { safeJsonParse } from "./apiUtils";

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

//일기 분석 함수
export const analyzeDiaryWithGPT = async (
  diaryText: string
): Promise<GPTAnalysisResult> => {
  try {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

    if (!apiKey) {
      console.log("API 키가 없어 모의 응답을 사용합니다.");
      return getMockGPTAnalysis(diaryText);
    }

    // 실제 GPT API 호출
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `당신은 따뜻하고 공감적인 감정 상담사입니다. 사용자의 일기를 분석하여 감정을 파악하고, 
            공감과 위로, 그리고 실용적인 조언을 제공해주세요. 
            
            반드시 다음 JSON 형식으로만 응답해주세요:
            {
              "emotion": "감정 (행복함/우울함/스트레스/설렘/평온함/지침 중 하나)",
              "analysis": "일기에 대한 깊이 있는 분석 (2-3문장)",
              "advice": "실용적인 조언이나 해결책 (2-3문장)",
              "encouragement": "따뜻한 격려나 응원의 말 (1-2문장)"
            }
            
            JSON 외의 다른 텍스트는 포함하지 마세요.`,
          },
          {
            role: "user",
            content: `다음은 사용자가 작성한 일기입니다. 위의 JSON 형식에 맞춰 분석해주세요:\n\n${diaryText}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("GPT API 에러:", response.status, errorText);
      throw new Error(`GPT API 호출 실패: ${response.status}`);
    }

    const data = await safeJsonParse(response);
    let content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error("GPT 응답에 content가 없습니다.");
    }

    // JSON 파싱을 위해 불필요한 텍스트 제거
    content = content.trim();

    // JSON 코드 블록이 있다면 추출
    if (content.includes("```json")) {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        content = jsonMatch[1];
      }
    } else if (content.includes("```")) {
      const jsonMatch = content.match(/```\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        content = jsonMatch[1];
      }
    }

    try {
      const result = JSON.parse(content);

      // 필수 필드 검증
      if (
        !result.emotion ||
        !result.analysis ||
        !result.advice ||
        !result.encouragement
      ) {
        throw new Error("GPT 응답에 필수 필드가 누락되었습니다.");
      }

      return {
        emotion: result.emotion,
        analysis: result.analysis,
        advice: result.advice,
        encouragement: result.encouragement,
      };
    } catch (parseError) {
      console.error("JSON 파싱 오류:", parseError);
      console.error("파싱 시도한 내용:", content);

      // JSON 파싱 실패 시 정규식으로 값 추출 시도
      const emotion =
        content.match(/"emotion"\s*:\s*"([^"]+)"/)?.[1] || "평온함";
      const analysis =
        content.match(/"analysis"\s*:\s*"([^"]+)"/)?.[1] ||
        "일기 분석 중 오류가 발생했습니다.";
      const advice =
        content.match(/"advice"\s*:\s*"([^"]+)"/)?.[1] ||
        "마음을 편안하게 하고 충분한 휴식을 취하세요.";
      const encouragement =
        content.match(/"encouragement"\s*:\s*"([^"]+)"/)?.[1] ||
        "당신은 충분히 잘하고 있어요! 💪";

      return { emotion, analysis, advice, encouragement };
    }
  } catch (error) {
    console.error("GPT 분석 오류:", error);

    // API 호출 실패 시 모의 응답 사용
    return getMockGPTAnalysis(diaryText);
  }
};

// 모의 GPT 응답 (API 키가 없을 때 사용)
export const getMockGPTAnalysis = (diaryText: string): GPTAnalysisResult => {
  const emotions = ["행복함", "우울함", "스트레스", "설렘", "평온함", "지침"];
  const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];

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
      encouragement: "당신의 설렘은 아름다워요. 이 순간을 소중히 여기세요! ��",
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
    emotion: randomEmotion,
    analysis:
      mockResponses[randomEmotion as keyof typeof mockResponses].analysis,
    advice: mockResponses[randomEmotion as keyof typeof mockResponses].advice,
    encouragement:
      mockResponses[randomEmotion as keyof typeof mockResponses].encouragement,
  };
};

// 모의 EmotionAdvice 응답 (API 키가 없을 때 사용)
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
