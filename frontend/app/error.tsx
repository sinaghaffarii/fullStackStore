'use client';

import Link from 'next/link';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { getColorClasses } from '@/utils/colorClasses';

import type { ErrorData } from '../utils/errorDetector';

import { detectError } from '../utils/errorDetector';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const errorData: ErrorData = useMemo(() => detectError(error), [error]);
  const colors = useMemo(
    () => getColorClasses(errorData.color),
    [errorData.color],
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4">
      <div className="mx-auto max-w-2xl text-center">
        <div
          className={`mb-8 rounded-2xl border-2 p-6 ${colors.bg} ${colors.border} inline-block`}
        >
          <div className="mb-4 text-6xl">{errorData.icon}</div>
        </div>

        <div className="space-y-4">
          <h1 className={`text-4xl font-bold md:text-5xl ${colors.text}`}>
            {errorData.title}
          </h1>
          <p className="mx-auto max-w-lg text-lg leading-relaxed text-slate-600">
            {errorData.description}
          </p>

          {errorData.type !== 'unknown' && (
            <p className="mt-6 rounded-lg bg-slate-100 p-3 font-mono text-sm break-all text-slate-500">
              نوع خطا: <span className={colors.text}>{errorData.type}</span>
            </p>
          )}

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg"
              onClick={reset}
            >
              تلاش مجدد
            </Button>
            <Link href="/">
              <Button
                size="lg"
                className="rounded-lg border-slate-300 px-8 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:shadow-lg"
                variant="outline"
              >
                بازگشت به خانه
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8">
          <p className="text-xs text-slate-500">
            شناسه خطا:{' '}
            <code className="rounded-sm bg-slate-100 px-2 py-1">
              {error.digest || 'N/A'}
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
