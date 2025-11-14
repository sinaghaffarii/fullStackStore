'use client';

import React from 'react';
import Image from 'next/image';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';

const categories = [
  {
    id: 1,
    name: 'آبرسان',
    image: '/images/categories/face-care.png',
    link: '/categories/face-care',
  },
  {
    id: 2,
    name: 'ریمل',
    image: '/images/categories/eye-makeup.png',
    link: '/categories/eye-makeup',
  },
  {
    id: 3,
    name: 'عطر و ادکلن',
    image: '/images/categories/fragrance.png',
    link: '/categories/fragrance',
  },
  {
    id: 4,
    name: 'پروتئین وی',
    image: '/images/categories/protein.png',
    link: '/categories/protein',
  },
  {
    id: 5,
    name: 'مراقبت بدن',
    image: '/images/categories/body.png',
    link: '/categories/body',
  },
  {
    id: 6,
    name: 'هدفون',
    image: '/images/categories/headphon.png',
    link: '/categories/headphon',
  },
];

const Categories: React.FC = () => {
  const [sliderRef] = useKeenSlider<HTMLDivElement>({
    slides: { perView: 4, spacing: 10 },
  });

  return (
    <section className="py-10 bg-white">
      {/* Mobile: Keen Slider */}
      <div className="sm:hidden px-4">
        <div ref={sliderRef as any} className="keen-slider -mx-2">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={cat.link}
              className="keen-slider__slide block shrink-0 w-16 px-2"
            >
              <div className="flex flex-col items-center justify-center p-2 rounded">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain mb-2 mx-auto"
                />
                <span className="text-text-darkGray text-center font-medium text-sm">
                  {cat.name}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Desktop / Tablet: Grid */}
      <div className="hidden sm:grid mx-auto max-w-6xl grid-cols-4 sm:grid-cols-6 gap-4">
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={cat.link}
            className="group flex flex-col items-center justify-center p-4 rounded-full transition"
          >
            <Image
              src={cat.image}
              alt={cat.name}
              width={100}
              height={100}
              className="w-20 h-20 object-contain mb-2"
            />
            <span className="text-text-darkGray text-center font-medium">
              {cat.name}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Categories;
