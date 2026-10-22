/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FFFCF7',
        // Dominant colour of the hero clip's final frame (paint that covers the site).
        paint: '#2AA9B4',
        'cream-deep': '#FBF4E9',
        sand: '#F3E9DA',
        plum: {
          DEFAULT: '#241038',
          soft: '#4A3560',
          mute: '#6E5A85',
        },
        violet: {
          DEFAULT: '#6730E8',
          deep: '#4E1FC0',
          soft: '#EFE8FE',
        },
        coral: { DEFAULT: '#FF777C', soft: '#FFE3E3', deep: '#E85B62' },
        turquoise: { DEFAULT: '#19BFC5', soft: '#DDF7F6', deep: '#0E9298' },
        sunny: { DEFAULT: '#FFD447', soft: '#FFF3CC', deep: '#E8B41F' },
        lavender: { DEFAULT: '#AD87EC', soft: '#F0E8FD' },
        pink: { DEFAULT: '#FF9BB8', soft: '#FFE6EE' },
        cobalt: { DEFAULT: '#2F5BEA', soft: '#E1E8FF' },
      },
      fontFamily: {
        sans: ['Vazirmatn', 'system-ui', 'Segoe UI', 'Tahoma', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(2.6rem, 5.4vw, 4.6rem)', { lineHeight: '1.16', letterSpacing: '-0.01em' }],
        'display-lg': ['clamp(2rem, 3.6vw, 3.1rem)', { lineHeight: '1.24', letterSpacing: '-0.01em' }],
        'display-md': ['clamp(1.5rem, 2.4vw, 2.05rem)', { lineHeight: '1.35' }],
      },
      maxWidth: {
        shell: '1360px',
      },
      boxShadow: {
        lift: '0 18px 50px -28px rgba(36,16,56,0.35)',
        soft: '0 10px 30px -18px rgba(36,16,56,0.28)',
        pill: '0 14px 30px -14px rgba(103,48,232,0.55)',
      },
      borderRadius: {
        card: '20px',
        panel: '28px',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drift: {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(0,-10px,0) scale(1.012)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
      },
      animation: {
        'fade-up': 'fade-up .7s cubic-bezier(.22,.61,.36,1) both',
        drift: 'drift 14s ease-in-out infinite',
        'fade-in': 'fade-in .5s ease both',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(.22,.61,.36,1)',
      },
    },
  },
  plugins: [],
}
