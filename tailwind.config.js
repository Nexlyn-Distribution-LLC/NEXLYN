/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nexlyn: {
          DEFAULT: '#E60026',
          glow: '#FF1A3D',
          dark: '#1A0005',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'data-flow': 'data-flow 20s linear infinite',
        'sonar': 'sonar 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        'data-flow': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' }
        },
        'sonar': {
          '0%, 100%': { opacity: '0.2', transform: 'scale(1)' },
          '50%': { opacity: '0', transform: 'scale(1.5)' }
        }
      }
    },
  },
  plugins: [],
}
