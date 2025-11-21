/* eslint-disable max-lines-per-function */
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-8 flex justify-center">
          <svg
            height="300"
            width="300"
            className="w-full max-w-md drop-shadow-lg"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 300 300"
          >
            <circle
              cx="150"
              cy="150"
              fill="#f8fafc"
              r="145"
              stroke="#e2e8f0"
              strokeWidth="2"
            />

            <g>
              <text
                fill="#1e293b"
                x="80"
                y="160"
                fontFamily="Arial, sans-serif"
                fontSize="80"
                fontWeight="bold"
              >
                4
              </text>
              <text
                fill="#1e293b"
                x="150"
                y="160"
                fontFamily="Arial, sans-serif"
                fontSize="80"
                fontWeight="bold"
              >
                0
              </text>
              <text
                fill="#1e293b"
                x="220"
                y="160"
                fontFamily="Arial, sans-serif"
                fontSize="80"
                fontWeight="bold"
              >
                4
              </text>
            </g>

            <g transform="translate(200, 60)">
              <circle
                cx="0"
                cy="0"
                fill="none"
                r="25"
                stroke="#3b82f6"
                strokeWidth="3"
              />
              <line
                x1="15"
                x2="35"
                y1="15"
                y2="35"
                stroke="#3b82f6"
                strokeLinecap="round"
                strokeWidth="3"
              />
              <text
                fill="#3b82f6"
                x="-8"
                y="8"
                fontFamily="Arial, sans-serif"
                fontSize="24"
                fontWeight="bold"
              >
                ?
              </text>
            </g>

            <g transform="translate(50, 50)">
              <circle
                cx="0"
                cy="0"
                fill="#fee2e2"
                r="20"
                stroke="#fca5a5"
                strokeWidth="2"
              />
              <line
                x1="-8"
                x2="8"
                y1="-8"
                y2="8"
                stroke="#dc2626"
                strokeLinecap="round"
                strokeWidth="3"
              />
              <line
                x1="8"
                x2="-8"
                y1="-8"
                y2="8"
                stroke="#dc2626"
                strokeLinecap="round"
                strokeWidth="3"
              />
            </g>

            <circle cx="80" cy="60" fill="#94a3b8" r="3" opacity="0.6" />
            <circle cx="220" cy="220" fill="#94a3b8" r="3" opacity="0.6" />
            <circle cx="60" cy="200" fill="#cbd5e1" r="4" opacity="0.5" />
            <circle cx="250" cy="100" fill="#cbd5e1" r="2" opacity="0.5" />
          </svg>
        </div>

        <div className="space-y-4">
          <h1 className="mb-2 text-5xl font-bold text-slate-900 md:text-6xl">
            ۴۰۴
          </h1>
          <p className="mb-4 text-2xl font-semibold text-slate-700">
            صفحه مورد نظر پیدا نشد! 😅
          </p>
          <p className="mx-auto mb-8 max-w-lg text-lg leading-relaxed text-slate-600">
            متاسفانه صفحه‌ای که به دنبالش هستی وجود ندارد یا منتقل شده. اما
            نگران نباش، ما اینجا هستیم تا کمکت کنیم! 🛍️
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/">
              <Button
                size="lg"
                className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg"
              >
                بازگشت به صفحه‌ اول
              </Button>
            </Link>
            <Link href="/products">
              <Button
                size="lg"
                className="rounded-lg border-slate-300 px-8 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:shadow-lg"
                variant="outline"
              >
                مرور محصولات
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8">
          <p className="text-sm text-slate-600">
            سوال داری؟
            <Link
              className="font-semibold text-blue-600 transition-colors hover:text-blue-700 hover:underline"
              href="/contact"
            >
              با ما تماس بگیر
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
