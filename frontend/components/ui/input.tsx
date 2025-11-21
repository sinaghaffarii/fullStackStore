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
        <div className="absolute top-1/2 left-3 -translate-y-1/2 transform text-muted-foreground">
          {leftIcon}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          'h-11 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30',
          'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
          'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
          hasLeftIcon && 'pl-10',
          hasRightIcon && 'pr-10',
          className,
        )}
        {...props}
      />
      {hasRightIcon && (
        <div className="absolute top-1/2 right-3 -translate-y-1/2 transform text-muted-foreground">
          {rightIcon}
        </div>
      )}
    </div>
  );
}

export { Input };
