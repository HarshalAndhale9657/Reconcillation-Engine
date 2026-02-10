/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f9fafb',
        card: '#ffffff',
        text: '#0f172a',
        muted: '#64748b',
        primary: '#2563eb',
        success: '#16a34a',
        warning: '#f59e0b',
        danger: '#dc2626',
        border: '#e5e7eb',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 8px 28px rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        xl: '0.875rem',
      },
    },
  },
  plugins: [],
};

