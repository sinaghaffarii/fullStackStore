'use client';

import type { ComponentProps } from 'react';

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { XIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = ({
  ref,
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Overlay> & {
  ref?: React.RefObject<React.ElementRef<
    typeof DialogPrimitive.Overlay
  > | null>;
}) => (
  <DialogPrimitive.Overlay
    ref={ref}
    data-slot="dialog-overlay"
    className={cn(
      'fixed inset-0 z-50 bg-black/30 backdrop-blur-sm',
      'data-[state=open]:animate-in data-[state=open]:fade-in-0',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
      className,
    )}
    {...props}
  />
);
DialogOverlay.displayName = 'DialogOverlay';

interface DialogContentProps
  extends ComponentProps<typeof DialogPrimitive.Content> {
  showCloseButton?: boolean;
}

const DialogContent = ({
  ref,
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogContentProps & {
  ref?: React.RefObject<React.ElementRef<
    typeof DialogPrimitive.Content
  > | null>;
}) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      dir="rtl"
      ref={ref}
      data-slot="dialog-content"
      className={cn(
        'fixed top-1/2 left-1/2 z-50 w-full max-w-lg',
        '-translate-1/2',
        'flex max-h-[90vh] flex-col',
        'rounded-xl border border-border bg-background shadow-2xl',
        'duration-200',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0',
        'data-[state=open]:slide-in-from-top-2',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
        'data-[state=closed]:slide-out-to-top-2',
        'max-sm:max-w-[calc(100%-2rem)] max-sm:rounded-lg',
        className,
      )}
      {...props}
    >
      {showCloseButton && (
        <DialogPrimitive.Close
          data-slot="dialog-close"
          className={cn(
            'absolute top-4 left-4 z-10',
            'flex size-8 items-center justify-center rounded-full',
            'bg-muted/50 text-muted-foreground',
            'transition-all duration-150',
            'hover:bg-destructive/10 hover:text-destructive',
            'focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none',
            'disabled:pointer-events-none',
          )}
        >
          <XIcon className="size-4" />
          <span className="sr-only">بستن</span>
        </DialogPrimitive.Close>
      )}
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
);
DialogContent.displayName = 'DialogContent';

function DialogHeader({ className, ...props }: ComponentProps<'header'>) {
  return (
    <header
      data-slot="dialog-header"
      className={cn(
        'flex shrink-0 flex-col gap-2 border-b border-border p-6 text-right',
        'max-sm:p-4',
        className,
      )}
      {...props}
    />
  );
}

function DialogBody({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex-1 overflow-y-auto p-6', 'max-sm:p-4', className)}
      data-slot="dialog-body"
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: ComponentProps<'footer'>) {
  return (
    <footer
      data-slot="dialog-footer"
      className={cn(
        'flex shrink-0 flex-col-reverse gap-2 border-t border-border py-3 px-6',
        'sm:flex-row-reverse sm:justify-start',
        'max-sm:p-4',
        className,
      )}
      {...props}
    />
  );
}

const DialogTitle = ({
  ref,
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Title> & {
  ref?: React.RefObject<React.ElementRef<typeof DialogPrimitive.Title> | null>;
}) => (
  <DialogPrimitive.Title
    ref={ref}
    data-slot="dialog-title"
    className={cn(
      'text-lg leading-relaxed font-bold text-foreground',
      className,
    )}
    {...props}
  />
);
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = ({
  ref,
  className,
  ...props
}: ComponentProps<typeof DialogPrimitive.Description> & {
  ref?: React.RefObject<React.ElementRef<
    typeof DialogPrimitive.Description
  > | null>;
}) => (
  <DialogPrimitive.Description
    className={cn('text-sm leading-relaxed text-muted-foreground', className)}
    ref={ref}
    data-slot="dialog-description"
    {...props}
  />
);
DialogDescription.displayName = 'DialogDescription';

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
