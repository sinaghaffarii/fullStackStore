import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const inputVariants = cva(
  'w-full border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      dimension: {
        sm: 'h-8',
        default: 'h-10',
        lg: 'h-12',
      },
      variant: {
        default: '',
        error: 'border-destructive focus-visible:ring-destructive/20',
      },
      rounded: {
        default: 'rounded-md',
        lg: 'rounded-lg',
      },
    },
    defaultVariants: {
      dimension: 'default',
      variant: 'default',
      rounded: 'default',
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
}

export const Input = ({
  ref,
  className,
  label,
  error,
  dimension,
  variant,
  rounded,
  required,
  ...props
}: InputProps & { ref?: React.RefObject<HTMLInputElement | null> }) => (
  <div className="w-full space-y-1.5">
    {label && (
      <label className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
    )}

    <input
      aria-invalid={!!error}
      ref={ref}
      className={cn(
        inputVariants({
          dimension,
          variant: error ? 'error' : variant,
          rounded,
        }),
        className,
      )}
      {...props}
    />

    {error && <p className="text-xs font-medium text-destructive">{error}</p>}
  </div>
);

Input.displayName = 'Input';
