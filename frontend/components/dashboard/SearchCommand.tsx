'use client';

import {
  BarChart3,
  CreditCard,
  FileText,
  Package,
  Settings,
  ShoppingCart,
  User,
} from 'lucide-react';
import * as React from 'react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  const runCommand = React.useCallback(
    (command: () => void) => {
      onOpenChange(false);
      command();
    },
    [onOpenChange],
  );

  return (
    <CommandDialog onOpenChange={onOpenChange} open={open}>
      <CommandInput className="text-right" placeholder="جستجو کنید..." />
      <CommandList>
        <CommandEmpty>نتیجه‌ای یافت نشد.</CommandEmpty>
        <CommandGroup heading="پیشنهادات">
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                // Placeholder for action
              })
            }
          >
            <Package className="ml-2 size-4" />
            <span>محصولات</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                // Placeholder for action
              })
            }
          >
            <ShoppingCart className="ml-2 size-4" />
            <span>سفارشات</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                // Placeholder for action
              })
            }
          >
            <User className="ml-2 size-4" />
            <span>مشتریان</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                // Placeholder for action
              })
            }
          >
            <BarChart3 className="ml-2 size-4" />
            <span>گزارشات</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="صفحات">
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                // Placeholder for action
              })
            }
          >
            <FileText className="ml-2 size-4" />
            <span>داشبورد</span>
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                // Placeholder for action
              })
            }
          >
            <CreditCard className="ml-2 size-4" />
            <span>صورتحساب‌ها</span>
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                // Placeholder for action
              })
            }
          >
            <Settings className="ml-2 size-4" />
            <span>تنظیمات</span>
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
