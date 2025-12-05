'use client';

import { ArrowRight, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';

interface OTPFormProps {
  onSubmit: (data: { code: string }) => void;
  isLoading: boolean;
  onBack: () => void;
}

export function OTPForm({ onSubmit, isLoading, onBack }: OTPFormProps) {
  const form = useForm<{ code: string }>({
    defaultValues: { code: '' },
  });

  return (
    <div className="animate-in duration-300 zoom-in-95 fade-in">
      <Form {...form}>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="code"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="sr-only">کد تأیید</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    dir="ltr"
                    maxLength={6}
                    autoComplete="one-time-code"
                    dimension="lg"
                    placeholder="••••••"
                    rounded="lg"
                  />
                </FormControl>
                <FormMessage className="text-center text-xs font-medium text-red-500" />
              </FormItem>
            )}
          />
          <Button
            size="lg"
            className="w-full"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="size-5 animate-spin" />
                <span>بررسی کد...</span>
              </div>
            ) : (
              'ورود به حساب کاربری'
            )}
          </Button>
        </form>
      </Form>
      <div className="mt-6 text-center">
        <button
          className="inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
          type="button"
          onClick={onBack}
        >
          <ArrowRight size={16} />
          <span>تغییر شماره موبایل</span>
        </button>
      </div>
    </div>
  );
}
