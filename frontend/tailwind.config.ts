import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        // Beevil Knievel palette. Legacy names (charcoal/gold/alabaster) are kept
        // because ~100 files use them as classes; the values now match globals.css,
        // which previously disagreed with this file.
        ink: "#14141A",
        "ink-raised": "#1D1D25",
        bone: "#F7F5EF",
        amber: "#F2A61C",
        "amber-light": "#FFC24D",
        "amber-dark": "#C97F0A",
        "signal-red": "#C8322B",

        // legacy aliases, same values
        alabaster: "#F7F5EF",
        charcoal: "#14141A",
        taupe: "#E6E0D5",
        "warm-grey": "#6B6760",
        gold: "#F2A61C",
        "gold-light": "#FFC24D",
        "gold-dark": "#C97F0A",
        "brand-amber": "#F2A61C",
        "brand-amber-light": "#FFC24D",
        "brand-amber-dark": "#C97F0A",

        // Semantic aliases
        bg: "#F7F5EF",
        fg: "#14141A",
        surface: "#FFFFFF",
        "surface-dark": "#14141A",
        "surface-raised": "#1D1D25",
        border: "rgba(20, 20, 26, 0.15)",
        "border-dark": "rgba(247, 245, 239, 0.15)",
        "text-primary": "#14141A",
        "text-secondary": "#6B6760",
        "text-muted": "#9A958C",
      },
      fontFamily: {
        display: ["var(--font-display)", "Space Grotesk", "Segoe UI", "system-ui", "sans-serif"],
        // legacy alias: many files still use font-serif / .serif
        serif: ["var(--font-display)", "Space Grotesk", "Segoe UI", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        wide: "0.05em",
        wider: "0.08em",
        widest: "0.12em",
        ultra: "0.22em",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(0, 0, 0, 0.05)",
        "luxury-hero": "0 8px 32px rgba(0, 0, 0, 0.12)",
        "luxury-card": "0 2px 8px rgba(0, 0, 0, 0.02)",
        "luxury-card-hover": "0 8px 24px rgba(0, 0, 0, 0.06)",
        "luxury-btn": "0 4px 16px rgba(0, 0, 0, 0.15)",
        "luxury-btn-hover": "0 8px 24px rgba(0, 0, 0, 0.25)",
        "inner-border": "inset 0 0 0 1px rgba(0, 0, 0, 0.06)",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
      },
      transitionDuration: {
        "1500": "1500ms",
        "2000": "2000ms",
      },
    },
  },
  plugins: [],
};

export default config;
