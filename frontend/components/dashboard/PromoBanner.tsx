'use client';

import { ArrowLeft, Zap } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface PromoBannerProps {
  title: string;
  subtitle: string;
  actionText: string;
  onAction?: () => void;
  className?: string;
}

export function PromoBanner({
  title,
  subtitle,
  actionText,
  onAction,
  className,
}: PromoBannerProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden border-0 bg-linear-to-br from-primary via-primary to-primary/80 text-white',
        className,
      )}
    >
      <CardContent className="space-y-4 p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg leading-tight font-bold">{title}</h3>
            <p className="text-sm text-white/80">{subtitle}</p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            <Zap className="size-5" />
          </div>
        </div>
        <Button
          size="sm"
          className="w-full bg-white text-primary hover:bg-white/90"
          variant="secondary"
          onClick={onAction}
        >
          {actionText}
          <ArrowLeft className="mr-2 size-4" />
        </Button>
      </CardContent>
      {/* Decorative circles */}
      <div className="absolute -bottom-8 -left-8 size-32 rounded-full bg-white/10" />
      <div className="absolute -top-8 -right-8 size-32 rounded-full bg-white/10" />
    </Card>
  );
}
