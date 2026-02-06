'use client';

import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import type { Product } from '@/types/product';

import { ProductCard } from '@/components/ui/ProductCard';
import { cn } from '@/lib/utils';

interface RelatedProductsProps {
  products?: Product[];
  className?: string;
}

export function RelatedProducts({ products, className }: RelatedProductsProps) {
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    rtl: true,
    loop: true,
    slides: { perView: 2, spacing: 8 },
    breakpoints: {
      '(min-width: 640px)': { slides: { perView: 2, spacing: 10 } },
      '(min-width: 768px)': { slides: { perView: 3, spacing: 10 } },
      '(min-width: 1024px)': { slides: { perView: 4, spacing: 10 } },
      '(min-width: 1280px)': { slides: { perView: 5, spacing: 10 } },
    },
    created() {
      setLoaded(true);
    },
  });

  return (
    <section className={cn('', className)}>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">محصولات مشابه</h2>
        <Link
          className="text-sm text-gray-500 hover:text-gray-900"
          href="/products"
        >
          مشاهده همه
        </Link>
      </div>

      <div className="relative">
        <div className="keen-slider" ref={sliderRef}>
          {products && products.length > 0 ? (
            products.map((product) => (
              <div className="keen-slider__slide" key={product.id}>
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <p>محصولی برای نمایش یافت نشد.</p>
          )}
        </div>

        {loaded && (
          <>
            <SliderButton
              direction="prev"
              onClick={() => instanceRef.current?.prev()}
            />
            <SliderButton
              direction="next"
              onClick={() => instanceRef.current?.next()}
            />
          </>
        )}
      </div>
    </section>
  );
}

function SliderButton({
  direction,
  onClick,
}: {
  direction: 'next' | 'prev';
  onClick: () => void;
}) {
  const Icon = direction === 'prev' ? ChevronRight : ChevronLeft;

  return (
    <button
      aria-label={direction === 'prev' ? 'اسلاید قبلی' : 'اسلاید بعدی'}
      type="button"
      onClick={onClick}
      className={cn(
        'absolute top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-shadow hover:shadow-lg lg:flex',
        direction === 'prev' ? '-right-4' : '-left-4',
      )}
    >
      <Icon className="size-5 text-gray-600" />
    </button>
  );
}
