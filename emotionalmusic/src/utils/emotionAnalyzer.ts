// 감정별 키워드 매핑
const emotionKeywords = {
  "행복함": [
    "행복", "기쁨", "즐거움", "웃음", "좋아", "만족", "성취", "축하", "축하해", "기뻐",
    "웃었", "즐거웠", "행복했", "성공", "완료", "끝냈", "해냈", "좋았", "멋있", "최고"
  ],
  "우울함": [
    "우울", "슬픔", "눈물", "힘들어", "지쳐", "외로워", "허전", "아파", "상처", "절망",
    "슬펐", "우울했", "외로웠", "허전했", "아팠", "상처받", "실패", "망했", "끝났", "이별"
  ],
  "스트레스": [
    "스트레스", "짜증", "화나", "분노", "열받", "짜증나", "힘들어", "압박", "긴장", "불안",
    "화났", "짜증났", "분노했", "열받았", "압박받", "긴장했", "불안했", "짜증", "화남", "분노"
  ],
  "설렘": [
    "설렘", "두근", "떨려", "긴장", "기대", "새롭", "첫", "만남", "데이트", "로맨스",
    "설렜", "두근거렸", "떨렸", "기대했", "새로웠", "첫번째", "만났", "사랑", "연애", "고백"
  ],
  "평온함": [
    "평온", "차분", "고요", "여유", "편안", "안정", "조용", "힐링", "휴식", "명상",
    "평온했", "차분했", "고요했", "여유로웠", "편안했", "안정적", "조용했", "힐링했", "휴식했", "명상했"
  ],
  "지침": [
    "지침", "피곤", "졸려", "힘들어", "버거워", "복잡", "혼란", "막막", "어려워", "어려움",
    "지쳤", "피곤했", "졸렸", "버거웠", "복잡했", "혼란스러웠", "막막했", "어려웠", "힘들었", "지쳤"
  ]
};

// 부정어 처리
const negativeWords = ["안", "못", "없", "아니", "싫", "별로", "그만", "끝", "그만두"];

// 긍정어 처리
const positiveWords = ["정말", "너무", "완전", "진짜", "대박", "최고", "완벽", "완전히"];

export const analyzeEmotion = (text: string): string => {
  const lowerText = text.toLowerCase();
  
  // 각 감정별 키워드 매칭 점수 계산 
  // // 수정 
  const emotionScores: { [key: string]: number } = {};
  
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    let score = 0;
    
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        score += 1;
        
        // 부정어가 앞에 있으면 점수 감소
        negativeWords.forEach(negative => {
          if (lowerText.includes(negative + keyword) || lowerText.includes(negative + " " + keyword)) {
            score -= 0.5;
          }
        });
        
        // 긍정어가 앞에 있으면 점수 증가
        positiveWords.forEach(positive => {
          if (lowerText.includes(positive + keyword) || lowerText.includes(positive + " " + keyword)) {
            score += 0.5;
          }
        });
      }
    });
    
    emotionScores[emotion] = Math.max(0, score);
  });

  // 가장 높은 점수의 감정 반환
  const maxEmotion = Object.entries(emotionScores).reduce((max, [emotion, score]) => {
    return score > max.score ? { emotion, score } : max;
  }, { emotion: "평온함", score: 0 });

  // 모든 점수가 0이면 기본값 반환
  if (maxEmotion.score === 0) {
    return "평온함";
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