'use client';

import type { VariantProps } from 'class-variance-authority';

import * as SelectPrimitive from '@radix-ui/react-select';
import { cva } from 'class-variance-authority';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

// ============= Variants =============

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
        error: 'border-destructive ring-destructive/20',
      },
    },
    defaultVariants: {
      size: 'md',
      variant: 'default',
    },
  },
);

// ============= Types =============

interface SelectProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root>,
    VariantProps<typeof selectVariants> {
  placeholder?: string;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

interface SelectItemProps
  extends React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> {
  children: React.ReactNode;
}

// ============= Main Select Component =============

function Select({
  placeholder = 'انتخاب کنید',
  size,
  variant,
  className,
  children,
  icon,
  ...props
}: SelectProps) {
  return (
    <SelectPrimitive.Root {...props}>
      <SelectPrimitive.Trigger
        className={cn(selectVariants({ size, variant }), className)}
      >
        {icon && <span className="ml-2">{icon}</span>}
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon className="size-4 opacity-50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          align="start"
          side="bottom"
          sideOffset={4}
          position="popper"
          className={cn(
            'relative z-50 max-h-60 min-w-32 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md',
            // Animation
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
            'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
            // Popper position
            'data-[side=bottom]:translate-y-1 data-[side=top]:-translate-y-1',
          )}
        >
          <SelectPrimitive.Viewport className="h-(--radix-select-trigger-height) w-full min-w-(--radix-select-trigger-width) p-1">
            {children}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}

// ============= SelectItem Component =============

function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <SelectPrimitive.Item
      className={cn(
        'relative flex w-full cursor-pointer items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none select-none',
        'focus:bg-accent focus:text-accent-foreground',
        'data-disabled:pointer-events-none data-disabled:opacity-50',
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
}

// ============= Export =============

export { Select, SelectItem };
export type { SelectItemProps, SelectProps };
