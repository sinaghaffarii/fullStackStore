/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
'use client';

// import { Turnstile } from '@marsidev/react-turnstile';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type { AuthError } from '@/types/auth';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useAdminLogin } from '@/services/auth/hooks';
import { ROUTE_OBJECT } from '@/utils/constants';

interface LoginFormData {
  username: string;
  password: string;
}

// interface TranstileInstance {
//   reset: () => void;
// }

// const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || ROUTE_OBJECT.DASHBOARD;

  const [showPassword, setShowPassword] = useState(false);
  // const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  // const [captchaError, setCaptchaError] = useState(false);

  const loginMutation = useAdminLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // const transtileRef = useRef<TranstileInstance>(null);

  const onSubmit = (data: LoginFormData) => {
    // if (!captchaToken) {
    //   setCaptchaError(true);
    //   return;
    // }

    // setCaptchaError(false);

    loginMutation.mutate(
      {
        username: data.username,
        password: data.password,
      },
      {
        onSuccess: () => {
          router.push(callbackUrl);
          router.refresh();
        },
        onError: (error: AuthError) => {
          if (error.field) {
            setError(error.field, { message: error.message });
          }
          // setCaptchaToken(null);
          // transtileRef.current?.reset();
        },
      },
    );
  };

  return (
    <form
      className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* نام کاربری */}
      <div>
        <label
          className="mb-1.5 block text-sm font-medium text-slate-700"
          htmlFor="username"
        >
          نام کاربری
        </label>
        <input
          disabled={loginMutation.isPending}
          id="username"
          type="text"
          autoComplete="username"
          placeholder="نام کاربری"
          className={cn(
            'block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900',
            'placeholder:text-slate-400',
            'focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none',
            'disabled:cursor-not-allowed disabled:bg-slate-50',
            errors.username &&
              'border-red-500 focus:border-red-500 focus:ring-red-500',
          )}
          {...register('username', {
            required: 'نام کاربری الزامی است',
            minLength: {
              value: 3,
              message: 'حداقل ۳ کاراکتر',
            },
          })}
        />
        {errors.username && (
          <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
        )}
      </div>

      {/* رمز عبور */}
      <div>
        <label
          className="mb-1.5 block text-sm font-medium text-slate-700"
          htmlFor="password"
        >
          رمز عبور
        </label>
        <div className="relative">
          <input
            disabled={loginMutation.isPending}
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="رمز عبور"
            className={cn(
              'block w-full rounded-md border border-slate-300 bg-white px-3 py-2 pl-10 text-sm text-slate-900',
              'placeholder:text-slate-400',
              'focus:border-slate-500 focus:ring-1 focus:ring-slate-500 focus:outline-none',
              'disabled:cursor-not-allowed disabled:bg-slate-50',
              errors.password &&
                'border-red-500 focus:border-red-500 focus:ring-red-500',
            )}
            {...register('password', {
              required: 'رمز عبور الزامی است',
              minLength: {
                value: 6,
                message: 'حداقل ۶ کاراکتر',
              },
            })}
          />
          <button
            className="absolute top-1/2 left-2.5 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            tabIndex={-1}
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      {/* کپچا
      <div className="mb-6">
        <Label className="mb-1.5 block text-sm font-medium text-slate-700">
          تأیید امنیتی
        </Label>
        <div
          className={cn(
            'flex justify-center rounded-md border border-slate-200 bg-slate-50 p-3',
            captchaError && 'border-red-500 bg-red-50',
          )}
        >
          <Turnstile
            siteKey={TURNSTILE_SITE_KEY}
            onError={() => {
              setCaptchaToken(null);
              setCaptchaError(true);
            }}
            onExpire={() => setCaptchaToken(null)}
            onSuccess={(token) => {
              setCaptchaToken(token);
              setCaptchaError(false);
            }}
            options={{
              theme: 'light',
              size: 'normal',
              language: 'fa',
            }}
          />
        </div>
        {captchaError && (
          <p className="mt-1 text-center text-xs text-red-600">
            لطفاً کپچا را تکمیل کنید
          </p>
        )}
      </div> */}

      {/* دکمه ورود */}
      <Button
        size="default"
        className="mt-2 w-full"
        disabled={loginMutation.isPending}
        type="submit"
        variant="default"
      >
        {loginMutation.isPending ? (
          <>
            <Loader2 className="ml-2 size-4 animate-spin" />
            در حال ورود...
          </>
        ) : (
          'ورود'
        )}
      </Button>

      {/* لینک بازگشت */}
      <div className="mt-4 text-center">
        <Link
          className="text-sm text-slate-500 hover:text-slate-700 hover:underline"
          href="/"
        >
          بازگشت به سایت
        </Link>
      </div>
    </form>
  );
}
