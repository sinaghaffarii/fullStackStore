'use client';

import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import React, { useMemo, useState } from 'react';
import 'keen-slider/keen-slider.min.css';

import { Button } from '../ui/button';

interface Product {
  id: number;
  name: string;
  image: string;
  link: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'برایت مکس',
    image: '/images/homePage/headerSlider1.jpeg',
    link: '/brands/bright-max',
  },
  {
    id: 2,
    name: 'سیسپرسا',
    image: '/images/homePage/headerSlider2.jpeg',
    link: '/brands/cyspersa',
  },
  {
    id: 3,
    name: 'لافارر',
    image: '/images/homePage/headerSlider3.jpeg',
    link: '/brands/lafarrerr',
  },
  {
    id: 4,
    name: 'سشوار حرفه‌ای',
    image: '/images/homePage/headerSlider5.jpeg',
    link: '/categories/electrical-personal-care/electrical-hair-styling-tools/hair-drayer',
  },
  // میتوانی تعداد بیشتری اضافه کنی
];

function Autoplay(interval = 3000) {
  return (slider: any) => {
    let timeout: any;
    let mouseOver = false;
    const clear = () => clearTimeout(timeout);
    const next = () => {
      clear();
      if (!mouseOver) timeout = setTimeout(() => slider.next(), interval);
    };
    slider.on('created', () => {
      slider.container.addEventListener('mouseover', () => {
        mouseOver = true;
        clear();
      });
      slider.container.addEventListener('mouseout', () => {
        mouseOver = false;
        next();
      });
      next();
    });
    slider.on('dragStarted', clear);
    slider.on('animationEnded', next);
    slider.on('updated', next);
  };
}

const FeaturedProducts: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const sliderOptions = useMemo(
    () => ({
      loop: true,
      rtl: true,
      slideChanged(slider: any) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
      slides: {
        perView: 2,
        spacing: 16,
      },
      breakpoints: {
        '(min-width: 768px)': {
          slides: { perView: 3, spacing: 24 },
        },
        '(min-width: 1024px)': {
          slides: { perView: 4, spacing: 32 },
        },
      },
    }),
    [],
  );

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    sliderOptions,
    [Autoplay(3000)],
  );

  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-text-darkGray mb-6 text-2xl font-bold">
          پیشنهاد ویژه
        </h2>
        <div className="keen-slider [&>*:last-child]:pr-3" ref={sliderRef}>
          {products.map((prod) => (
            <a
              className="keen-slider__slide bg-surface-solid-50 block overflow-hidden rounded-lg border shadow-md transition-shadow duration-200 hover:shadow-md"
              href={prod.link}
              key={prod.id}
            >
              <div className="h-48 w-full overflow-hidden sm:h-56 lg:h-64">
                <Image
                  height={400}
                  width={400}
                  alt={prod.name}
                  className="size-full object-cover"
                  src={prod.image}
                />
              </div>
              <div className="p-4">
                <p className="text-text-darkGray text-center text-base font-medium">
                  {prod.name}
                </p>
              </div>
            </a>
          ))}
        </div>

        {loaded && instanceRef.current && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({
              length: instanceRef.current.track.details.slides.length,
            }).map((_, idx) => (
              <Button
                aria-label={`Go to slide ${idx + 1}`}
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`rounded-full transition-all ${
                  currentSlide === idx
                    ? 'h-2 w-4 bg-primary'
                    : 'size-2 bg-secondary'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
