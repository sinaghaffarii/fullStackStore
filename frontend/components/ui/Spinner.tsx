import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'lg' | 'md' | 'sm';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'size-4',
    md: 'size-8',
    lg: 'size-12',
  };

  return (
    <div
      aria-label="در حال بارگذاری"
      role="status"
      className={cn(
        'animate-spin rounded-full border-2 border-primary border-t-transparent',
        sizeClasses[size],
        className,
      )}
    >
      <span className="sr-only">در حال بارگذاری...</span>
    </div>
  );
}
