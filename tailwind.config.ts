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
        ember: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c", // Primary terracotta/orange
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
          950: "#431407",
        },
        charcoal: {
          800: "#27272a",
          850: "#202023",
          900: "#18181b", // Rich dark charcoal
          950: "#0f0f11", // Deep background
        },
        cream: {
          50: "#fdfcfa",
          100: "#faf7f2", // Warm artisanal cream
          200: "#f4eee3",
          300: "#ebdcc7",
        },
        crust: {
          400: "#f59e0b",
          500: "#d97706",
          600: "#b45309",
        }
      },
      fontFamily: {
        serif: ["'Playfair Display'", "Georgia", "Cambria", "'Times New Roman'", "Times", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
