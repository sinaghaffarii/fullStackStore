'use client';

import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/src/lib/utils';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
        <Image
          fill
          alt={alt}
          className="object-contain p-8"
          src={images[activeIndex]}
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((src, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={cn(
                'relative size-20 overflow-hidden rounded-xl bg-gray-50 transition-all',
                activeIndex === idx
                  ? 'ring-2 ring-gray-900 ring-offset-2'
                  : 'opacity-60 hover:opacity-100',
              )}
            >
              <Image fill alt="" className="object-contain p-2" src={src} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
