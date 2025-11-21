import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  images: {
    domains: [
      'storage.khanoumi.com',
      'trustseal.enamad.ir',
      'logo.samandehi.ir',
      'images.rojashop.com',
      'Trustseal.eNamad.ir',
    ],
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
