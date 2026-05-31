import type { Metadata, Viewport } from 'next';

import React, { Suspense } from 'react';
import { Bounce, ToastContainer } from 'react-toastify';

import './globals.css';
import './Kalameh.fontface.css';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';
import { Providers } from '@/lib/providers';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: {
    default: 'فاران بیوتی - بهترین قیمت‌ها و کیفیت',
    template: '%s | فاران بیوتی',
  },
  description:
    'فروشگاه اینترنتی با بهترین قیمت‌ها، کیفیت عالی و تحویل سریع. خرید آنلاین مطمئن و آسان.',
  keywords: ['فاران بیوتی', 'خرید اینترنتی', 'محصولات با کیفیت'],
  authors: [{ name: 'فاران بیوتی' }],
  creator: 'فاران بیوتی',
  publisher: 'فاران بیوتی',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000',
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: '/',
    siteName: 'فاران بیوتی',
    title: 'فاران بیوتی - بهترین قیمت‌ها و کیفیت',
    description: 'فروشگاه اینترنتی با بهترین قیمت‌ها، کیفیت عالی و تحویل سریع.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'فاران بیوتی - بهترین قیمت‌ها و کیفیت',
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
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <Suspense fallback={<div />}>
          <Providers>
            <ToastContainer
              draggable
              rtl
              theme="light"
              autoClose={3000}
              closeOnClick={false}
              hideProgressBar
              newestOnTop
              pauseOnFocusLoss={false}
              pauseOnHover={false}
              position="top-center"
              transition={Bounce}
            />
            {children}
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
