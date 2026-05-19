/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spotify: {
          black: '#090909',
          green: '#1DB954',
          green_dim: '#1db95433',
          gray: '#181818',
        }
      },
      animation: {
        'neon-glow': 'neon-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'neon-glow': {
          '0%, 100%': { boxShadow: '0 0 20px #1db95433' },
          '50%': { boxShadow: '0 0 30px #1DB954' },
        }
      },
      backdropFilter: {
        'blur-md': 'blur(12px)',
        'blur-lg': 'blur(16px)',
      }
    },
  },
  plugins: [],
}
