'use client';

import React, { useState, useMemo } from 'react';
import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import 'keen-slider/keen-slider.min.css';

function AutoplayPlugin(interval = 3000) {
  return (slider: any) => {
    let timeout: any;
    let mouseOver = false;

    const clearNextTimeout = () => clearTimeout(timeout);

    const nextTimeout = () => {
      clearTimeout(timeout);
      if (!mouseOver) {
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
}

const carouselItems = [
  {
    id: '1',
    image: '/images/homePage/headerSlider1.jpeg',
    link: '/tags/takhfif50',
    alt: '400کالا40%',
  },
  {
    id: '2',
    image: '/images/homePage/headerSlider2.jpeg',
    link: '/landing/game',
    alt: 'بازی بلک بیوتی',
  },
  {
    id: '3',
    image: '/images/homePage/headerSlider3.jpeg',
    link: '/brands/syn-skin',
    alt: 'ساین اسکین',
  },
  {
    id: '4',
    image: '/images/homePage/headerSlider4.jpeg',
    link: '/categories/scented-products',
    alt: 'عطر',
  },
  {
    id: '5',
    image: '/images/homePage/headerSlider5.jpeg',
    link: '/brands/jute',
    alt: 'ژوت',
  },
  {
    id: '6',
    image: '/images/homePage/headerSlider6.jpeg',
    link: '/brands/ardene',
    alt: 'آردن',
  },
];

const Carousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const sliderOptions = useMemo(
    () => ({
      loop: true,
      rtl: true,
      initial: 0,
      slideChanged(slider: any) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
      breakpoints: {
        '(max-width: 768px)': { slides: { perView: 1, spacing: 16 } },
        '(min-width: 769px)': { slides: { perView: 1, spacing: 24 } },
      },
    }),
    [],
  );

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    sliderOptions,
    [AutoplayPlugin(3000)],
  );

  return (
    <div className="flex w-full flex-col gap-6 pb-10 pt-4 lg:gap-8 lg:pb-12 lg:pt-10">
      <div className="homepage-container group relative min-h-[200px] lg:min-h-[330px]">
        {/* Slider */}
        <div ref={sliderRef} className="keen-slider">
          {carouselItems.map((item) => (
            <a
              key={item.id}
              href={item.link}
              className="keen-slider__slide overflow-hidden rounded-xl"
            >
              <Image
                src={item.image}
                alt={item.alt}
                width={1200}
                height={500}
                quality={90}
                loading="lazy"
                className="w-full object-contain"
              />
            </a>
          ))}
        </div>

        {loaded && instanceRef.current && (
          <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 gap-1 pb-2 lg:pb-4">
            {Array.from({
              length: instanceRef.current.track.details.slides.length,
            }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`cursor-pointer rounded-full transition-all ${
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
    </div>
  );
};

export default Carousel;
