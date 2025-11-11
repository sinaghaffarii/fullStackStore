import * as React from 'react';

import { cn } from '../../src/lib/utils';

interface InputProps extends React.ComponentProps<'input'> {
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
  ...props
}: InputProps) {
  const hasLeftIcon = leftIcon && iconPosition === 'left';
  const hasRightIcon = rightIcon && iconPosition === 'right';

  return (
    <div className="relative">
      {hasLeftIcon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          {leftIcon}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-11 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          hasLeftIcon && 'pl-10',
          hasRightIcon && 'pr-10',
          className,
        )}
        {...props}
      />
      {hasRightIcon && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          {rightIcon}
        </div>
      )}
    </div>
  );
}

export { Input };
