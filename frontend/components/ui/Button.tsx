/* eslint-disable max-lines */
import type { VariantProps } from 'class-variance-authority';

import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../lib/utils';

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2 rounded-lg text-sm',
        sm: 'h-8 rounded-sm px-3 text-xs',
        lg: 'h-10 rounded-lg px-8 text-base',
        xl: 'h-12 rounded-lg px-8 text-lg font-bold',
        icon: 'size-10 rounded-lg',
        'icon-sm': 'size-6 rounded-md',
        'icon-lg': 'size-8 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface ButtonProps
  extends Omit<React.ComponentProps<'button'>, 'type'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  type?: 'button' | 'reset' | 'submit';
}

function resolveLeftIcon({
  loading,
  leftIcon,
  icon,
  iconPosition,
}: {
  loading: boolean;
  leftIcon?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition: 'left' | 'right';
}) {
  if (loading) {
    return <Loader2 className="animate-spin" />;
  }

  if (leftIcon) {
    return leftIcon;
  }

  if (icon && iconPosition === 'left') {
    return icon;
  }

  return null;
}

function resolveRightIcon({
  rightIcon,
  icon,
  iconPosition,
}: {
  rightIcon?: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition: 'left' | 'right';
}) {
  if (rightIcon) {
    return rightIcon;
  }

  if (icon && iconPosition === 'right') {
    return icon;
  }

  return null;
}
function renderButtonContent({
  asChild,
  children,
  leftIcon,
  rightIcon,
}: {
  asChild: boolean;
  children: React.ReactNode;
  leftIcon: React.ReactNode;
  rightIcon: React.ReactNode;
}) {
  if (asChild) {
    return children;
  }

  return (
    <>
      {leftIcon}
      {children}
      {rightIcon}
    </>
  );
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  leftIcon,
  rightIcon,
  icon,
  iconPosition = 'left',
  loading = false,
  disabled,
  type = 'button',
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  const resolvedLeftIcon = resolveLeftIcon({
    loading,
    leftIcon,
    icon,
    iconPosition,
  });

  const resolvedRightIcon = resolveRightIcon({
    rightIcon,
    icon,
    iconPosition,
  });

  const content = renderButtonContent({
    asChild,
    children,
    leftIcon: resolvedLeftIcon,
    rightIcon: resolvedRightIcon,
  });

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      type={asChild ? undefined : type}
      data-slot="button"
      {...props}
    >
      {content}
    </Comp>
  );
}

export { Button, buttonVariants };
