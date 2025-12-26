import * as React from 'react';

import { cn } from '@/lib/utils';

interface TextareaProps
  extends Omit<React.ComponentProps<'textarea'>, 'maxLength' | 'ref'> {
  label?: string;
  error?: string;
  maxLength?: number | false;
  rows?: number;
}

const Textarea = ({
  ref,
  className,
  label,
  error,
  maxLength: maxLengthProp,
  rows,
  value,
  ...props
}: TextareaProps & { ref?: React.RefObject<HTMLTextAreaElement | null> }) => {
  const maxLength =
    maxLengthProp === false ? undefined : (maxLengthProp ?? 150);

  const showCounter = maxLength !== undefined;
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          aria-invalid={!!error}
          maxLength={maxLength}
          ref={ref}
          value={value}
          data-slot="textarea"
          rows={rows}
          className={cn(
            'flex min-h-16 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:ring-destructive/40',
            !rows && 'field-sizing-content',
            showCounter && 'pb-7',
            error && 'border-destructive',
            className,
          )}
          {...props}
        />
        {showCounter && (
          <span className="pointer-events-none absolute bottom-2 left-3 text-xs text-muted-foreground">
            {currentLength} / {maxLength}
          </span>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

Textarea.displayName = 'Textarea';

export { Textarea };
