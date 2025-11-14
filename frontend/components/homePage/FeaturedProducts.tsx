'use client';

import React, { useState, useMemo } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import 'keen-slider/keen-slider.min.css';

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
    <section className="py-12 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-2xl font-bold mb-6 text-text-darkGray">
          پیشنهاد ویژه
        </h2>
        <div ref={sliderRef} className="keen-slider [&>*:last-child]:pr-3">
          {products.map((prod) => (
            <a
              key={prod.id}
              href={prod.link}
              className="keen-slider__slide block overflow-hidden rounded-lg shadow-md border hover:shadow-md transition-shadow duration-200 bg-surface-solid-50"
            >
              <div className="w-full h-48 sm:h-56 lg:h-64 overflow-hidden">
                <Image
                  src={prod.image}
                  alt={prod.name}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-base font-medium text-text-darkGray text-center">
                  {prod.name}
                </p>
              </div>
            </a>
          ))}
        </div>

        {loaded && instanceRef.current && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({
              length: instanceRef.current.track.details.slides.length,
            }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`rounded-full transition-all ${
                  currentSlide === idx
                    ? 'w-4 h-2 bg-primary'
                    : 'w-2 h-2 bg-secondary'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
