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
        primary: '#7C3AED',
        secondary: '#14B8A6',
        accent: '#84CC16',
        background: '#0F172A',
        surface: '#1E293B',
        'surface-light': '#334155',
        'text-primary': '#F1F5F9',
        'text-secondary': '#94A3B8',
        border: '#475569',
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'sans-serif'],
      },
      fontSize: {
        'h1': '36px',
        'h2': '28px',
        'h3': '24px',
        'body': '16px',
        'small': '14px',
      },
      lineHeight: {
        'body': '1.5',
        'headings': '1.2',
      },
      borderRadius: {
        'lg': '12px',
        'md': '8px',
      },
      boxShadow: {
        'subtle': '0 4px 12px rgba(0,0,0,0.15)',
      },
      backdropBlur: {
        'default': '4px',
      },
    },
  },
  plugins: [],
}