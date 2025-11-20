import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  images: {
    domains: ['storage.khanoumi.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.khanoumi.com',
        port: '',
        pathname: '/ProductImages/**',
      },
    ],
  },
};

export default nextConfig;
