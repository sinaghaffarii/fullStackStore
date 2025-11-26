/* eslint-disable max-lines */
'use client';

import type { VariantProps } from 'class-variance-authority';

import * as SelectPrimitive from '@radix-ui/react-select';
import { cva } from 'class-variance-authority';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/src/lib/utils';

// ============= Variants Definition =============

const selectVariants = cva(
  'flex w-full items-center justify-between gap-2 border bg-transparent text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4 [&_svg:not([class*="text-"])]:text-muted-foreground',
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

// ============= کامپوننت‌های داخلی (Internal Components) =============

const SelectScrollUpButton = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton> & {
  ref?: React.RefObject<React.ElementRef<
    typeof SelectPrimitive.ScrollUpButton
  > | null>;
}) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    data-slot="select-scroll-up-button"
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ChevronUpIcon className="size-4" />
  </SelectPrimitive.ScrollUpButton>
);
SelectScrollUpButton.displayName = 'SelectScrollUpButton';

const SelectScrollDownButton = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton> & {
  ref?: React.RefObject<React.ElementRef<
    typeof SelectPrimitive.ScrollDownButton
  > | null>;
}) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    data-slot="select-scroll-down-button"
    className={cn(
      'flex cursor-default items-center justify-center py-1',
      className,
    )}
    {...props}
  >
    <ChevronDownIcon className="size-4" />
  </SelectPrimitive.ScrollDownButton>
);
SelectScrollDownButton.displayName = 'SelectScrollDownButton';

const SelectTrigger = ({
  ref,
  className,
  dimension,
  rounded,
  variant,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> &
  VariantProps<typeof selectVariants> & {
    ref?: React.RefObject<React.ElementRef<
      typeof SelectPrimitive.Trigger
    > | null>;
  }) => (
  <SelectPrimitive.Trigger
    className={cn(selectVariants({ dimension, rounded, variant }), className)}
    ref={ref}
    data-slot="select-trigger"
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDownIcon className="size-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
);
SelectTrigger.displayName = 'SelectTrigger';

const SelectContent = ({
  ref,
  className,
  children,
  position = 'popper',
  align = 'center',
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
  ref?: React.RefObject<React.ElementRef<
    typeof SelectPrimitive.Content
  > | null>;
}) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      align={align}
      ref={ref}
      data-slot="select-content"
      position={position}
      className={cn(
        'relative z-50 max-h-(--radix-select-content-available-height) min-w-32 origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width) scroll-my-1',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);
SelectContent.displayName = 'SelectContent';

// ============= کامپوننت اصلی Select (Main Component) =============

interface SelectProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>,
    VariantProps<typeof selectVariants> {
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  children: React.ReactNode;
}

const Select = ({
  ref,
  placeholder = 'انتخاب کنید',
  dimension = 'default',
  rounded = 'default',
  variant = 'default',
  className,
  triggerClassName,
  contentClassName,
  children,
  ...props
}: SelectProps & {
  ref?: React.RefObject<React.ElementRef<
    typeof SelectPrimitive.Trigger
  > | null>;
}) => {
  return (
    <SelectPrimitive.Root {...props}>
      <SelectTrigger
        className={cn(className, triggerClassName)}
        ref={ref}
        variant={variant}
        dimension={dimension}
        rounded={rounded}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={contentClassName}>{children}</SelectContent>
    </SelectPrimitive.Root>
  );
};
Select.displayName = 'Select';

// ============= SelectItem Component =============

const SelectItem = ({
  ref,
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & {
  ref?: React.RefObject<React.ElementRef<typeof SelectPrimitive.Item> | null>;
}) => (
  <SelectPrimitive.Item
    ref={ref}
    data-slot="select-item"
    className={cn(
      'relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4 [&_svg:not([class*="text-"])]:text-muted-foreground *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2',
      className,
    )}
    {...props}
  >
    <span className="absolute right-2 flex size-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
);
SelectItem.displayName = 'SelectItem';

// ============= Export =============

export { Select, SelectItem };

// اگر نیاز به کامپوننت‌های اضافی داشتید (برای موارد پیشرفته):
export {
  SelectContent,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
};

// Export کامپوننت‌های Primitive برای موارد خاص
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;
export const SelectLabel = SelectPrimitive.Label;
export const SelectSeparator = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> & {
  ref?: React.RefObject<React.ElementRef<
    typeof SelectPrimitive.Separator
  > | null>;
}) => (
  <SelectPrimitive.Separator
    className={cn('pointer-events-none -mx-1 my-1 h-px bg-border', className)}
    ref={ref}
    data-slot="select-separator"
    {...props}
  />
);
SelectSeparator.displayName = 'SelectSeparator';

// Export type برای استفاده در کامپوننت‌های دیگر
export type { SelectProps };
