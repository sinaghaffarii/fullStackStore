/* eslint-disable max-lines-per-function */
/* eslint-disable max-lines */
'use client';

import type { KeenSliderOptions } from 'keen-slider/react';

import { useKeenSlider } from 'keen-slider/react';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

import type { CreateProductDto } from '@/types/product';

import { ProductCard } from '@/components/ui/ProductCard';
import { cn } from '@/lib/utils';

import CarouselNavigation from './CarouselNavigation';

interface Props {
  products: CreateProductDto[];
  title?: string;
  description?: string;
  showArrows?: boolean;
  autoPlay?: boolean;
  viewAllLink?: string;
  className?: string;
  titleClassName?: string;
  breakpoints?: KeenSliderOptions['breakpoints'];
}

const defaultBreakpoints = {
  '(min-width: 640px)': { slides: { perView: 2, spacing: 10 } },
  '(min-width: 768px)': { slides: { perView: 3, spacing: 10 } },
  '(min-width: 1024px)': { slides: { perView: 4, spacing: 10 } },
  '(min-width: 1280px)': { slides: { perView: 5, spacing: 10 } },
};

const ProductCardSkeleton: React.FC<{ id: string }> = ({ id }) => (
  <div
    className="flex size-full animate-pulse flex-col rounded-lg border border-gray-100 bg-white p-3"
    key={id}
  >
    <div className="aspect-square w-full rounded-md bg-gray-200" />
    <div className="mt-3 h-4 w-3/4 rounded-sm bg-gray-200" />
    <div className="mt-2 h-3 w-1/2 rounded-sm bg-gray-200" />
    <div className="mt-auto flex items-center justify-between pt-3">
      <div className="h-5 w-20 rounded-sm bg-gray-200" />
      <div className="h-6 w-12 rounded-sm bg-gray-200" />
    </div>
  </div>
);

const CarouselSkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => (
  <div className="flex gap-2.5 overflow-hidden">
    {Array.from({ length: count }).map((_, idx) => (
      <div
        className="w-1/2 shrink-0 sm:w-1/3 md:w-1/4 lg:w-1/5"
        key={`carousel-skeleton-${idx}`}
      >
        <ProductCardSkeleton id={`skeleton-card-${idx}`} />
      </div>
    ))}
  </div>
);

const CarouselProducts: React.FC<Props> = ({
  products,
  title,
  description,
  showArrows = true,
  autoPlay = true,
  viewAllLink,
  className,
  titleClassName,
  breakpoints = defaultBreakpoints,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const dotCount = products.length;

  const handleAddToCart = async (_id: string) => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  };

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      rtl: true,
      slides: { perView: 2, spacing: 10 },
      breakpoints,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
    },
    [
      (slider) => {
        if (!autoPlay) return;
        let timeout: ReturnType<typeof setTimeout>;
        let mouseOver = false;

        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => slider.next(), 3000);
        }

        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on('dragStarted', clearNextTimeout);
        slider.on('animationEnded', nextTimeout);
        slider.on('updated', nextTimeout);
      },
    ],
  );

  return (
    <section
      className={cn(
        'mx-auto w-11/12 max-w-7xl py-10 md:w-full md:py-14',
        className,
      )}
    >
      <div>
        {(title || viewAllLink) && (
          <div className="mb-6 flex flex-col gap-2 md:mb-8 lg:flex-row lg:items-center lg:justify-between">
            <div className={cn('flex flex-col gap-2', titleClassName)}>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl lg:text-4xl">
                {title}
              </h2>
              {title && <div className="mt-1 h-0.5 w-12 bg-red-500" />}
              {description && (
                <p className="mt-2 max-w-2xl text-gray-500">{description}</p>
              )}
            </div>

            {viewAllLink && (
              <div className="mt-auto flex items-center gap-3">
                <Link
                  className="group flex items-center justify-center text-sm font-semibold text-primary transition-all hover:text-primary/80"
                  href={viewAllLink}
                >
                  مشاهده همه
                  <ChevronLeft className="mr-1 size-5 transition-transform duration-300 group-hover:-translate-x-1" />
                </Link>
              </div>
            )}
          </div>
        )}

        {!loaded && (
          <>
            <CarouselSkeleton count={5} />
            <div aria-hidden="true" className="sr-only">
              <div className="keen-slider" ref={sliderRef}>
                {products.map((product) => (
                  <div className="keen-slider__slide" key={product.id} />
                ))}
              </div>
            </div>
          </>
        )}

        {loaded && (
          <div className="group/carousel relative">
            <div className="keen-slider" ref={sliderRef}>
              {products.map((product, index) => (
                <div
                  className="keen-slider__slide flex h-auto items-stretch"
                  key={product.id}
                >
                  <ProductCard
                    mode="carousel"
                    onAddToCart={handleAddToCart}
                    onLike={() => {
                      //like
                    }}
                    onQuickView={() => {
                      // view
                    }}
                    priority={index < 2}
                    product={product}
                  />
                </div>
              ))}
            </div>

            <CarouselNavigation
              visible={showArrows}
              onNext={() => instanceRef.current?.next()}
              onPrev={() => instanceRef.current?.prev()}
            />
          </div>
        )}

        {loaded && dotCount > 0 && (
          <div className="mt-6 flex justify-center gap-2">
            {products.map((product, idx) => (
              <button
                aria-label={`Go to slide ${idx + 1}`}
                key={`dot-${product.id}`}
                type="button"
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  currentSlide === idx
                    ? 'w-6 bg-primary'
                    : 'w-1.5 bg-gray-300 hover:bg-gray-400',
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CarouselProducts;
