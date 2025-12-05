import { Instagram, SendIcon, Youtube } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Props {
  variant?: 'desktop' | 'mobile';
}

const Newsletter: React.FC<Props> = ({ variant = 'desktop' }) => {
  const isMobile = variant === 'mobile';

  return (
    <section
      aria-labelledby={`newsletter-${variant}`}
      className={`space-y-4 ${isMobile ? 'lg:hidden' : 'hidden lg:flex lg:flex-col'}`}
    >
      <div className="space-y-1">
        <p
          className="text-sm font-semibold text-gray-300"
          id={`newsletter-${variant}`}
        >
          از تخفیف‌ها و جدیدترین‌های فاران آرایشی شاپ باخبر شوید
        </p>
        <p className="text-xs text-gray-400">
          با ثبت ایمیل یا شماره، زودتر از بقیه از کمپین‌ها مطلع شوید.
        </p>
      </div>

      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => e.preventDefault()}
      >
        <Input
          required
          aria-label="ایمیل یا شماره تماس"
          className="flex-1 rounded-full border-gray-300 bg-gray-50 text-sm placeholder:text-gray-400"
          inputMode="email"
          placeholder="ایمیل یا شماره تماس"
        />
        <Button
          size="lg"
          className="hover:bg-primary-dark rounded-full bg-primary px-6 text-white"
        >
          عضویت
        </Button>
      </form>

      <div className="flex gap-2">
        <Button
          size="icon"
          className="size-12 rounded-full border border-gray-200 text-gray-400 hover:border-primary hover:text-primary"
          variant="ghost"
        >
          <Instagram className="size-6" />
        </Button>
        <Button
          size="icon"
          className="size-12 rounded-full border border-gray-200 text-gray-400 hover:border-primary hover:text-primary"
          variant="ghost"
        >
          <Youtube className="size-6" />
        </Button>
        {!isMobile && (
          <Button
            size="icon"
            className="size-12 rounded-full border border-gray-200 text-gray-400 hover:border-primary hover:text-primary"
            variant="ghost"
          >
            <SendIcon className="size-6" />
          </Button>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
