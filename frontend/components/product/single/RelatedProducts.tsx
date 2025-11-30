'use client';

import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import ProductCard from '@/components/homePage/ProductCard';
import { cn } from '@/src/lib/utils';

import { relatedProducts, sliderConfig } from './relatedProductsConfig';

export function RelatedProducts() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    ...sliderConfig,
    created(slider) {
      setLoaded(true);
      setCurrentSlide(slider.track.details.rel);
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  return (
    <section className="relative">
      <div className="mb-8 flex items-center justify-between">
        <h3 className="text-2xl font-black text-gray-900">محصولات مشابه</h3>
        <Link
          className="text-sm text-blue-500 hover:underline"
          href="/products"
        >
          مشاهده همه
        </Link>
      </div>

      <div className="relative">
        <div className="group/carousel relative">
          <div className="keen-slider" ref={sliderRef}>
            {relatedProducts.map((product) => (
              <div
                className="keen-slider__slide flex h-auto items-stretch"
                key={product.id}
              >
                <ProductCard {...product} />
              </div>
            ))}
          </div>
        </div>

        {loaded && (
          <>
            <button
              aria-label="اسلاید قبلی"
              type="button"
              onClick={() => instanceRef.current?.prev()}
              className={cn(
                'absolute top-1/2 -left-4 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-800 shadow-md hover:bg-gray-50 lg:flex',
              )}
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              aria-label="اسلاید بعدی"
              type="button"
              onClick={() => instanceRef.current?.next()}
              className={cn(
                'absolute top-1/2 -right-4 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-100 bg-white text-gray-800 shadow-md hover:bg-gray-50 lg:flex',
              )}
            >
              <ChevronRight className="size-4" />
            </button>
          </>
        )}
        {loaded && (
          <div className="mt-4 text-center text-xs text-gray-500">
            {currentSlide + 1} / {relatedProducts.length}
          </div>
        )}
      </div>
    </section>
  );
}
