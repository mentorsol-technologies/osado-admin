/**
 * Single source of truth for the app's brand color.
 *
 * To re-theme the app, change the hex values below - everything derives from
 * this file: Tailwind's `purple-*` utility classes and the `bg-brand` gradient
 * (via tailwind.config.ts), plus every chart component that needs a raw color
 * string (recharts can't consume Tailwind classes or CSS variables directly).
 *
 * globals.css's shadcn CSS variables (--primary, --destructive, --ring,
 * --chart-1, .sidebar-item.active, .rdp-head) are NOT generated from this
 * file - plain CSS can't import TypeScript without an extra build step - so
 * they must be kept in sync with brand[600] by hand if this ever changes.
 */
export const brand = {
  100: "#F3EDFC",
  200: "#E1D0F7",
  300: "#C7A8F0",
  400: "#A87AE8",
  500: "#8B5EEF",
  600: "#663FB0",
  700: "#533387",
  800: "#3F2766",
  900: "#2C1B49",
} as const;

export const brandGradient = `linear-gradient(90deg, ${brand[500]} 0%, ${brand[600]} 100%)`;
