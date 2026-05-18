import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        nordic: {
          50: '#f4fdff',
          100: '#d7fbff',
          200: '#aef4ff',
          300: '#6adfff',
          400: '#28c7ff',
          500: '#18a5e1',
          600: '#197fb7',
          700: '#175f8b',
          800: '#164d70',
          900: '#113d58'
        }
      }
    }
  },
  plugins: []
};

export default config;
