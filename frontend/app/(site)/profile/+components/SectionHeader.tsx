// components/ui/SectionHeader.tsx
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/src/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  viewAllText?: string;
  align?: 'center' | 'right';
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  viewAllLink,
  viewAllText = 'مشاهده همه',
  align = 'right',
  className,
}) => (
  <div
    className={cn(
      'mb-8 md:mb-12',
      align === 'center' && 'text-center',
      className,
    )}
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">
          {title}
        </h2>
        {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
      </div>

      {viewAllLink && (
        <Link
          className="group flex shrink-0 items-center gap-1 text-sm font-medium text-brand-gray-600 transition-colors hover:text-primary"
          href={viewAllLink}
        >
          {viewAllText}
          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        </Link>
      )}
    </div>
  </div>
);
