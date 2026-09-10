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
        // Civic palette. Legacy names (charcoal/gold/alabaster/warm-grey) are
        // kept because ~48 files use them as classes; only the values move.
        // Values mirror globals.css, which stays the single source of truth.

        // structure
        navy: "#0B2545",
        "navy-deep": "#06182E",
        "navy-ink": "#16212B",
        "gov-blue": "#14508C",
        "gov-blue-light": "#2E6FB0",
        "gov-blue-dark": "#0E3A68",

        // ground and paper
        ground: "#EEF1F4",
        paper: "#FFFFFF",
        "paper-alt": "#F7F9FB",

        // rules
        rule: "#C6D0DA",
        "rule-faint": "#DFE5EB",
        "rule-strong": "#93A3B3",

        // status
        verified: "#0F6B3F",
        "verified-bg": "#E7F2EC",
        alert: "#A5231B",
        "alert-bg": "#FBEBEA",
        pending: "#8A6A00",
        "pending-bg": "#FBF3DC",

        // brand honey amber, reserved for the mark and honey-grade status
        amber: "#F2A61C",
        "amber-light": "#FFC24D",
        "amber-dark": "#B87A08",
        "brand-amber": "#F2A61C",
        "brand-amber-light": "#FFC24D",
        "brand-amber-dark": "#B87A08",

        // ── legacy aliases mapped onto civic values ──
        // `gold` deliberately resolves to the official blue: what used to be
        // decorative gold is now the colour that means "interactive".
        gold: "#14508C",
        "gold-light": "#2E6FB0",
        "gold-dark": "#0E3A68",
        ink: "#16212B",
        "ink-raised": "#0B2545",
        bone: "#EEF1F4",
        alabaster: "#EEF1F4",
        charcoal: "#16212B",
        "charcoal-light": "#0B2545",
        taupe: "#C6D0DA",
        "warm-grey": "#4E5F6E",
        "slate-grey": "#4E5F6E",
        "signal-red": "#A5231B",

        // semantic aliases
        bg: "#EEF1F4",
        fg: "#16212B",
        surface: "#FFFFFF",
        "surface-dark": "#0B2545",
        "surface-raised": "#16212B",
        border: "#C6D0DA",
        "border-dark": "rgba(255, 255, 255, 0.14)",
        "text-primary": "#16212B",
        "text-secondary": "#4E5F6E",
        "text-muted": "#7A8896",
      },
      fontFamily: {
        // IBM Plex is an institutional family with a matched mono, which is
        // what this interface actually needs: long hashes, batch ids and lab
        // figures sit beside running text on nearly every screen.
        display: ["var(--font-display)", "IBM Plex Sans", "system-ui", "sans-serif"],
        // legacy alias: ~41 files still use font-serif / .serif
        serif: ["var(--font-display)", "IBM Plex Sans", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "IBM Plex Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "IBM Plex Mono", "monospace"],
      },
      letterSpacing: {
        // Pulled in from the previous identity. The old scale ran to 0.22em,
        // which is a fashion-editorial signature; official labels are spaced
        // enough to read as labels and no further.
        wide: "0.02em",
        wider: "0.04em",
        widest: "0.06em",
        ultra: "0.09em",
      },
      borderRadius: {
        // Central lever: the app uses 47 rounded utilities across 40 files.
        // Squaring the scale here retires all of them at once. `full` stays
        // real because it is used for status dots and avatars, which should
        // still be circles.
        none: "0",
        sm: "0",
        DEFAULT: "0",
        md: "0",
        lg: "0",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        full: "9999px",
      },
      boxShadow: {
        // Second central lever: 149 shadow utilities across the app. The
        // decorative tiers collapse to nothing so surfaces are separated by
        // rules instead. Overlays keep a tight, low-blur elevation because a
        // modal genuinely has to sit above the page to be readable.
        none: "none",
        "2xs": "none",
        xs: "none",
        sm: "none",
        DEFAULT: "none",
        md: "none",
        inner: "none",
        "luxury-card": "none",
        "luxury-card-hover": "none",
        "luxury-hero": "none",
        "luxury-btn": "none",
        "luxury-btn-hover": "none",
        "inner-border": "inset 0 0 0 1px #C6D0DA",
        lg: "0 2px 6px rgba(11, 37, 69, 0.12)",
        xl: "0 4px 12px rgba(11, 37, 69, 0.14)",
        "2xl": "0 8px 24px rgba(11, 37, 69, 0.18)",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
      },
      transitionDuration: {
        // The old theme animated in 1.5-2s luxury sweeps. Official tools
        // acknowledge input immediately; these are kept only so existing
        // class names resolve, retuned to something operational.
        "1500": "200ms",
        "2000": "240ms",
      },
    },
  },
  plugins: [],
};

export default config;
