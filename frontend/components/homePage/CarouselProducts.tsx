'use client';

import React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: string;
  brand: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  href: string;
}

interface SpecialOffer {
  title: string;
  subtitle?: string;
  href: string;
  timer?: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  headerImage?: string;
  mainImage?: string;
  backgroundColor?: string;
  textColor?: string;
}

interface CarouselProductsProps {
  products: Product[];
  specialOffer?: SpecialOffer;
  viewAllLink?: string;
  title?: string;
  description?: string;
  showDots?: boolean;
  showArrows?: boolean;
  autoPlay?: boolean;
}

const defaultSpecialOffer: SpecialOffer = {
  title: 'بزرگ‌ترین حراج روزانه',
  href: '/tags/special-offers',
  timer: {
    hours: 14,
    minutes: 46,
    seconds: 11,
  },
  headerImage:
    'https://assets.khanoumi.com/4.140.2.0/_toad/images/pink-box/pink-box-header.webp',
  mainImage:
    'https://assets.khanoumi.com/4.140.2.0/_toad/images/pink-box/pink-box-image.webp',
  backgroundColor: 'from-pink-500 to-purple-600',
  textColor: 'text-white',
};

const CarouselProducts: React.FC<CarouselProductsProps> = ({
  products = [],
  specialOffer,
  viewAllLink = '/products',
  title = 'محصولات پرفروش',
  description = 'محبوب‌ترین محصولات با بهترین قیمت',
  showDots = true,
  showArrows = true,
  autoPlay = false,
}) => {
  const [loaded, setLoaded] = React.useState(false);

  const mergedSpecialOffer = { ...defaultSpecialOffer, ...specialOffer };

  const AutoplayPlugin = (interval = 3000) => {
    return (slider: any) => {
      let timeout: any;
      let mouseOver = false;

      const clearNextTimeout = () => clearTimeout(timeout);
      const nextTimeout = () => {
        clearTimeout(timeout);
        if (!mouseOver && autoPlay) {
          timeout = setTimeout(() => slider.next(), interval);
        }
      };

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
    };
  };

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: false,
      rtl: true,
      slides: {
        perView: 2.2,
        spacing: 16,
      },
      breakpoints: {
        '(min-width: 640px)': {
          slides: {
            perView: 3.2,
            spacing: 14,
          },
        },
        '(min-width: 768px)': {
          slides: {
            perView: 4.2,
            spacing: 14,
          },
        },
        '(min-width: 1024px)': {
          slides: {
            perView: 5.2,
            spacing: 14,
          },
        },
        '(min-width: 1280px)': {
          slides: {
            perView: 6.2,
            spacing: 14,
          },
        },
      },
      created() {
        setLoaded(true);
      },
    },
    autoPlay ? [AutoplayPlugin(3000)] : [],
  );

  const Timer = ({
    hours,
    minutes,
    seconds,
  }: {
    hours: number;
    minutes: number;
    seconds: number;
  }) => (
    <div className="flex items-center justify-center gap-1">
      <span className="bg-white text-red-600 rounded px-2 py-1 text-sm font-bold min-w-8">
        {hours.toString().padStart(2, '0')}
      </span>
      <span className={mergedSpecialOffer.textColor}>:</span>
      <span className="bg-white text-red-600 rounded px-2 py-1 text-sm font-bold min-w-8">
        {minutes.toString().padStart(2, '0')}
      </span>
      <span className={mergedSpecialOffer.textColor}>:</span>
      <span className="bg-white text-red-600 rounded px-2 py-1 text-sm font-bold min-w-8">
        {seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );

  return (
    <section className="py-8 bg-primary-light">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
          {description && <p className="text-gray-600">{description}</p>}
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div ref={sliderRef} className="keen-slider">
            {specialOffer && (
              <div className="keen-slider__slide">
                <a
                  href={mergedSpecialOffer.href}
                  className={`flex flex-col items-center justify-center min-h-[280px] bg-linear-to-br ${mergedSpecialOffer.backgroundColor} ${mergedSpecialOffer.textColor} rounded-lg p-4 hover:shadow-lg transition-shadow`}
                >
                  <div className="text-center space-y-3">
                    {/* Header Icon */}
                    {mergedSpecialOffer.headerImage && (
                      <div
                        className="w-20 h-8 mx-auto bg-contain bg-center bg-no-repeat"
                        style={{
                          backgroundImage: `url(${mergedSpecialOffer.headerImage})`,
                        }}
                      />
                    )}

                    {/* Main Icon */}
                    {mergedSpecialOffer.mainImage && (
                      <div
                        className="w-16 h-16 mx-auto bg-contain bg-center bg-no-repeat animate-pulse"
                        style={{
                          backgroundImage: `url(${mergedSpecialOffer.mainImage})`,
                        }}
                      />
                    )}

                    <span className="block text-sm font-bold">
                      {mergedSpecialOffer.title}
                    </span>

                    {mergedSpecialOffer.subtitle && (
                      <span className="block text-xs opacity-90">
                        {mergedSpecialOffer.subtitle}
                      </span>
                    )}

                    {/* Timer */}
                    {mergedSpecialOffer.timer && (
                      <Timer {...mergedSpecialOffer.timer} />
                    )}
                  </div>
                </a>
              </div>
            )}

            {/* Product Cards */}
            {products.map((product) => (
              <div key={product.id} className="keen-slider__slide">
                <ProductCard {...product} />
              </div>
            ))}

            {/* View All Card */}
            <div className="keen-slider__slide">
              <a
                href={viewAllLink}
                className="flex flex-col items-center justify-center min-h-[280px] border-2 border-dashed border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors p-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-blue-600 mb-3"
                >
                  <path
                    fill="currentColor"
                    d="M11.97 22.75C6.05 22.75 1.22 17.93 1.22 12S6.05 1.25 11.97 1.25 22.72 6.07 22.72 12 17.9 22.75 11.97 22.75m0-20c-5.1 0-9.25 4.15-9.25 9.25s4.15 9.25 9.25 9.25 9.25-4.15 9.25-9.25-4.15-9.25-9.25-9.25"
                  />
                  <path
                    fill="currentColor"
                    d="M13.278 16.558c-.19 0-.38-.07-.53-.22l-3.53-3.53a.754.754 0 0 1 0-1.06l3.53-3.53c.29-.29.77-.29 1.06 0s.29.77 0 1.06l-3 3 3 3c.29.29.29.77 0 1.06a.7.7 0 0 1-.53.22"
                  />
                </svg>
                <span className="text-blue-600 font-semibold text-center">
                  مشاهده همه محصولات
                </span>
              </a>
            </div>
          </div>

          {/* Navigation Arrows */}
          {loaded && instanceRef.current && showArrows && (
            <>
              <button
                onClick={() => instanceRef.current?.prev()}
                className="absolute top-1/2 -right-3 z-10 -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors hidden md:flex"
                aria-label="محصول قبلی"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    fill="currentColor"
                    d="M13.26 16.28c-.19 0-.38-.07-.53-.22L9.2 12.53a.754.754 0 0 1 0-1.06l3.53-3.53c.29-.29.77-.29 1.06 0s.29.77 0 1.06l-3 3 3 3c.29.29.29.77 0 1.06a.7.7 0 0 1-.53.22"
                  />
                </svg>
              </button>

              <button
                onClick={() => instanceRef.current?.next()}
                className="absolute top-1/2 -left-3 z-10 -translate-y-1/2 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors hidden md:flex"
                aria-label="محصول بعدی"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    fill="currentColor"
                    d="M10.74 16.28c-.19 0-.38-.07-.53-.22a.754.754 0 0 1 0-1.06l3-3-3-3a.754.754 0 0 1 0-1.06c.29-.29.77-.29 1.06 0l3.53 3.53c.29.29.29.77 0 1.06l-3.53 3.53c-.15.15-.34.22-.53.22"
                  />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default CarouselProducts;
