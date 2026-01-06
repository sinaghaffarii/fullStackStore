'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

interface CurrencyInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value'
  > {
  value?: number | null;
  onChange: (value: number | null) => void;
  label?: string;
  error?: string;
  currency?: string;
}

// فرمت عدد با جداکننده هزارگان - روش ساده و بدون مشکل
const formatNumber = (num: number): string => {
  return num.toLocaleString('fa-IR');
};

const parseNumber = (str: string): number | null => {
  // حذف کاما، فاصله و اعداد فارسی به انگلیسی
  const cleaned = str
    .replace(/[\s,،]/g, '')
    .replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());

  if (cleaned === '') return null;
  const num = Number(cleaned);
  return Number.isNaN(num) ? null : num;
};

export const CurrencyInput = ({
  ref,
  value,
  onChange,
  label,
  error,
  required,
  currency = 'ریال',
  className,
  ...props
}: CurrencyInputProps & { ref?: React.RefObject<HTMLInputElement | null> }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [displayValue, setDisplayValue] = React.useState('');

  React.useImperativeHandle(ref, () => inputRef.current!);

  React.useEffect(() => {
    if (value != null) {
      setDisplayValue(formatNumber(value));
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // فقط ارقام فارسی و انگلیسی
    const digits = raw.replace(/[^0-9۰-۹]/g, '');

    if (digits === '') {
      setDisplayValue('');
      onChange(null);
      return;
    }

    const num = parseNumber(digits);
    if (num !== null) {
      setDisplayValue(formatNumber(num));
      onChange(num);
    }
  };

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          className="block text-sm font-medium text-foreground"
          htmlFor={props.id}
        >
          <span className="inline-flex items-center gap-1">
            {label}
            {required && (
              <>
                <span aria-hidden="true" className="text-destructive">
                  *
                </span>
                <span className="sr-only">الزامی</span>
              </>
            )}
          </span>
        </label>
      )}

      <div className="relative">
        <input
          aria-invalid={!!error}
          aria-required={!!required}
          ref={inputRef}
          type="text"
          value={displayValue}
          inputMode="numeric"
          onChange={handleChange}
          className={cn(
            'h-10 w-full rounded-md px-3 py-1 text-base md:text-sm',
            'border border-input bg-transparent shadow-xs',
            'transition-[color,box-shadow,background-color] outline-none',
            'focus-visible:border-primary/50 focus-visible:ring-[3px] focus-visible:ring-primary/10',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'placeholder:text-muted-foreground',
            error &&
              'border-destructive ring-destructive/20 focus-visible:border-destructive focus-visible:ring-destructive/20',
            'pl-14',
            className,
          )}
          {...props}
        />
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
          {currency}
        </span>
      </div>

      {error && (
        <span
          className="block text-xs font-medium text-destructive"
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
};

CurrencyInput.displayName = 'CurrencyInput';
