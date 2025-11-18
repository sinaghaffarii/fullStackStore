import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: '۴۰۴ - صفحه پیدا نشد',
  description: 'صفحه‌ای که دنبال آن هستی وجود ندارد.',
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>{`
          * {
            font-family: 'KalamehWebFaNum', sans-serif;
          }
        `}</style>
      </head>
      <body className="bg-white min-h-screen">
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
          <div className="text-center max-w-3xl mx-auto">
            {/* Content */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-gray-900">
                  ۴۰۴
                </h1>
                <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
                  صفحه پیدا نشد
                </p>
              </div>

              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                متاسفانه صفحه‌ای که می‌خواستی وجود ندارد. اما نگران نباش، ما
                می‌تونیم کمکت کنیم!
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 md:pt-8">
                <Link href="/" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-base"
                  >
                    بازگشت به خانه
                  </Button>
                </Link>
                <Link href="/products" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-3 text-base"
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
