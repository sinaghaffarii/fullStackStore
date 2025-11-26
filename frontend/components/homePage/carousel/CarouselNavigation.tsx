'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/src/lib/utils';

interface Props {
  onPrev: () => void;
  onNext: () => void;
  visible: boolean;
}

const NavButton = ({
  onClick,
  label,
  icon: Icon,
  className,
}: {
  onClick: () => void;
  label: string;
  icon: any;
  className?: string;
}) => (
  <Button
    size="icon"
    aria-label={label}
    type="button"
    variant="outline"
    onClick={onClick}
    className={cn(
      'absolute top-1/2 z-20 hidden size-12 -translate-y-1/2 rounded-full border-0 bg-white/80 text-gray-800 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white disabled:opacity-50 md:flex',
      className,
    )}
  >
    <Icon className="size-6" />
  </Button>
);

const CarouselNavigation: React.FC<Props> = ({ onPrev, onNext, visible }) => {
  if (!visible) return null;

  return (
    <>
      <NavButton
        className="-right-5 opacity-0 group-hover/carousel:right-0 group-hover/carousel:opacity-100"
        label="محصول بعدی"
        icon={ChevronRight} // با توجه به RTL بودن، آیکون‌ها برعکس عمل می‌کنند یا باید جایشان عوض شود. در KeenSlider RTL، next یعنی سمت چپ.
        onClick={onNext}
      />

      <NavButton
        className="-left-5 opacity-0 group-hover/carousel:left-0 group-hover/carousel:opacity-100"
        label="محصول قبلی"
        icon={ChevronLeft}
        onClick={onPrev}
      />
    </>
  );
};

export default CarouselNavigation;
