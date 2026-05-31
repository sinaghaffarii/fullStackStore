'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';

import type { BaseInputProps } from './Input';

import { BaseInput } from './Input';

interface CurrencyInputProps
  extends Omit<BaseInputProps, 'onChange' | 'type' | 'value'> {
  value: number | null;
  onChange: (value: number | null) => void;
  currency?: string;
}

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

const formatNumber = (num: number | null): string => {
  if (num === null || typeof num !== 'number' || isNaN(num)) {
    return '';
  }

  return num.toLocaleString('fa-IR');
};

const parseNumber = (str: string): number | null => {
  if (!str) return null;

  const cleaned = str
    .replace(/[\s,،٬]/g, '')

    .replace(/[۰-۹]/g, (d) => FA_DIGITS.indexOf(d).toString());

  if (!cleaned) return null;

  const n = Number(cleaned);
  return Number.isNaN(n) ? null : n;
};

export const CurrencyInput = ({
  ref,
  value,
  onChange,
  label,
  error,
  required,
  className,
  currency,
  ...props
}: CurrencyInputProps & { ref?: React.RefObject<HTMLInputElement | null> }) => {
  const [displayValue, setDisplayValue] = React.useState<string>(() =>
    formatNumber(value),
  );

  React.useEffect(() => {
    if (formatNumber(value) !== displayValue) {
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setDisplayValue(formatNumber(value));
    }
  }, [value, displayValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;

    const cleanedInput = inputText.replace(/[^0-9۰-۹]/g, '');

    if (cleanedInput === '') {
      onChange(null);
      return;
    }

    const num = parseNumber(cleanedInput);

    if (num !== null) {
      setDisplayValue(formatNumber(num));

      onChange(num);
    } else {
      setDisplayValue('');
      onChange(null);
    }
  };

  return (
    <div className={cn('relative w-full space-y-1.5', className)}>
      {currency && (
        <span className="pointer-events-none absolute top-1/2 right-3 z-10 -translate-y-1/2 text-sm text-gray-500">
          {currency}
        </span>
      )}

      <BaseInput
        {...props}
        className={cn(currency ? 'pr-12' : '', className)}
        label={label}
        ref={ref}
        required={required}
        type="text"
        value={displayValue}
        error={error}
        inputMode="numeric"
        onChange={handleChange}
      />
    </div>
  );
};

CurrencyInput.displayName = 'CurrencyInput';
