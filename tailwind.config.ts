import type { Config } from "tailwindcss";

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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        /* Variable-driven colors */
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },

        /* Custom solid palettes */
        white: {
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
        red: {
          100: "#F9D6D8",
          200: "#F2AEB2",
          300: "#EB878B",
          400: "#E35F64",
          500: "#DC383D",
          600: "#9D1016",
          700: "#830D13",
          800: "#690A0F",
          900: "#4F070B",
        },
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
          accent: "#dc2626",
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
