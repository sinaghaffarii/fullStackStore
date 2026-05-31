import { Home } from 'lucide-react';

import type { BreadcrumbSegment } from '@/types/breadcrumb';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/Breadcrumb';

interface DynamicBreadcrumbProps {
  segments: BreadcrumbSegment[];
}

export default function DynamicBreadcrumb({
  segments,
}: DynamicBreadcrumbProps) {
  return (
    <Breadcrumb className="mb-8">
      <BreadcrumbList>
        <Home className="size-4" />
        {segments.map((segment, index) => (
          <BreadcrumbItem key={index}>
            {index > 0 && <BreadcrumbSeparator />}
            {segment.href ? (
              <BreadcrumbLink href={segment.href}>
                {segment.title}
              </BreadcrumbLink>
            ) : (
              <BreadcrumbPage>{segment.title}</BreadcrumbPage>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
