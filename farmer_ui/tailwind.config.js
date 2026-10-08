/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Shared with the KVIC portal so the app and the public site
        // read as one service.
        'navy-deep': '#06182E',
        navy: '#0B2545',
        'gov-blue': '#14508C',
        ground: '#EEF1F4',
        paper: '#FFFFFF',
        rule: '#C6D0DA',
        'rule-strong': '#93A3B3',
        verified: '#0F6B3F',
        alert: '#A5231B',
        // Declared as a scale, not a single value. A bare `amber: '#...'`
        // replaces Tailwind's built-in amber ramp, and this app leans on
        // amber-50 through amber-900 throughout, so every one of those
        // utilities silently resolved to nothing and the controls that used
        // them rendered with no background at all.
        amber: {
          DEFAULT: '#F2A61C',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        honey: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        hive: {
          healthy: '#10b981',
          watch: '#f59e0b',
          alert: '#ef4444',
          nosignal: '#6b7280',
        }
      },
      fontFamily: {
        sans: ['var(--font-plex)', 'IBM Plex Sans', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
