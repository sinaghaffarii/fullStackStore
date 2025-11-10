'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type { LoginInput } from '../../../../src/validations';

import { Button } from '../../../../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '../../../../src/hooks/useAuth';
import { loginSchema } from '../../../../src/validations';

export default function LoginPage() {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const { login, verifyOTP, isLoggingIn, isVerifyingOTP } = useAuth();

  const emailForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
    },
  });

  const otpForm = useForm<{ code: string }>({
    defaultValues: {
      code: '',
    },
  });

  const onEmailSubmit = (data: LoginInput) => {
    login(data, {
      onSuccess: () => {
        setEmail(data.email);
        setStep('otp');
      },
    });
  };

  const onOTPSubmit = (data: { code: string }) => {
    verifyOTPMutation.mutate({
      email,
      code: data.code,
    });
  };

  if (step === 'otp') {
    return (
      <div className="container max-w-md mx-auto py-12">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">ورود به حساب</h1>
            <p className="text-muted-foreground mt-2">
              کد ارسال شده به {email} را وارد کنید
            </p>
          </div>

          <Form {...otpForm}>
            <form
              className="space-y-4"
              onSubmit={otpForm.handleSubmit(onOTPSubmit)}
            >
              <FormField
                name="code"
                control={otpForm.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>کد تأیید</FormLabel>
                    <FormControl>
                      <Input {...field} maxLength={6} placeholder="123456" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full"
                disabled={isVerifyingOTP}
                type="submit"
              >
                {isVerifyingOTP ? 'در حال تأیید...' : 'تأیید'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">ورود به حساب</h1>
          <p className="text-muted-foreground mt-2">
            برای ورود ایمیل خود را وارد کنید
          </p>
        </div>

        <Form {...emailForm}>
          <form
            className="space-y-4"
            onSubmit={emailForm.handleSubmit(onEmailSubmit)}
          >
            <FormField
              name="email"
              control={emailForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ایمیل</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="example@email.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" disabled={isLoggingIn} type="submit">
              {isLoggingIn ? 'در حال ارسال کد...' : 'ارسال کد تأیید'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
