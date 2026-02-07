/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-purple': '#6B4B7C',
        'light-purple': '#B8A5C4',
        'dark-purple': '#4A3358',
        'background': '#F5F5F5',
        'card-light': '#E8E0ED',
        'text-dark': '#333333',
        'error': '#dc2626',
        'error-bg': '#fee2e2',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
