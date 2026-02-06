/* eslint-disable max-lines */
'use client';

import type { VariantProps } from 'class-variance-authority';

import * as SelectPrimitive from '@radix-ui/react-select';
import { cva } from 'class-variance-authority';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

const selectVariants = cva(
  'flex w-full items-center justify-between gap-2 border bg-transparent text-sm shadow-xs transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[placeholder]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      size: {
        sm: 'h-8 px-2.5 text-xs rounded-md',
        md: 'h-9 px-3 text-sm rounded-md',
        lg: 'h-10 px-3.5 text-sm rounded-lg',
      },
      variant: {
        default: 'border-input hover:bg-accent/50',
        error:
          'border-destructive ring-destructive/20 focus-visible:border-destructive focus-visible:ring-destructive/20',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  },
);

const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

// ============ SelectTrigger ============
interface SelectTriggerProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>,
    VariantProps<typeof selectVariants> {}

const SelectTrigger = ({
  ref,
  className,
  children,
  size,
  variant,
  ...props
}: SelectTriggerProps & {
  ref?: React.RefObject<React.ElementRef<
    typeof SelectPrimitive.Trigger
  > | null>;
}) => (
  <SelectPrimitive.Trigger
    className={cn(selectVariants({ size, variant }), className)}
    ref={ref}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDownIcon className="size-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

// ============ Select (with label/error wrapper) ============
interface SelectProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> {
  label?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

function Select({ label, required, error, children, ...props }: SelectProps) {
  const triggerId = React.useId();

  const enhancedChildren = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    const childType = child.type as { displayName?: string };
    if (childType.displayName === SelectPrimitive.Trigger.displayName) {
      return React.cloneElement(
        child as React.ReactElement<SelectTriggerProps>,
        {
          id: triggerId,
          'aria-required': required,
          'aria-invalid': !!error,
          variant: error
            ? 'error'
            : (child.props as SelectTriggerProps).variant,
        },
      );
    }

    return child;
  });

  // بدون label و error، فقط Root را برگردان
  if (!label && !error) {
    return (
      <SelectPrimitive.Root {...props}>{enhancedChildren}</SelectPrimitive.Root>
    );
  }

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          className="block text-sm font-medium text-foreground"
          htmlFor={triggerId}
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
      <SelectPrimitive.Root {...props}>{enhancedChildren}</SelectPrimitive.Root>
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
}
Select.displayName = 'Select';

// ============ SelectContent ============
const SelectContent = ({
  ref,
  className,
  children,
  position = 'popper',
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & {
  ref?: React.RefObject<React.ElementRef<
    typeof SelectPrimitive.Content
  > | null>;
}) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      className={cn(
        'relative z-50 max-h-60 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
        'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
        position === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        className,
      )}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          'p-1',
          position === 'popper' &&
            'h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width)',
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

// ============ SelectLabel ============
const SelectLabel = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label> & {
  ref?: React.RefObject<React.ElementRef<typeof SelectPrimitive.Label> | null>;
}) => (
  <SelectPrimitive.Label
    className={cn('py-1.5 pr-8 pl-2 text-sm font-semibold', className)}
    ref={ref}
    {...props}
  />
);
SelectLabel.displayName = SelectPrimitive.Label.displayName;

// ============ SelectItem ============
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
    className={cn(
      'relative flex w-full cursor-pointer items-center rounded-sm py-1.5 ps-2 pe-8 text-sm outline-none select-none',
      'focus:bg-accent focus:text-accent-foreground',
      'data-disabled:pointer-events-none data-disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <span className="absolute end-2 flex size-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <CheckIcon className="size-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
);
SelectItem.displayName = SelectPrimitive.Item.displayName;

// ============ SelectSeparator ============
const SelectSeparator = ({
  ref,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator> & {
  ref?: React.RefObject<React.ElementRef<
    typeof SelectPrimitive.Separator
  > | null>;
}) => (
  <SelectPrimitive.Separator
    className={cn('-mx-1 my-1 h-px bg-muted', className)}
    ref={ref}
    {...props}
  />
);
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
