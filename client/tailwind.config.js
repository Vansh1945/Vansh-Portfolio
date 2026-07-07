/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#F59E0B',
        accent: '#F59E0B',
        backgroundLight: '#FFFFFF',
        backgroundLightAlt: '#F9FAFB',
        backgroundDark: '#0F172A',
        backgroundDarkAlt: '#111827',
        text: '#1F2937',
      },
      fontFamily: {
        cursive: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
};
