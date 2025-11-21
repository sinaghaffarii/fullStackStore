'use client';

import { useKeenSlider } from 'keen-slider/react';
import React from 'react';
import 'keen-slider/keen-slider.min.css';

import type { SpecialOffer } from './SpecialOfferSlide';

import ProductCard from '../ProductCard';
import CarouselNavigation from './CarouselNavigation';
import SpecialOfferSlide from './SpecialOfferSlide';
import ViewAllSlide from './ViewAllSlide';

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

interface Props {
  products: Product[];
  specialOffer?: SpecialOffer;
  viewAllLink?: string;
  title?: string;
  description?: string;
  showArrows?: boolean;
  autoPlay?: boolean;
}

const defaultOffer: SpecialOffer = {
  title: 'بزرگ‌ترین حراج روزانه',
  href: '/tags/special-offers',
  timer: { hours: 14, minutes: 46, seconds: 11 },
  headerImage:
    'https://assets.khanoumi.com/4.140.2.0/_toad/images/pink-box/pink-box-header.webp',
  mainImage:
    'https://assets.khanoumi.com/4.140.2.0/_toad/images/pink-box/pink-box-image.webp',
  backgroundColor: 'from-pink-500 to-purple-600',
  textColor: 'text-white',
};

const CarouselProducts: React.FC<Props> = ({
  products,
  specialOffer,
  viewAllLink = '/products',
  title = 'محصولات پرفروش',
  description = 'محبوب‌ترین محصولات با بهترین قیمت',
  showArrows = true,
  autoPlay = false,
}) => {
  const [loaded, setLoaded] = React.useState(false);
  const mergedOffer = specialOffer || defaultOffer;

  const autoplayPlugin = React.useCallback(
    (interval = 3000) =>
      (slider: any) => {
        let timeout: any;
        let hovered = false;

        const clear = () => clearTimeout(timeout);
        const next = () => {
          clear();
          if (!hovered && autoPlay)
            timeout = setTimeout(() => slider.next(), interval);
        };

        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            hovered = true;
            clear();
          });
          slider.container.addEventListener('mouseout', () => {
            hovered = false;
            next();
          });
          next();
        });

        slider.on('dragStarted', clear);
        slider.on('animationEnded', next);
        slider.on('updated', next);
      },
    [autoPlay],
  );

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: false,
      rtl: true,
      slides: { perView: 2.2, spacing: 16 },
      breakpoints: {
        '(min-width: 640px)': { slides: { perView: 3.2, spacing: 14 } },
        '(min-width: 768px)': { slides: { perView: 4.2, spacing: 14 } },
        '(min-width: 1024px)': { slides: { perView: 5.2, spacing: 14 } },
        '(min-width: 1280px)': { slides: { perView: 6.2, spacing: 14 } },
      },
      created() {
        setLoaded(true);
      },
    },
    autoPlay ? [autoplayPlugin(3000)] : [],
  );

  return (
    <section className="bg-primary-light py-8">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600">{description}</p>
        </div>

        <div className="relative">
          <div className="keen-slider" ref={sliderRef}>
            <SpecialOfferSlide offer={mergedOffer} />

            {products.map((p) => (
              <div className="keen-slider__slide" key={p.id}>
                <ProductCard {...p} />
              </div>
            ))}

            <ViewAllSlide href={viewAllLink} />
          </div>

          <CarouselNavigation
            visible={loaded && showArrows}
            onNext={() => instanceRef.current?.next()}
            onPrev={() => instanceRef.current?.prev()}
          />
        </div>
      </div>
    </section>
  );
};

export default CarouselProducts;
