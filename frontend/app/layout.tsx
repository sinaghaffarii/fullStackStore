import type { Metadata, Viewport } from 'next';

import { Inter } from 'next/font/google';

import './globals.css';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { StructuredData } from '@/components/seo/StructuredData';
import { Providers } from '@/lib/providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: {
    default: 'فروشگاه آنلاین - بهترین قیمت‌ها و کیفیت',
    template: '%s | فروشگاه آنلاین',
  },
  description:
    'فروشگاه اینترنتی با بهترین قیمت‌ها، کیفیت عالی و تحویل سریع. خرید آنلاین مطمئن و آسان.',
  keywords: ['فروشگاه آنلاین', 'خرید اینترنتی', 'محصولات با کیفیت'],
  authors: [{ name: 'فروشگاه آنلاین' }],
  creator: 'فروشگاه آنلاین',
  publisher: 'فروشگاه آنلاین',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: '/',
    siteName: 'فروشگاه آنلاین',
    title: 'فروشگاه آنلاین - بهترین قیمت‌ها و کیفیت',
    description: 'فروشگاه اینترنتی با بهترین قیمت‌ها، کیفیت عالی و تحویل سریع.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'فروشگاه آنلاین - بهترین قیمت‌ها و کیفیت',
    description: 'فروشگاه اینترنتی با بهترین قیمت‌ها، کیفیت عالی و تحویل سریع.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html dir="rtl" lang="fa" className={inter.variable}>
      <head>
        <GoogleAnalytics />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <StructuredData />
          {children}
        </Providers>
      </body>
    </html>
  );
}
