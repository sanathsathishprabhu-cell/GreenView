import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F3EEE7",
          50: "#FDFCFA",
          100: "#F9F6F1",
          200: "#F3EEE7",
          300: "#E8DDD0",
          400: "#D4C4B0",
          500: "#BFA990",
        },
        charcoal: {
          DEFAULT: "#313131",
          light: "#4A4A4A",
          dark: "#1A1A1A",
        },
        gold: {
          DEFAULT: "#C9A96E",
          light: "#E8CFA0",
          dark: "#A07840",
        },
        forest: {
          DEFAULT: "#2C4A3E",
          light: "#3D6B5A",
          dark: "#1A2E27",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "104": "26rem",
        "120": "30rem",
        "144": "36rem",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-in-out",
        "fade-up": "fadeUp 0.6s ease-out",
        "slide-in": "slideIn 0.4s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        gradient: "linear-gradient(135deg, var(--tw-gradient-stops))",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
