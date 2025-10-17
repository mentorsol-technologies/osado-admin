/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  experimental: {
    serverComponentsExternalPackages: ["async_hooks"],
  },
  webpack: (config, { isServer, nextRuntime }) => {
    // Handle async_hooks for edge runtime
    if (nextRuntime === "edge") {
      config.resolve.alias = {
        ...config.resolve.alias,
        async_hooks: false,
      };
      config.resolve.fallback = {
        ...config.resolve.fallback,
        async_hooks: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
