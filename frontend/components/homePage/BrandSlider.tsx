'use client';
import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';

const brands = [1, 2, 3, 4, 5, 6, 7, 8];

const BrandSlider = () => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    rtl: true,
    slides: { perView: 3, spacing: 20 },
    breakpoints: {
      '(min-width: 640px)': { slides: { perView: 4, spacing: 30 } },
      '(min-width: 1024px)': { slides: { perView: 6, spacing: 40 } },
    },
  });

  return (
    <section className="mx-auto mt-14 w-11/12 max-w-7xl">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">
          💎 محبوب ترین برندها
        </h3>
      </div>
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="keen-slider" ref={sliderRef}>
          {brands.map((id) => (
            <div
              className="keen-slider__slide flex items-center justify-center grayscale transition hover:grayscale-0"
              key={id}
            >
              <div className="relative flex h-16 w-32 items-center justify-center rounded-md bg-gray-200 text-xs text-gray-400">
                Logo {id}
                <Image
                  fill
                  alt="Brand"
                  className="object-contain opacity-0"
                  src="/images/homePage/headerSlider1.jpeg"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandSlider;
