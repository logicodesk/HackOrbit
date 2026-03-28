/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'neon-purple': '#a855f7',
        'neon-cyan': '#06b6d4',
        'neon-pink': '#ec4899',
        'neon-blue': '#3b82f6',
        'dark-bg': '#030712',
        'dark-surface': '#0f172a',
        'dark-card': '#1e293b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 2s linear infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(168, 85, 247, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
}
