'use client';

import { Expand, Heart, Share2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { cn } from '@/src/lib/utils';

interface Props {
  images: string[];
  title: string;
}

export function ProductGallery({ images, title }: Props) {
  const [selected, setSelected] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-3">
          {[
            { icon: Heart, label: 'ذخیره' },
            { icon: Share2, label: 'اشتراک' },
            {
              icon: Expand,
              label: 'بزرگ‌نمایی',
              action: () => setIsZoomed(true),
            },
          ].map(({ icon: Icon, label, action }, idx) => (
            <button
              aria-label={label}
              className="rounded-full bg-white/85 p-3 text-gray-700 shadow-lg backdrop-blur-md transition hover:bg-white hover:text-black"
              key={idx}
              type="button"
              onClick={action}
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>

        <figure className="group relative aspect-square overflow-hidden rounded-lg border border-gray-100 bg-linear-to-br from-gray-50 to-white">
          <Image
            fill
            alt={title}
            src={images[selected]}
            onLoadingComplete={() => setIsZoomed(false)}
            priority
            className={cn(
              'object-contain p-6 transition duration-500 group-hover:scale-105',
              isZoomed && 'scale-110',
            )}
          />
          <span className="absolute right-4 bottom-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-gray-600 shadow-sm">
            HD 4K
          </span>
        </figure>
      </div>

      <div className="scrollbar-hide flex gap-3 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <button
            aria-label={`مشاهده تصویر ${idx + 1}`}
            key={idx}
            type="button"
            onClick={() => setSelected(idx)}
            className={cn(
              'relative size-20 shrink-0 overflow-hidden rounded-lg border transition-all',
              selected === idx
                ? 'border-gray-900 ring-2 ring-gray-900/10'
                : 'border-transparent opacity-70 hover:opacity-100',
            )}
          >
            <Image fill alt="" className="object-cover" src={img} />
          </button>
        ))}
      </div>
    </div>
  );
}
