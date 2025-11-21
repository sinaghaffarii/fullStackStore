'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

interface Props {
  onPrev: () => void;
  onNext: () => void;
  visible: boolean;
}

const CarouselNavigation: React.FC<Props> = ({ onPrev, onNext, visible }) => {
  if (!visible) return null;

  return (
    <>
      <Button
        aria-label="محصول قبلی"
        className="absolute top-1/2 -right-3 z-10 hidden size-10 -translate-y-1/2 rounded-full border border-gray-300 bg-white text-gray-600 shadow-lg transition-colors hover:bg-gray-50 md:flex"
        onClick={onPrev}
      >
        <ChevronRight />
      </Button>

      <Button
        aria-label="محصول بعدی"
        className="absolute top-1/2 -left-3 z-10 hidden size-10 -translate-y-1/2 rounded-full border border-gray-300 bg-white text-gray-600 shadow-lg transition-colors hover:bg-gray-50 md:flex"
        onClick={onNext}
      >
        <ChevronLeft />
      </Button>
    </>
  );
};

export default CarouselNavigation;
