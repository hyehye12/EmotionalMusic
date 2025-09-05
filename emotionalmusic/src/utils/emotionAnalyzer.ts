// 감정별 키워드 매핑
const emotionKeywords = {
  "행복함": [
    "행복", "기쁨", "즐거움", "웃음", "좋아", "만족", "성취", "축하", "축하해", "기뻐",
    "웃었", "즐거웠", "행복했", "성공", "완료", "끝냈", "해냈", "좋았", "멋있", "최고",
    "신나", "신났", "재밌", "재미있", "흥미", "놀라", "감동", "뿌듯", "자랑", "뛰어",
    "환상", "대박", "훌륭", "완벽", "근사", "아름다", "예쁘", "사랑스러", "달달", "달콤"
  ],
  "우울함": [
    "우울", "슬픔", "눈물", "힘들어", "지쳐", "외로워", "허전", "아파", "상처", "절망",
    "슬펐", "우울했", "외로웠", "허전했", "아팠", "상처받", "실패", "망했", "끝났", "이별",
    "울었", "눈물이", "서럽", "비참", "막막", "답답", "암울", "어둡", "침울", "처량",
    "쓸쓸", "고독", "공허", "무너", "좌절", "포기", "체념", "한숨", "후회", "미안"
  ],
  "스트레스": [
    "스트레스", "짜증", "화나", "분노", "열받", "짜증나", "힘들어", "압박", "긴장", "불안",
    "화났", "짜증났", "분노했", "열받았", "압박받", "긴장했", "불안했", "짜증", "화남", "분노",
    "답답", "골치", "머리", "복잡", "바빠", "바쁘", "급해", "쫓기", "빡쳐", "빡치",
    "신경", "예민", "민감", "날카로", "과로", "피로", "지겨", "귀찮", "성가", "골치"
  ],
  "설렘": [
    "설렘", "두근", "떨려", "긴장", "기대", "새롭", "첫", "만남", "데이트", "로맨스",
    "설렜", "두근거렸", "떨렸", "기대했", "새로웠", "첫번째", "만났", "사랑", "연애", "고백",
    "심장", "가슴", "떨림", "들뜸", "들떠", "흥분", "궁금", "호기심", "관심", "매력",
    "아름답", "예쁘", "멋있", "좋아해", "호감", "끌려", "반해", "매혹", "황홀", "달콤"
  ],
  "평온함": [
    "평온", "차분", "고요", "여유", "편안", "안정", "조용", "힐링", "휴식", "명상",
    "평온했", "차분했", "고요했", "여유로웠", "편안했", "안정적", "조용했", "힐링했", "휴식했", "명상했",
    "진정", "정적", "고즈넉", "한적", "느긋", "천천히", "여유", "릴렉스", "쉬었", "쉼",
    "평범", "일상", "소소", "담담", "무난", "괜찮", "적당", "알맞", "자연스러", "순수"
  ],
  "지침": [
    "지침", "피곤", "졸려", "힘들어", "버거워", "복잡", "혼란", "막막", "어려워", "어려움",
    "지쳤", "피곤했", "졸렸", "버거웠", "복잡했", "혼란스러웠", "막막했", "어려웠", "힘들었", "지쳤",
    "무기력", "나른", "둔해", "느려", "정신없", "멍해", "멍하", "흐려", "흐린", "흐림",
    "벅차", "부담", "무거", "짐", "책임", "의무", "해야", "못하", "안되", "실수"
  ]
};

// 부정어 처리
const negativeWords = ["안", "못", "없", "아니", "싫", "별로", "그만", "끝", "그만두", "더이상", "이제"];

// 긍정어 처리 (강도 증가)
const positiveWords = ["정말", "너무", "완전", "진짜", "대박", "최고", "완벽", "완전히", "엄청", "진심", "매우", "굉장히"];

// 시제별 가중치 (최근 일수록 높은 가중치)
const timeIndicators = {
  present: { words: ["지금", "현재", "요즘", "오늘", "이번", "방금", "막"], weight: 2.0 },
  recent: { words: ["어제", "이틀", "며칠", "최근", "요새", "근래", "lately"], weight: 1.5 },
  past: { words: ["전에", "옛날", "예전", "과거", "이전", "그때"], weight: 1.0 }
};

// 강도 키워드 (감정의 세기)
const intensityWords = {
  high: { words: ["엄청", "정말", "너무", "완전", "진짜", "대박", "극도로", "최고로"], multiplier: 1.5 },
  medium: { words: ["좀", "조금", "살짝", "약간", "어느정도", "그럭저럭"], multiplier: 1.2 },
  low: { words: ["가끔", "때때로", "간혹", "종종", "이따금"], multiplier: 0.8 }
};

export const analyzeEmotion = (text: string): string => {
  // 한글에는 toLowerCase() 효과가 없으므로 원본 텍스트 사용
  const normalizedText = text.trim();
  
  // 문장을 분리하여 각 문장별로 분석
  const sentences = normalizedText.split(/[.!?。\n]/).filter(s => s.trim().length > 0);
  
  // 각 감정별 키워드 매칭 점수 계산 
  const emotionScores: { [key: string]: number } = {};
  
  // 초기화
  Object.keys(emotionKeywords).forEach(emotion => {
    emotionScores[emotion] = 0;
  });
  
  sentences.forEach((sentence, sentenceIndex) => {
    const sentenceText = sentence.trim();
    if (sentenceText.length === 0) return;
    
    // 문장의 위치에 따른 가중치 (나중 문장일수록 높은 가중치)
    const positionWeight = 1 + (sentenceIndex / sentences.length) * 0.5;
    
    Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
      keywords.forEach(keyword => {
        if (sentenceText.includes(keyword)) {
          let keywordScore = 1.0;
          
          // 시제별 가중치 적용
          Object.values(timeIndicators).forEach(({ words, weight }) => {
            words.forEach(timeWord => {
              if (sentenceText.includes(timeWord)) {
                keywordScore *= weight;
              }
            });
          });
          
          // 강도별 가중치 적용
          Object.values(intensityWords).forEach(({ words, multiplier }) => {
            words.forEach(intensityWord => {
              if (sentenceText.includes(intensityWord + keyword) || 
                  sentenceText.includes(intensityWord + " " + keyword) ||
                  sentenceText.includes(keyword + " " + intensityWord)) {
                keywordScore *= multiplier;
              }
            });
          });
          
          // 부정어 처리 (더 정교하게)
          let isNegated = false;
          negativeWords.forEach(negative => {
            if (sentenceText.includes(negative + keyword) || 
                sentenceText.includes(negative + " " + keyword)) {
              isNegated = true;
            }
          });
          
          if (isNegated) {
            keywordScore *= -0.7; // 완전히 제거하지 않고 음수로 전환
          }
          
          // 긍정어 처리
          positiveWords.forEach(positive => {
            if (sentenceText.includes(positive + keyword) || 
                sentenceText.includes(positive + " " + keyword)) {
              keywordScore *= 1.3;
            }
          });
          
          // 문장 위치 가중치 적용
          keywordScore *= positionWeight;
          
          emotionScores[emotion] += keywordScore;
        }
      });
    });
  });

  // 최소값을 0으로 조정 (음수 점수 처리)
  Object.keys(emotionScores).forEach(emotion => {
    emotionScores[emotion] = Math.max(0, emotionScores[emotion]);
  });

  // 가장 높은 점수의 감정 반환
  const maxEmotion = Object.entries(emotionScores).reduce((max, [emotion, score]) => {
    return score > max.score ? { emotion, score } : max;
  }, { emotion: "평온함", score: 0 });

  // 모든 점수가 0이면 기본값 반환
  if (maxEmotion.score === 0) {
    return "평온함";
  }

  // 점수가 비슷한 경우 혼합 감정 처리
  const sortedEmotions = Object.entries(emotionScores)
    .sort((a, b) => b[1] - a[1])
    .filter(([_, score]) => score > 0);
    
  // 상위 2개 감정의 점수 차이가 20% 이내면 더 강한 감정 선택
  if (sortedEmotions.length >= 2 && 
      (sortedEmotions[0][1] - sortedEmotions[1][1]) / sortedEmotions[0][1] < 0.2) {
    
    // 스트레스와 우울함이 동시에 나타나면 스트레스 우선
    if ((sortedEmotions[0][0] === "스트레스" && sortedEmotions[1][0] === "우울함") ||
        (sortedEmotions[0][0] === "우울함" && sortedEmotions[1][0] === "스트레스")) {
      return "스트레스";
    }
    
    // 행복과 설렘이 동시에 나타나면 설렘 우선
    if ((sortedEmotions[0][0] === "행복함" && sortedEmotions[1][0] === "설렘") ||
        (sortedEmotions[0][0] === "설렘" && sortedEmotions[1][0] === "행복함")) {
      return "설렘";
    }
  }

  return maxEmotion.emotion;
};

// 감정 분석 결과에 대한 설명 생성
export const getEmotionDescription = (emotion: string, text: string): string => {
  const descriptions = {
    "행복함": "당신의 긍정적인 에너지가 느껴져요! 기쁜 마음을 더욱 북돋워줄 음악을 추천해드릴게요.",
    "우울함": "마음이 무겁고 슬픈 하루였군요. 따뜻한 위로가 담긴 음악으로 마음을 달래보세요.",
    "스트레스": "긴장되고 스트레스 받는 하루였네요. 마음을 진정시켜줄 편안한 음악을 들려드릴게요.",
    "설렘": "두근두근 설레는 마음이 느껴져요! 로맨틱하고 기분 좋은 음악으로 설렘을 더해보세요.",
    "평온함": "차분하고 평온한 하루였군요. 여유롭고 편안한 음악으로 마음의 평화를 유지해보세요.",
    "지침": "지치고 피곤한 하루였네요. 힐링이 되는 음악으로 마음을 달래보세요."
  };
  
  return descriptions[emotion as keyof typeof descriptions] || descriptions["평온함"];
}; 