'use client';

import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import type { Product } from '@/types/product';

import CarouselProducts from './carousel/CarouselProducts';

interface Props {
  products: Product[];
  isLoading?: boolean;
}

// Skeleton برای بنر
const BannerSkeleton: React.FC = () => (
  <div className="relative h-[170px] w-full animate-pulse overflow-hidden rounded-lg bg-gray-700 md:h-[250px] lg:h-[390px]" />
);

const FlashProductSkeleton: React.FC = () => (
  <div className="flex size-full animate-pulse flex-col rounded-lg border border-gray-100 bg-white p-3">
    <div className="aspect-square w-full rounded-md bg-gray-200" />
    <div className="mt-3 h-4 w-3/4 rounded-sm bg-gray-200" />
    <div className="mt-2 h-3 w-1/2 rounded-sm bg-gray-200" />
    <div className="mt-auto flex items-center justify-between pt-3">
      <div className="h-5 w-20 rounded-sm bg-gray-200" />
      <div className="h-6 w-12 rounded-sm bg-gray-200" />
    </div>
  </div>
);

// Skeleton کامل FlashSale
const FlashSaleSkeleton: React.FC = () => (
  <section className="mx-auto mt-10 w-11/12 max-w-7xl rounded-lg bg-[#570018] px-4 py-6 md:px-6 md:py-8">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
      <div className="relative w-full shrink-0 lg:w-[280px]">
        <BannerSkeleton />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex gap-3.5 overflow-hidden py-0">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              className="w-1/2 shrink-0 md:w-2/5 lg:w-1/3"
              key={`flash-skeleton-${idx}`}
            >
              <FlashProductSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="mt-4 flex w-full justify-end border-t border-white/10 pt-3">
      <div className="h-5 w-24 animate-pulse rounded-sm bg-gray-600" />
    </div>
  </section>
);

const FlashSale: React.FC<Props> = ({ products, isLoading = false }) => {
  if (isLoading || products.length === 0) {
    return <FlashSaleSkeleton />;
  }

  return (
    <section className="mx-auto mt-10 w-11/12 max-w-7xl rounded-lg bg-[#570018] p-4 md:py-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
        {/* بنر */}
        <div className="relative w-full shrink-0 lg:w-[280px]">
          <div className="relative size-full overflow-hidden rounded-lg">
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-8 text-center">
              <span className="text-4xl leading-tight font-black text-white/90 drop-shadow-lg">
                UP TO <br /> 90% <br /> OFF
              </span>

              <span className="mt-4 text-lg font-bold text-white drop-shadow-md">
                یه ویترین پر از تخفیف
              </span>

              <div className="mt-auto mb-8 flex items-center justify-center gap-2">
                <span className="rounded-sm bg-white/20 px-2 py-1 text-xs text-white">
                  05 : 12 : 40
                </span>
              </div>
            </div>

            <Image
              fill
              sizes="(max-width: 1024px) 100vw, 280px"
              alt="Flash Sale Banner"
              className="object-cover opacity-70 mix-blend-overlay"
              src="/images/homePage/discount.jpg"
              priority
            />
          </div>
        </div>
        {/* کاروسل محصولات */}
        <div className="min-w-0 flex-1">
          <CarouselProducts
            className="w-full py-0!"
            breakpoints={{
              '(min-width: 640px)': { slides: { perView: 2, spacing: 10 } },
              '(min-width: 768px)': { slides: { perView: 2.5, spacing: 14 } },
              '(min-width: 1024px)': { slides: { perView: 3, spacing: 14 } },
              '(min-width: 1280px)': { slides: { perView: 4, spacing: 14 } },
            }}
            products={products}
            showArrows
          />
        </div>
      </div>

      <div className="mt-4 flex w-full justify-end border-t border-white/10 pt-3">
        <Link
          className="group flex items-center gap-1 text-sm font-medium text-white transition-opacity hover:opacity-80"
          href="/flash-sale"
        >
          مشاهده همه
          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        </Link>
      </div>
    </section>
  );
};

export default FlashSale;
