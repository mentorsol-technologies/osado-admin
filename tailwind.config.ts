import type { Config } from "tailwindcss";
import { brand, brandGradient } from "./lib/theme/colors";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        brand: brandGradient,
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        /* Variable-driven colors */
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        card: {
          DEFAULT: "rgb(var(--card))",
          foreground: "rgb(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "rgb(var(--popover))",
          foreground: "rgb(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "rgb(var(--destructive))",
          foreground: "rgb(var(--destructive-foreground))",
        },
        border: "rgb(var(--border))",
        input: "rgb(var(--input))",
        ring: "rgb(var(--ring))",
        chart: {
          "1": "rgb(var(--chart-1))",
          "2": "rgb(var(--chart-2))",
          "3": "rgb(var(--chart-3))",
          "4": "rgb(var(--chart-4))",
          "5": "rgb(var(--chart-5))",
        },

        /* Custom solid palettes */
        white: {
          DEFAULT: "#FFFFFF",
          100: "#FFFFFF",
          200: "#F2F2F5",
          300: "#E6E6EB",
          400: "#D9D9E0",
          500: "#CCCCE0",
          600: "#BFBFD5",
          700: "#B3B3CC",
          800: "#A6A6C2",
          900: "#9999B8",
        },
        black: {
          DEFAULT: "#000000",
          100: "#3B3C41",
          200: "#2C2C34",
          300: "#1F222B",
          400: "#191A1F",
          500: "#12141A",
          600: "#0D0E14",
          700: "#08090F",
          800: "#040507",
          900: "#000000",
        },
        purple: brand,
        blue: {
          100: "#E6F0FF",
          200: "#B3D1FF",
          300: "#80B2FF",
          400: "#4D94FF",
          500: "#1A75FF",
          600: "#005CE6",
          700: "#0047B3",
          800: "#003280",
          900: "#001A4D",
        },
        green: {
          100: "#E6F9F0",
          200: "#B3EFD1",
          300: "#80E6B3",
          400: "#4DDB94",
          500: "#1ACC75",
          600: "#00B362",
          700: "#008F4D",
          800: "#006B38",
          900: "#004726",
        },

        /* App-specific */
        sidebar: {
          DEFAULT: "#1a1a1a",
          hover: "#2a2a2a",
        },
        dashboard: {
          bg: "#0f0f0f",
          card: "#1a1a1a",
          accent: brand[600],
          success: "#10b981",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
