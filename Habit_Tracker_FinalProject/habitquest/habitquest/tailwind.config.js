/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa',
          300: '#fdba74', 400: '#fb923c', 500: '#f97316',
          600: '#ea580c', 700: '#c2410c', 800: '#9a3412', 900: '#7c2d12',
        },
        olive: {
          50: '#f7f8f0', 100: '#eef0e0', 200: '#d5dab8',
          300: '#b8c48a', 400: '#9aad5e', 500: '#7d9440',
          600: '#617632', 700: '#4c5c28', 800: '#3d4921', 900: '#33391e',
        },
        highlight: {
          50: '#fefce8', 100: '#fef9c3', 200: '#fef08a',
          300: '#fde047', 400: '#facc15', 500: '#eab308',
          600: '#ca8a04', 700: '#a16207', 800: '#854d0e', 900: '#713f12',
        },
        accent: {
          50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe',
          300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6',
          600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a',
        },
      },
      fontFamily: {
        display: ['Nunito', 'sans-serif'],
        body: ['Nunito', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
        'slide-up': 'slide-up 0.4s ease-out',
        'glow': 'glow 2s ease-in-out infinite',
        'streak-fire': 'streak-fire 1s ease-in-out infinite',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        'pulse-soft': { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.7' } },
        'bounce-in': { '0%': { transform: 'scale(0)' }, '60%': { transform: 'scale(1.1)' }, '100%': { transform: 'scale(1)' } },
        'slide-up': { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        glow: { '0%,100%': { boxShadow: '0 0 8px rgba(249,115,22,0.4)' }, '50%': { boxShadow: '0 0 24px rgba(249,115,22,0.8)' } },
        'streak-fire': { '0%,100%': { transform: 'scale(1) rotate(-2deg)' }, '50%': { transform: 'scale(1.1) rotate(2deg)' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
