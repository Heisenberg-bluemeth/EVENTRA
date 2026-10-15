/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#04060c',
          900: '#080c18',
          850: '#0d1324',
          800: '#131b31',
          700: '#1b2542',
          600: '#27355d',
          500: '#394b7f'
        },
        electric: {
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9'
        },
        cyber: {
          cyan: '#00f5ff',
          neon: '#06b6d4',
          pink: '#f43f5e',
          amber: '#f59e0b',
          emerald: '#10b981'
        }
      },
      fontFamily: {
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      },
      boxShadow: {
        'glow-violet': '0 0 25px -4px rgba(139, 92, 246, 0.45)',
        'glow-cyan': '0 0 25px -4px rgba(0, 245, 255, 0.45)',
        'glow-pink': '0 0 25px -4px rgba(244, 63, 94, 0.45)',
        'glow-card': '0 12px 35px -8px rgba(0, 0, 0, 0.7), 0 0 20px 0 rgba(139, 92, 246, 0.12)',
        'holographic': '0 10px 40px -5px rgba(0, 245, 255, 0.25), inset 0 0 15px rgba(255, 255, 255, 0.15)'
      }
    },
  },
  plugins: [],
}
