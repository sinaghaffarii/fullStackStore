'use client';

import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import type { Product } from '@/types/product';

import { UnifiedProductCard } from '@/components/ui/UnifiedProductCard';
import { cn } from '@/lib/utils';

interface RelatedProductsProps {
  products?: Product[];
  className?: string;
}

const defaultProducts: Product[] = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  slug: `product-${i + 1}`,
  name: `سرم موی روغن آرگان شماره ${i + 1}`,
  description: 'سرم تقویتی و ترمیمی مو با روغن آرگان خالص',
  price: 350_000 + i * 25_000,
  originalPrice: 400_000 + i * 25_000,
  discount: i % 2 === 0 ? 15 : 0,
  base_price: 400_000 + i * 25_000,
  image: '/images/products/product_2.jpg',
  images: [
    '/images/products/product_2.jpg',
    '/images/products/product_8_alt1.webp',
  ],
  rating: '4.3',
  reviews: 45,
  isNew: i === 0,
  isBestseller: i === 1,
  brand: 'Nutriga',
  category: 'hair-care',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

export function RelatedProducts({
  products = defaultProducts,
  className,
}: RelatedProductsProps) {
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
          {products.map((product) => (
            <div className="keen-slider__slide" key={product.id}>
              <UnifiedProductCard product={product} />
            </div>
          ))}
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
