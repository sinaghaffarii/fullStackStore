'use client';
import Image from 'next/image';
import React from 'react';

import { cn } from '@/lib/utils';

interface Props {
  count: 2 | 4;
  heightClass?: string;
}

const PromoBanners: React.FC<Props> = ({ count, heightClass = 'h-48' }) => {
  const banners = Array.from({ length: count }).map((_, i) => ({ id: i }));

  return (
    <section className="mx-auto mt-10 w-11/12 max-w-7xl">
      <div
        className={cn(
          'grid gap-4',
          count === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : 'grid-cols-2 md:grid-cols-4',
        )}
      >
        {banners.map((banner) => (
          // eslint-disable-next-line jsx-a11y/anchor-is-valid
          <a
            className="relative block overflow-hidden rounded-lg shadow-sm transition hover:shadow-lg"
            href="#"
            key={banner.id}
          >
            <div className={cn('relative w-full bg-gray-300', heightClass)}>
              <div className="absolute inset-0 flex items-center justify-center font-bold text-gray-500">
                Banner {banner.id + 1}
              </div>

              <Image
                fill
                alt="Banner"
                className="object-cover opacity-0"
                src="/images/homePage/baner1.jpg"
              />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default PromoBanners;
