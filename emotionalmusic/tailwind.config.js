/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
        'elegant': ['Cormorant Garamond', 'serif'],
        'modern': ['Poppins', 'sans-serif'],
      },
      colors: {
        // 새로운 컬러 팔레트
        'neon-lime': {
          50: '#f7fef0',
          100: '#edfde0',
          200: '#dbfbc1',
          300: '#c8ff73',
          400: '#b4f63c',
          500: '#9dee1a',
          600: '#7dd20d',
          700: '#5ea30e',
          800: '#4b8112',
          900: '#3e6a15',
        },
        'vintage': {
          50: '#fefcf9',
          100: '#fdf7f0',
          200: '#fbeedb',
          300: '#f7e0c0',
          400: '#f2cc9a',
          500: '#ecb374',
          600: '#e39a52',
          700: '#d17f3a',
          800: '#b06632',
          900: '#8f542d',
        },
        'soft-pastel': {
          50: '#fefefe',
          100: '#fdfcfc',
          200: '#faf8f8',
          300: '#f5f1f1',
          400: '#ede6e6',
          500: '#d8d0d0',
          600: '#c0b5b5',
          700: '#a39595',
          800: '#867a7a',
          900: '#6f6666',
        },
        'warm': {
          50: '#fefcf9',
          100: '#fdf7f0',
          200: '#fbeedb',
          300: '#f7e0c0',
          400: '#f2cc9a',
          500: '#ecb374',
          600: '#e39a52',
          700: '#d17f3a',
          800: '#b06632',
          900: '#8f542d',
        },
        // 기존 컬러 유지
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        kitsch: {
          pink: {
            50: '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            300: '#f9a8d4',
            400: '#f472b6',
            500: '#ec4899',
          },
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
          },
          blue: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
          },
          peach: {
            50: '#fef7ee',
            100: '#fdedd6',
            200: '#fbd7ad',
            300: '#f8bb84',
            400: '#f59e5b',
            500: '#f28532',
          }
        },
        gradient: {
          'pink-orange': 'linear-gradient(135deg, #ec4899 0%, #f97316 50%, #eab308 100%)',
          'blue-purple': 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
          'green-blue': 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
          'purple-pink': 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
          'soft-pink-purple': 'linear-gradient(135deg, #fdf2f8 0%, #f3e8ff 50%, #dbeafe 100%)',
          'soft-peach-pink': 'linear-gradient(135deg, #fef7ee 0%, #fce7f3 50%, #f3e8ff 100%)',
          'soft-purple-peach': 'linear-gradient(135deg, #faf5ff 0%, #fef7ee 50%, #fce7f3 100%)',
          'soft-blue-pink': 'linear-gradient(135deg, #eff6ff 0%, #fdf2f8 50%, #fce7f3 100%)',
        }
      },
      animation: {
        // 새로운 애니메이션
        'elegant-fade': 'elegantFade 0.8s ease-out',
        'gentle-scale': 'gentleScale 0.4s ease-out',
        'soft-bounce': 'softBounce 0.6s ease-out',
        'vintage-float': 'vintageFloat 4s ease-in-out infinite',
        'neon-glow': 'neonGlow 2s ease-in-out infinite',
        'card-hover': 'cardHover 0.3s ease-out',
        'tag-pulse': 'tagPulse 2s ease-in-out infinite',
        // 기존 애니메이션 유지
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 2s infinite',
        'kitsch-float': 'kitschFloat 4s ease-in-out infinite',
        'kitsch-pulse': 'kitschPulse 3s ease-in-out infinite',
        'kitsch-rotate': 'kitschRotate 6s linear infinite',
      },
      keyframes: {
        // 새로운 키프레임
        elegantFade: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        gentleScale: {
          '0%': { transform: 'scale(0.98)' },
          '100%': { transform: 'scale(1)' },
        },
        softBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        vintageFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-6px) rotate(1deg)' },
          '50%': { transform: 'translateY(-10px) rotate(0deg)' },
          '75%': { transform: 'translateY(-6px) rotate(-1deg)' },
        },
        neonGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(200, 255, 115, 0.3)',
            transform: 'scale(1)' 
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(200, 255, 115, 0.5)',
            transform: 'scale(1.02)' 
          },
        },
        cardHover: {
          '0%': { transform: 'scale(1) translateY(0)' },
          '100%': { transform: 'scale(1.05) translateY(-8px)' },
        },
        tagPulse: {
          '0%, 100%': { 
            backgroundColor: 'rgba(200, 255, 115, 0.1)',
            transform: 'scale(1)' 
          },
          '50%': { 
            backgroundColor: 'rgba(200, 255, 115, 0.2)',
            transform: 'scale(1.05)' 
          },
        },
        // 기존 키프레임 유지
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGentle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        kitschFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '25%': { transform: 'translateY(-8px) rotate(2deg)' },
          '50%': { transform: 'translateY(-12px) rotate(0deg)' },
          '75%': { transform: 'translateY(-8px) rotate(-2deg)' },
        },
        kitschPulse: {
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '0.6' },
          '50%': { transform: 'scale(1.1) rotate(180deg)', opacity: '0.8' },
        },
        kitschRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      boxShadow: {
        // 새로운 그림자
        'elegant': '0 4px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'vintage': '0 8px 32px -8px rgba(0, 0, 0, 0.12), 0 16px 24px -8px rgba(0, 0, 0, 0.08)',
        'neon': '0 0 20px rgba(200, 255, 115, 0.3), 0 0 40px rgba(200, 255, 115, 0.1)',
        'card-hover': '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 10px 20px -5px rgba(0, 0, 0, 0.1)',
        // 기존 그림자 유지
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'large': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        'kitsch': '0 4px 20px -5px rgba(236, 72, 153, 0.15), 0 8px 25px -5px rgba(139, 92, 246, 0.1)',
        'kitsch-glow': '0 0 30px rgba(236, 72, 153, 0.2), 0 0 60px rgba(139, 92, 246, 0.1)',
      },
      backgroundImage: {
        'kitsch-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f472b6' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'vintage-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c8ff73' fill-opacity='0.03'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp"), require("daisyui")],
};
