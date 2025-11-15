/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: '#D4AF37', // Premium qızılı rəng
        'premium-black': '#101010', // Dərin qara fon
        'off-white': '#F5F5F5', // Zərif ağ mətn
      },
      fontFamily: {
        // Başlıqlar üçün (Apple estetikası)
        serif: ['Playfair Display', 'serif'],
        // Əsas mətn üçün (Müasir, təmiz)
        sans: ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px', // Modal üçün zərif blur
      },
      boxShadow: {
        // Zərif premium kölgə
        'premium': '0 10px 30px rgba(0, 0, 0, 0.3), 0 5px 10px rgba(0, 0, 0, 0.1)',
        'premium-hover': '0 20px 40px rgba(212, 175, 55, 0.2), 0 10px 20px rgba(0, 0, 0, 0.2)'
      }
    },
  },
  plugins: [],
};