/* eslint-disable next/no-img-element */
'use client';

import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import React, { useState } from 'react';

import { useGetBrandList } from '@/services/Brand';

// const brands = [
//   { id: 1, name: 'Brand 1', logo: '/images/categories/fragrance.png' },
//   { id: 2, name: 'Brand 2', logo: '/images/categories/fragrance.png' },
//   { id: 3, name: 'Brand 3', logo: '/images/categories/fragrance.png' },
//   { id: 4, name: 'Brand 4', logo: '/images/categories/fragrance.png' },
//   { id: 5, name: 'Brand 5', logo: '/images/categories/fragrance.png' },
//   { id: 6, name: 'Brand 6', logo: '/images/categories/fragrance.png' },
//   { id: 7, name: 'Brand 7', logo: '/images/categories/fragrance.png' },
//   { id: 8, name: 'Brand 8', logo: '/images/categories/fragrance.png' },
// ];

// Skeleton برای یک برند
const BrandSkeleton: React.FC = () => (
  <div className="flex h-16 w-32 animate-pulse items-center justify-center rounded-md bg-gray-200" />
);

// Skeleton برای کل اسلایدر
const BrandSliderSkeleton: React.FC = () => (
  <section className="mx-auto mt-14 w-11/12 max-w-7xl">
    <div className="mb-4 flex items-center justify-between">
      <div className="h-6 w-40 animate-pulse rounded-sm bg-gray-200" />
    </div>
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex gap-5 overflow-hidden">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div className="shrink-0" key={`brand-skeleton-${idx}`}>
            <BrandSkeleton />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const DEFAULT_LIMIT = 10;
const BrandSlider: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const { data: brands, isPending: brandsPending } = useGetBrandList({
    page,
    limit: DEFAULT_LIMIT,
  });
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    rtl: true,
    slides: { perView: 3, spacing: 20 },
    breakpoints: {
      '(min-width: 640px)': { slides: { perView: 4, spacing: 30 } },
      '(min-width: 1024px)': { slides: { perView: 6, spacing: 40 } },
    },
    created() {
      setLoaded(true);
    },
  });

  if (!loaded) {
    return (
      <>
        <BrandSliderSkeleton />
        {/* اسلایدر مخفی برای initialize */}
        <div aria-hidden="true" className="sr-only">
          <div className="keen-slider" ref={sliderRef}>
            {brands?.data.items.map((brand) => (
              <div className="keen-slider__slide" key={brand.id} />
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <section className="mx-auto mt-14 w-11/12 max-w-7xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">
          💎 محبوب ترین برندها
        </h3>
      </div>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="keen-slider" ref={sliderRef}>
          {brands?.data.items.map((brand, idx) => (
            <div
              className="keen-slider__slide flex items-center justify-center grayscale transition hover:grayscale-0"
              key={brand.id}
            >
              <div className="relative flex h-16 w-32 items-center justify-center rounded-md bg-gray-200">
                <img
                  // fill
                  sizes="128px"
                  alt={brand.name}
                  className="object-cover"
                  src={`${process.env.NEXT_PUBLIC_API_URL_IMAGE}${brand.logo}`}
                  loading={idx < 3 ? 'eager' : 'lazy'}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandSlider;
