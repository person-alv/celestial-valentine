/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sg-pink': '#FFB6C1',
        'sg-rose': '#FF1493',
        'sg-midnight': '#191970',
        'sg-purple': '#7B2CBF',
        'sg-gold': '#FFD700',
        'sg-shadow': '#1a1a2e',
        'sg-black': '#000000',
        'sg-electric-blue': '#00BFFF',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
        bangers: ['Bangers', 'cursive'],
        dancing: ['Dancing Script', 'cursive'],
        mono: ['Share Tech Mono', 'monospace'],
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 215, 0, 0.4)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 215, 0, 0.8)' },
        },
        'breathing': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        }
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'breathing': 'breathing 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
