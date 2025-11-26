'use client';

import { CheckCircle2, KeyRound } from 'lucide-react';
import { useState } from 'react';

import type { LoginInput } from '../../../../src/validations';

import { useAuth } from '../../../../src/hooks/useAuth';
import { EmailForm } from '../+components/EmailForm';
import { OTPForm } from '../+components/OtpForm';

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const { login, verifyOTP, isLoggingIn, isVerifyingOTP } = useAuth();

  const handleEmailSubmit = (data: LoginInput) => {
    login(data, {
      onSuccess: () => {
        setEmail(data.email);
        setStep('otp');
      },
    });
  };

  const handleOTPSubmit = (data: { code: string }) => {
    verifyOTP({ email, code: data.code });
  };

  return (
    <div className="relative flex min-h-[80svh] w-full items-center justify-center overflow-hidden bg-[#F9FAFB] px-4 py-12">
      <div className="absolute inset-0 size-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear_gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

      <div className="pointer-events-none absolute size-[500px] -translate-y-10 rounded-full bg-primary/5 blur-3xl"></div>

      <div className="relative w-full max-w-[420px] rounded-xl border border-gray-100 bg-white p-8 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] md:p-10">
        <div className="mb-8 text-center">
          <div className="mb-6 inline-flex size-14 items-center justify-center rounded-xl bg-primary/5 text-primary shadow-sm ring-1 ring-primary/10">
            {step === 'email' ? (
              <KeyRound size={26} strokeWidth={1.5} />
            ) : (
              <CheckCircle2 size={26} strokeWidth={1.5} />
            )}
          </div>
          <h1 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
            {step === 'email' ? 'خوش‌آمدید' : 'تأیید شماره همراه'}
          </h1>
          <p className="text-[15px] leading-relaxed text-gray-500">
            {step === 'email' ? (
              'برای ورود یا ثبت‌نام، شماره موبایل خود را وارد کنید'
            ) : (
              <>
                کد ارسال شده به
                <span className="dir-ltr inline-block font-semibold text-gray-800">
                  {email}
                </span>
                را وارد کنید
              </>
            )}
          </p>
        </div>

        <div className="relative">
          {step === 'email' ? (
            <EmailForm isLoading={isLoggingIn} onSubmit={handleEmailSubmit} />
          ) : (
            <OTPForm
              isLoading={isVerifyingOTP}
              onBack={() => setStep('email')}
              onSubmit={handleOTPSubmit}
            />
          )}
        </div>

        <div className="mt-10 border-t border-gray-50 pt-6 text-center">
          <p className="text-xs leading-5 text-gray-400 md:text-sm">
            با ورود به سیستم،
            <button
              className="cursor-pointer border-none bg-transparent p-0 text-gray-600 underline hover:text-primary"
              type="button"
            >
              قوانین و مقررات
            </button>
            استفاده از سرویس را می‌پذیرید.
          </p>
        </div>
      </div>
    </div>
  );
}
