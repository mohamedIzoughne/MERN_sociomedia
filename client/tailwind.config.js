/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        main: '#a5ecff',
        secondary: '#eee',
      },
      screens: {
        xsm: '516px',
        sm: '768px',
        md: '992px',
        lg: '1200px',
      },
    },
  },
  plugins: [],
}
