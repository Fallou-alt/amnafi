/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        amnafi: {
          primary: '#ea580c', // orange-600
          secondary: '#dc2626', // red-600
          accent: '#f97316', // orange-500
          light: '#fed7aa', // orange-200
          dark: '#c2410c', // orange-700
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'amnafi-gradient': 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
      },
    },
  },
  plugins: [],
}