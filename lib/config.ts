// lib/config.ts
export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "/api/proxy" // Use proxy in production (Cloudflare)
    : "http://3.29.128.189"; // Direct connection in development

// Or if you want to always use the proxy:
// export const API_BASE_URL = '/api/proxy';
