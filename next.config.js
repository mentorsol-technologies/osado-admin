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
    // Handle async_hooks for edge runtime - more aggressive approach
    if (nextRuntime === "edge" || !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        async_hooks: false,
        "node:async_hooks": false,
      };
      config.resolve.fallback = {
        ...config.resolve.fallback,
        async_hooks: false,
        "node:async_hooks": false,
      };
    }

    // Exclude async_hooks from all builds
    config.externals = [...(config.externals || []), "async_hooks"];

    return config;
  },
};

module.exports = nextConfig;
