'use client';

import Image from 'next/image';
import { useState } from 'react';

import type { ProductImage } from '@/types/product';

import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: ProductImage[] | string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const imageList = images.map((img) =>
    typeof img === 'string' ? { url: img, alt: undefined } : img,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-50">
        <Image
          fill
          alt={imageList[activeIndex].alt || alt}
          className="object-contain p-8"
          src={imageList[activeIndex].url}
          priority
        />
      </div>

      {imageList.length > 1 && (
        <div className="flex gap-3">
          {imageList.map((img, idx) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={cn(
                'relative size-20 overflow-hidden rounded-xl bg-gray-50 transition-all',
                activeIndex === idx
                  ? 'ring-2 ring-gray-900 ring-offset-2'
                  : 'opacity-60 hover:opacity-100',
              )}
            >
              <Image
                fill
                alt={img.alt || ''}
                className="object-contain p-2"
                src={img.url}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
