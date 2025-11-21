import type { Metadata, Viewport } from 'next';

import './globals.css';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { StructuredData } from '@/components/seo/StructuredData';

import Footer from '../components/layout/footer';
import Header from '../components/layout/Header';
import { Providers } from '../src/lib/providers';

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
    <html dir="rtl" lang="fa">
      <head>
        <GoogleAnalytics />
      </head>
      <body className="flex min-h-screen flex-col bg-background font-sans antialiased">
        <Providers>
          <StructuredData />
          <Header />
          <main className="flex-1 sm:mb-52">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
