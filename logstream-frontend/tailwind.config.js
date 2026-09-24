/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Base surfaces - cool slate, not pure black, to keep long log tables readable
        surface: {
          0: '#0b0f14', // app background
          1: '#10151c', // sidebar / navbar
          2: '#151b23', // cards, panels
          3: '#1b232d', // raised elements, table headers
          border: '#232c37',
        },
        ink: {
          primary: '#e6ebf1',
          secondary: '#9aa7b5',
          muted: '#5f6c7a',
        },
        brand: {
          DEFAULT: '#3ea6ff',
          dim: '#1f6fb0',
          glow: '#8ecbff',
        },
        level: {
          info: '#3ea6ff',
          warn: '#e8a53d',
          error: '#f0555a',
          debug: '#7c8ba1',
        },
        status: {
          up: '#39c07a',
          down: '#f0555a',
          unknown: '#9aa7b5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)',
      },
    },
  },
  plugins: [],
};
