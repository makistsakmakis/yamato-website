/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        yamato: {
          red: '#E30613', 'red-dark': '#B0040F', 'red-light': '#FF1A27',
          black: '#050505', dark: '#0d0d0d', gray: '#1a1a1a',
          'gray-mid': '#2a2a2a', 'gray-light': '#3a3a3a', white: '#F5F5F5', neon: '#FF0033',
        },
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      boxShadow: {
        'red-glow': '0 0 20px rgba(227,6,19,0.3), 0 0 40px rgba(227,6,19,0.1)',
        'red-glow-sm': '0 0 10px rgba(227,6,19,0.25)', card: '0 4px 24px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
}
