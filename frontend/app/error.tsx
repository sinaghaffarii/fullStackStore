'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ErrorData {
  type: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [errorData, setErrorData] = useState<ErrorData>({
    type: 'unknown',
    icon: '⚠️',
    title: 'خطایی رخ داده است',
    description: 'متاسفانه یک خطای غیرمنتظره رخ داده است. لطفا دوباره تلاش کن.',
    color: 'yellow',
  });

  useEffect(() => {
    console.error('Error:', error);

    const errorMessage = error.message?.toLowerCase() || '';
    const errorStack = error.stack?.toLowerCase() || '';

    let detectedError: ErrorData = {
      type: 'unknown',
      icon: '⚠️',
      title: 'خطایی رخ داده است',
      description:
        'متاسفانه یک خطای غیرمنتظره رخ داده است. لطفا دوباره تلاش کن.',
      color: 'yellow',
    };

    if (errorMessage.includes('not found') || errorMessage.includes('404')) {
      detectedError = {
        type: 'notfound',
        icon: '🔍',
        title: 'منبع پیدا نشد',
        description: 'صفحه یا منبعی که دنبال آن هستی وجود ندارد.',
        color: 'blue',
      };
    } else if (
      errorMessage.includes('unauthorized') ||
      errorMessage.includes('401') ||
      errorMessage.includes('forbidden') ||
      errorMessage.includes('403')
    ) {
      detectedError = {
        type: 'auth',
        icon: '🔐',
        title: 'دسترسی غیرمجاز',
        description:
          'شما اجازه دسترسی به این منبع را ندارید. لطفا وارد حساب خود شوید.',
        color: 'red',
      };
    } else if (
      errorMessage.includes('timeout') ||
      errorMessage.includes('network') ||
      errorMessage.includes('econnrefused')
    ) {
      detectedError = {
        type: 'network',
        icon: '🌐',
        title: 'مشکل در اتصال',
        description:
          'ارتباط با سرور قطع شده است. اتصال اینترنت خود را بررسی کن.',
        color: 'orange',
      };
    } else if (
      errorMessage.includes('server') ||
      errorMessage.includes('500') ||
      errorMessage.includes('internal')
    ) {
      detectedError = {
        type: 'server',
        icon: '💔',
        title: 'خطای سرور',
        description: 'سرور دچار مشکل شده است. لطفا بعدا دوباره تلاش کن.',
        color: 'red',
      };
    } else if (
      errorMessage.includes('validation') ||
      errorMessage.includes('invalid')
    ) {
      detectedError = {
        type: 'validation',
        icon: '✓',
        title: 'خطای اعتبار سنجی',
        description:
          'داده های ارسالی نامعتبر هستند. لطفا اطلاعات خود را بررسی کن.',
        color: 'orange',
      };
    } else if (
      errorMessage.includes('quota') ||
      errorMessage.includes('limit')
    ) {
      detectedError = {
        type: 'quota',
        icon: '📊',
        title: 'حد مجاز تجاوز شد',
        description:
          'شما از حد مجاز درخواست ها استفاده کرده اید. لطفا بعدا تلاش کن.',
        color: 'red',
      };
    }

    setErrorData(detectedError);
  }, [error]);

  const getColorClasses = (color: string) => {
    const colors: {
      [key: string]: { bg: string; text: string; border: string };
    } = {
      red: {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
      },
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
      },
      orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
      },
      yellow: {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
      },
    };
    return colors[color] || colors.yellow;
  };

  const colors = getColorClasses(errorData.color);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div
          className={`mb-8 p-6 rounded-2xl border-2 ${colors.bg} ${colors.border} inline-block`}
        >
          <div className="text-6xl mb-4">{errorData.icon}</div>
        </div>

        <div className="space-y-4">
          <h1 className={`text-4xl md:text-5xl font-bold ${colors.text}`}>
            {errorData.title}
          </h1>
          <p className="text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
            {errorData.description}
          </p>

          {errorData.type !== 'unknown' && (
            <p className="text-sm text-slate-500 font-mono bg-slate-100 rounded-lg p-3 mt-6 break-all">
              نوع خطا: <span className={colors.text}>{errorData.type}</span>
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Button
              onClick={reset}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
            >
              تلاش مجدد
            </Button>
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8 py-3 rounded-lg font-semibold transition-all hover:shadow-lg"
              >
                بازگشت به خانه
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            شناسه خطا:{' '}
            <code className="bg-slate-100 px-2 py-1 rounded">
              {error.digest || 'N/A'}
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
