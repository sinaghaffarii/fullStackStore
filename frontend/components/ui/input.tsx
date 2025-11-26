import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../src/lib/utils';

const inputVariants = cva(
  'w-full min-w-0 border border-input bg-transparent shadow-xs transition-[color,box-shadow,background-color] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-[3px] focus-visible:ring-primary/10 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30',
  {
    variants: {
      dimension: {
        default: 'h-11 px-3 py-1 text-base md:text-sm',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-12 px-4 text-base',
        xl: 'h-14 px-4 text-lg tracking-wide',
      },

      rounded: {
        default: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        full: 'rounded-full',
      },

      variant: {
        default: 'border-input focus:bg-white hover:bg-gray-50/50',
        error:
          'border-destructive ring-destructive/20 focus-visible:ring-destructive/20',
      },
    },
    defaultVariants: {
      dimension: 'default',
      rounded: 'default',
      variant: 'default',
    },
  },
);

interface InputProps
  extends Omit<React.ComponentProps<'input'>, 'size'>,
    VariantProps<typeof inputVariants> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

function Input({
  className,
  type,
  leftIcon,
  rightIcon,
  iconPosition = 'left',
  dimension,
  rounded,
  variant,
  ...props
}: InputProps) {
  const hasLeftIcon = leftIcon && iconPosition === 'left';
  const hasRightIcon = rightIcon && iconPosition === 'right';

  return (
    <div className="group relative">
      {hasLeftIcon && (
        <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-muted-foreground transition-colors group-focus-within:text-primary">
          {leftIcon}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          inputVariants({ dimension, rounded, variant }),
          hasLeftIcon && 'pl-10',
          hasRightIcon && 'pr-10',
          className,
        )}
        {...props}
      />
      {hasRightIcon && (
        <div className="absolute top-1/2 right-3 -translate-y-1/2 transform text-muted-foreground transition-colors group-focus-within:text-primary">
          {rightIcon}
        </div>
      )}
    </div>
  );
}

export { Input, inputVariants };
