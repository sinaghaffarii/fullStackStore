import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8 flex justify-center">
          <svg
            width="300"
            height="300"
            viewBox="0 0 300 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full max-w-md drop-shadow-lg"
          >
            <circle
              cx="150"
              cy="150"
              r="145"
              fill="#f8fafc"
              stroke="#e2e8f0"
              strokeWidth="2"
            />

            <g>
              <text
                x="80"
                y="160"
                fontSize="80"
                fontWeight="bold"
                fill="#1e293b"
                fontFamily="Arial, sans-serif"
              >
                4
              </text>
              <text
                x="150"
                y="160"
                fontSize="80"
                fontWeight="bold"
                fill="#1e293b"
                fontFamily="Arial, sans-serif"
              >
                0
              </text>
              <text
                x="220"
                y="160"
                fontSize="80"
                fontWeight="bold"
                fill="#1e293b"
                fontFamily="Arial, sans-serif"
              >
                4
              </text>
            </g>

            <g transform="translate(200, 60)">
              <circle
                cx="0"
                cy="0"
                r="25"
                fill="none"
                stroke="#3b82f6"
                strokeWidth="3"
              />
              <line
                x1="15"
                y1="15"
                x2="35"
                y2="35"
                stroke="#3b82f6"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <text
                x="-8"
                y="8"
                fontSize="24"
                fontWeight="bold"
                fill="#3b82f6"
                fontFamily="Arial, sans-serif"
              >
                ?
              </text>
            </g>

            <g transform="translate(50, 50)">
              <circle
                cx="0"
                cy="0"
                r="20"
                fill="#fee2e2"
                stroke="#fca5a5"
                strokeWidth="2"
              />
              <line
                x1="-8"
                y1="-8"
                x2="8"
                y2="8"
                stroke="#dc2626"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line
                x1="8"
                y1="-8"
                x2="-8"
                y2="8"
                stroke="#dc2626"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </g>

            <circle cx="80" cy="60" r="3" fill="#94a3b8" opacity="0.6" />
            <circle cx="220" cy="220" r="3" fill="#94a3b8" opacity="0.6" />
            <circle cx="60" cy="200" r="4" fill="#cbd5e1" opacity="0.5" />
            <circle cx="250" cy="100" r="2" fill="#cbd5e1" opacity="0.5" />
          </svg>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-2">
            ۴۰۴
          </h1>
          <p className="text-2xl text-slate-700 mb-4 font-semibold">
            صفحه مورد نظر پیدا نشد! 😅
          </p>
          <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto leading-relaxed">
            متاسفانه صفحه‌ای که به دنبالش هستی وجود ندارد یا منتقل شده. اما
            نگران نباش، ما اینجا هستیم تا کمکت کنیم! 🛍️
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
              >
                بازگشت به صفحه‌ اول
              </Button>
            </Link>
            <Link href="/products">
              <Button
                variant="outline"
                size="lg"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
              >
                مرور محصولات
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-600">
            سوال داری؟
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline"
            >
              با ما تماس بگیر
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
