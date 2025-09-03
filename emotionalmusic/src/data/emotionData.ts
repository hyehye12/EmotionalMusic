// 감정별 트랙 데이터
export interface EmotionTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  imageUrl: string;
  spotifyUrl: string;
}

// 감정별 음악 데이터
const emotionTrackData: Record<string, EmotionTrack[]> = {
  행복함: [
    {
      id: '1',
      name: 'Good 4 U',
      artist: 'Olivia Rodrigo',
      album: 'SOUR',
      imageUrl: 'https://example.com/image1.jpg',
      spotifyUrl: 'https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh'
    },
    {
      id: '2',
      name: 'Dynamite',
      artist: 'BTS',
      album: 'BE',
      imageUrl: 'https://example.com/image2.jpg',
      spotifyUrl: 'https://open.spotify.com/track/0t1kP63rueHleOhQkYSXFY'
    },
    {
      id: '3',
      name: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      imageUrl: 'https://example.com/image3.jpg',
      spotifyUrl: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b'
    }
  ],
  우울함: [
    {
      id: '4',
      name: 'drivers license',
      artist: 'Olivia Rodrigo',
      album: 'SOUR',
      imageUrl: 'https://example.com/image4.jpg',
      spotifyUrl: 'https://open.spotify.com/track/7lPN2DXiMsVn7XUKtOW1CS'
    },
    {
      id: '5',
      name: 'Someone Like You',
      artist: 'Adele',
      album: '21',
      imageUrl: 'https://example.com/image5.jpg',
      spotifyUrl: 'https://open.spotify.com/track/1zwMYTA5nlNjZxYrvBB2pV'
    },
    {
      id: '6',
      name: 'Mad World',
      artist: 'Gary Jules',
      album: 'Trading Snakeoil for Wolftickets',
      imageUrl: 'https://example.com/image6.jpg',
      spotifyUrl: 'https://open.spotify.com/track/3JOVTQ5xWgEFSV0bHWWVWO'
    }
  ],
  스트레스: [
    {
      id: '7',
      name: 'Stressed Out',
      artist: 'Twenty One Pilots',
      album: 'Blurryface',
      imageUrl: 'https://example.com/image7.jpg',
      spotifyUrl: 'https://open.spotify.com/track/3CRDbSIZ4r5MsZ0YwxuEkn'
    },
    {
      id: '8',
      name: 'Heavy',
      artist: 'Linkin Park ft. Kiiara',
      album: 'One More Light',
      imageUrl: 'https://example.com/image8.jpg',
      spotifyUrl: 'https://open.spotify.com/track/50kpGaPAhYJ3sGmk6vplg0'
    },
    {
      id: '9',
      name: 'Breathe Me',
      artist: 'Sia',
      album: 'Colour the Small One',
      imageUrl: 'https://example.com/image9.jpg',
      spotifyUrl: 'https://open.spotify.com/track/7bfzJivlOmGJJwjVNDlUrj'
    }
  ],
  설렘: [
    {
      id: '10',
      name: 'Love Story',
      artist: 'Taylor Swift',
      album: 'Fearless',
      imageUrl: 'https://example.com/image10.jpg',
      spotifyUrl: 'https://open.spotify.com/track/1vrd6UOGamcKNGnSHJQlSt'
    },
    {
      id: '11',
      name: 'Perfect',
      artist: 'Ed Sheeran',
      album: '÷ (Divide)',
      imageUrl: 'https://example.com/image11.jpg',
      spotifyUrl: 'https://open.spotify.com/track/0tgVpDi06FyKpA1z0VMD4v'
    },
    {
      id: '12',
      name: 'Can\'t Help Falling in Love',
      artist: 'Elvis Presley',
      album: 'Blue Hawaii',
      imageUrl: 'https://example.com/image12.jpg',
      spotifyUrl: 'https://open.spotify.com/track/44AyOl4qVkzS48vBsbNXaC'
    }
  ],
  평온함: [
    {
      id: '13',
      name: 'Weightless',
      artist: 'Marconi Union',
      album: 'Weightless',
      imageUrl: 'https://example.com/image13.jpg',
      spotifyUrl: 'https://open.spotify.com/track/4bCjNMNiCgwwPEyqGu5K5r'
    },
    {
      id: '14',
      name: 'Clair de Lune',
      artist: 'Claude Debussy',
      album: 'Suite bergamasque',
      imageUrl: 'https://example.com/image14.jpg',
      spotifyUrl: 'https://open.spotify.com/track/7LFMC6GVUMowWFFgZqrKJK'
    },
    {
      id: '15',
      name: 'River',
      artist: 'Joni Mitchell',
      album: 'Blue',
      imageUrl: 'https://example.com/image15.jpg',
      spotifyUrl: 'https://open.spotify.com/track/4qG8BzVMrWQ0F8xhX7AxfD'
    }
  ],
  지침: [
    {
      id: '16',
      name: 'Tired',
      artist: 'Stone Sour',
      album: 'House of Gold & Bones Part 1',
      imageUrl: 'https://example.com/image16.jpg',
      spotifyUrl: 'https://open.spotify.com/track/6JiKnW6lMCLCgwJWXNg8xd'
    },
    {
      id: '17',
      name: 'I\'m Tired',
      artist: 'Labrinth & Zendaya',
      album: 'Euphoria (Original HBO Series Soundtrack)',
      imageUrl: 'https://example.com/image17.jpg',
      spotifyUrl: 'https://open.spotify.com/track/0cKWVN8LgxhIe6VaUHR0b9'
    },
    {
      id: '18',
      name: 'Heavy Eyes',
      artist: 'ZZ Ward',
      album: 'Til the Casket Drops',
      imageUrl: 'https://example.com/image18.jpg',
      spotifyUrl: 'https://open.spotify.com/track/5yRE37yOEIdswYgY1EUdGf'
    }
  ]
};

export const getTracksByEmotion = (emotion: string): EmotionTrack[] => {
  return emotionTrackData[emotion] || emotionTrackData['평온함'];
};