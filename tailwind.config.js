/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // VerifyAI Dark Theme Palette
        'midnight': {
          DEFAULT: '#080c10',
          light: '#0b1117',
        },
        'slate-dark': {
          DEFAULT: '#121d28',
          light: '#1a2836',
        },
        'cyan-bright': '#06b6d4',
        'emerald-bright': '#10b981',
        'red-alert': '#f43f5e',
        'blue-electric': '#3b82f6',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
        'glow-emerald': '0 0 20px rgba(16, 185, 129, 0.3)',
        'glow-red': '0 0 20px rgba(244, 63, 94, 0.3)',
      },
    },
  },
  plugins: [],
}
