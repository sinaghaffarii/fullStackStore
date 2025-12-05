import type { Metadata } from 'next';

import './globals.css';
import Link from 'next/link';

import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: '۴۰۴ - صفحه پیدا نشد',
  description: 'صفحه‌ای که دنبال آن هستی وجود ندارد.',
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html dir="rtl" lang="fa">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          * {
            font-family: 'KalamehWebFaNum', sans-serif;
          }
        `}</style>
      </head>
      <body className="min-h-screen bg-white">
        <div className="flex min-h-screen items-center justify-center px-4 py-20">
          <div className="mx-auto max-w-3xl text-center">
            {/* Content */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="text-6xl font-black text-gray-900 md:text-7xl lg:text-8xl">
                  ۴۰۴
                </h1>
                <p className="text-2xl font-bold text-gray-800 md:text-3xl lg:text-4xl">
                  صفحه پیدا نشد
                </p>
              </div>

              <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
                متاسفانه صفحه‌ای که می‌خواستی وجود ندارد. اما نگران نباش، ما
                می‌تونیم کمکت کنیم!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col items-center justify-center gap-4 pt-6 sm:flex-row md:pt-8">
                <Link className="w-full sm:w-auto" href="/">
                  <Button
                    size="lg"
                    className="w-full bg-orange-500 px-8 py-3 text-base text-white hover:bg-orange-600"
                  >
                    بازگشت به خانه
                  </Button>
                </Link>
                <Link className="w-full sm:w-auto" href="/products">
                  <Button
                    size="lg"
                    className="w-full border-2 border-orange-500 px-8 py-3 text-base text-orange-600 hover:bg-orange-50"
                    variant="outline"
                  >
                    دیدن محصولات
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
