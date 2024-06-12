/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        main: '#1877F2',
        secondary: '#eee',
      },
      screens: {
        xsm: '516px',
        sm: '768px',
        md: '992px',
        lg: '1200px',
      },
      flexGrow: {
        2: '2',
      },
    },
  },
  plugins: [],
}
