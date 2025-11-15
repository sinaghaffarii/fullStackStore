'use client';

import React from 'react';
import Image from 'next/image';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

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
    <section className="w-11/12 md:w-full mx-auto py-6 bg-surface-solid-50">
      <div className="mx-auto max-w-6xl relative min-h-[150px] lg:min-h-[400px]">
        <div ref={sliderRef} className="keen-slider [&>*:last-child]:pl-3">
          {heroSlides.map((slide) => (
            <a
              key={slide.id}
              href={slide.link}
              className="keen-slider__slide block w-full rounded-lg overflow-hidden"
            >
              <Image
                src={slide.image}
                alt={slide.alt}
                width={1200}
                height={400}
                className="w-full h-full object-cover"
              />
            </a>
          ))}
        </div>

        {loaded && instanceRef.current && (
          <div className="absolute -bottom-4 md:bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
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
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
