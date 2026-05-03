/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coffee: {
          DEFAULT: '#8B4513',
          dark: '#5D2E0C',
          light: '#A0522D',
        },
        cream: {
          DEFAULT: '#F5E6D3',
          dark: '#E8D4BC',
        },
        accent: {
          DEFAULT: '#D2691E',
          light: '#E8945A',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Cambria', 'Times New Roman', 'serif'],
        sans: ['system-ui', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        card: '0 10px 40px -10px rgba(91, 46, 12, 0.25)',
      },
    },
  },
  plugins: [],
};
