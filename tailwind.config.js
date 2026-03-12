/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        // ── Study module palette (amber-based) ──
        accent: {
          DEFAULT: "#e8a020",
          light: "#f5c060",
          dim: "#e8a02033",
        },
        tx: {
          primary: "#ece9e0",
          muted: "#7a7590",
          faint: "#3e3c52",
        },
        // ── Correction module palette (green-based) ──
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        // ── Shared surface palette ──
        surface: {
          900: "#0d0d12",
          800: "#13131c",
          700: "#1c1c28",
          600: "#252538",
          500: "#3e3c52",
          400: "#7a7590",
        },
      },
      fontFamily: {
        display: [
          '"Red Hat Display"',
          '"Bricolage Grotesque"',
          "Georgia",
          "serif",
        ],
        body: ['"Open Sans"', '"DM Sans"', "sans-serif"],
        mono: ['"Ubuntu Mono"', '"JetBrains Mono"', "monospace"],
      },
      animation: {
        "fill-bar": "fillBar 1s ease-out forwards",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fillBar: {
          from: { width: "0%" },
          to: { width: "var(--bar-width)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
