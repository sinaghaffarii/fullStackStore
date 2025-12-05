/* eslint-disable max-lines */
'use client';

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Megaphone,
  Package,
  ShoppingBag,
  TrendingUp,
  Users,
} from 'lucide-react';
import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const insightsData = [
  {
    id: 1,
    title: 'برجسته‌های بازاریابی',
    subtitle: 'کمپین‌های اخیر',
    actionText: 'کاوش در کمپین‌ها',
    icon: Megaphone,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    avatars: ['/avatars/1.jpg', '/avatars/2.jpg', '/avatars/3.jpg'],
  },
  {
    id: 2,
    title: 'هشدارهای موجودی کم',
    subtitle: 'اقلام در حال اتمام است',
    actionText: 'مشاهده موجودی',
    icon: Package,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    avatars: ['/avatars/4.jpg', '/avatars/5.jpg'],
  },
  {
    id: 3,
    title: 'بالا ۵ دسته‌بندی‌ها',
    subtitle: 'دسته‌های محبوب',
    actionText: 'مرور دسته‌بندی‌ها',
    icon: TrendingUp,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    avatars: ['/avatars/6.jpg', '/avatars/7.jpg', '/avatars/8.jpg'],
  },
  {
    id: 4,
    title: 'محبوبیت مشتریان',
    subtitle: 'مشتری ماه',
    actionText: 'مرور مشتریان',
    icon: Users,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    avatars: ['/avatars/9.jpg', '/avatars/10.jpg'],
  },
  {
    id: 5,
    title: 'بالا ۱۰ محصولات',
    subtitle: 'محصولات ویژه',
    actionText: 'مرور محصولات',
    icon: ShoppingBag,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    avatars: ['/avatars/11.jpg', '/avatars/12.jpg', '/avatars/13.jpg'],
  },
];

export function PerformanceInsights() {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-foreground">بینش‌های عملکرد</h2>
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            className="size-8"
            variant="outline"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button
            size="icon"
            className="size-8"
            variant="outline"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="size-4" />
          </Button>
        </div>
      </div>

      {/* Scrollable Cards */}
      <div
        className="scrollbar-hide flex gap-4 overflow-x-auto pb-2"
        ref={scrollRef}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {insightsData.map((insight) => {
          const IconComponent = insight.icon;
          return (
            <Card
              className="min-w-[220px] shrink-0 border-border/50 bg-card transition-shadow hover:shadow-md"
              key={insight.id}
            >
              <CardContent className="space-y-4 p-4">
                {/* Header with avatars and icon */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2 space-x-reverse">
                    {insight.avatars.slice(0, 3).map((avatar, idx) => (
                      <Avatar className="size-9 border-2 border-card" key={idx}>
                        <AvatarImage src={avatar} />
                        <AvatarFallback className="bg-muted text-xs">
                          {idx + 1}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <div
                    className={cn(
                      'flex size-10 items-center justify-center rounded-xl',
                      insight.iconBg,
                    )}
                  >
                    <IconComponent
                      className={cn('size-5', insight.iconColor)}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">
                    {insight.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {insight.subtitle}
                  </p>
                </div>

                {/* Action */}
                <Button
                  size="sm"
                  className="h-auto p-0 text-primary hover:text-primary/80"
                  variant="link"
                >
                  {insight.actionText}
                  <ArrowLeft className="mr-1 size-3" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
