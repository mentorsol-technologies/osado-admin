/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['async_hooks'],
  },
webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('async_hooks');
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
