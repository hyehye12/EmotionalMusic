export const EMOTIONS = ['행복함', '우울함', '스트레스', '설렘', '평온함', '지침'] as const;

export const EMOTION_COLORS = {
  '행복함': 'bg-yellow-500',
  '우울함': 'bg-blue-500',
  '스트레스': 'bg-red-500',
  '설렘': 'bg-pink-500',
  '평온함': 'bg-green-500',
  '지침': 'bg-gray-500'
} as const;

export const EMOTION_EMOJIS = {
  '행복함': '😀',
  '우울함': '😢',
  '스트레스': '😡',
  '설렘': '😍',
  '평온함': '😌',
  '지침': '😴'
} as const;

export const EMOTION_SCORES = {
  '행복함': 9,
  '우울함': 3,
  '스트레스': 4,
  '설렘': 8,
  '평온함': 7,
  '지침': 5
} as const; 