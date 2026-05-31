import type { VariantProps } from 'class-variance-authority';
import type { RegisterOptions } from 'react-hook-form';

import { cva } from 'class-variance-authority';
import * as React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

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

export interface BaseInputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  ref?: React.RefCallback<HTMLInputElement | null>;
}

export const BaseInput = ({
  ref,
  className,
  label,
  error,
  dimension,
  variant,
  rounded,
  required,
  rightIcon,
  leftIcon,
  ...props
}: BaseInputProps) => (
  <div className="w-full space-y-1.5">
    {label && (
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </label>
    )}

    <div className="relative">
      {rightIcon && (
        <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
          {rightIcon}
        </div>
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
          rightIcon && 'pr-10',
          leftIcon && 'pl-10',
          className,
        )}
        {...props}
      />

      {leftIcon && (
        <div className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
          {leftIcon}
        </div>
      )}
    </div>

    {error && <p className="text-xs font-medium text-destructive">{error}</p>}
  </div>
);

BaseInput.displayName = 'BaseInput';

// ------------------------------- Form Input Components ------------------------------

interface FormInputProps extends BaseInputProps {
  name: string;
  rules?: RegisterOptions;
}

export const FormInput = ({ name, rules, ...props }: FormInputProps) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field, fieldState }) => (
        <BaseInput
          {...field}
          {...props}
          error={props.error ?? fieldState.error?.message}
        />
      )}
    />
  );
};
