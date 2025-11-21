'use client';

import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import React from 'react';
import 'keen-slider/keen-slider.min.css';

import { Button } from '../ui/button';

const heroSlides = [
  {
    id: 1,
    image: '/images/homePage/headerSlider1.jpeg',
    link: '/tags/takhfif50',
    alt: '400کالا40%',
  },
  {
    id: 2,
    image: '/images/homePage/headerSlider2.jpeg',
    link: '/landing/game',
    alt: 'بازی بلک بیوتی',
  },
  {
    id: 3,
    image: '/images/homePage/headerSlider3.jpeg',
    link: '/brands/syn-skin',
    alt: 'ساین اسکین',
  },
];

function AutoplayPlugin(interval = 3000) {
  return (slider: any) => {
    let timeout: any;
    let mouseOver = false;
    const clearNextTimeout = () => clearTimeout(timeout);
    const nextTimeout = () => {
      clearTimeout(timeout);
      if (!mouseOver) timeout = setTimeout(() => slider.next(), interval);
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

const Hero: React.FC = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      rtl: true,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created() {
        setLoaded(true);
      },
      breakpoints: {
        '(max-width: 768px)': { slides: { perView: 1, spacing: 16 } },
        '(min-width: 769px)': { slides: { perView: 1, spacing: 24 } },
      },
    },
    [AutoplayPlugin(3000)],
  );

  return (
    <section className="bg-surface-solid-50 mx-auto w-11/12 py-6 md:w-full">
      <div className="relative mx-auto min-h-[150px] max-w-6xl lg:min-h-[400px]">
        <div className="keen-slider [&>*:last-child]:pl-3" ref={sliderRef}>
          {heroSlides.map((slide) => (
            <a
              className="keen-slider__slide block w-full overflow-hidden rounded-lg"
              href={slide.link}
              key={slide.id}
            >
              <Image
                height={400}
                width={1200}
                alt={slide.alt}
                className="size-full object-cover"
                src={slide.image}
              />
            </a>
          ))}
        </div>

        {loaded && instanceRef.current && (
          <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 gap-2 md:bottom-4">
            {Array.from({
              length: instanceRef.current.track.details.slides.length,
            }).map((_, idx) => (
              <Button
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

export default Hero;
