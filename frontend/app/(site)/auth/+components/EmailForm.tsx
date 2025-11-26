'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import type { LoginInput } from '../../../../src/validations';

import { loginSchema } from '../../../../src/validations';

interface EmailFormProps {
  onSubmit: (data: LoginInput) => void;
  isLoading: boolean;
}

export function EmailForm({ onSubmit, isLoading }: EmailFormProps) {
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '' },
  });

  return (
    <Form {...form}>
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel className="sr-only">شماره موبایل</FormLabel>
              <FormControl>
                <div className="group relative">
                  <div className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-primary">
                    <Phone size={20} />
                  </div>
                  <Input
                    {...field}
                    dir="ltr"
                    type="tel"
                    dimension="lg"
                    placeholder="09__ ___ ____"
                    rounded="lg"
                  />
                </div>
              </FormControl>
              <FormMessage className="mt-1.5 text-xs font-medium text-red-500" />
            </FormItem>
          )}
        />
        <Button size="lg" className="w-full" disabled={isLoading} type="submit">
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="size-5 animate-spin" />
              <span>لطفا صبر کنید...</span>
            </div>
          ) : (
            'دریافت کد تأیید'
          )}
        </Button>
      </form>
    </Form>
  );
}
