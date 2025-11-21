'use client';

import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import React from 'react';
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
    <section className="bg-white py-10">
      {/* Mobile: Keen Slider */}
      <div className="px-4 sm:hidden">
        <div className="keen-slider -mx-2" ref={sliderRef as any}>
          {categories.map((cat) => (
            <a
              className="keen-slider__slide block w-16 shrink-0 px-2"
              href={cat.link}
              key={cat.id}
            >
              <div className="flex flex-col items-center justify-center rounded-sm p-2">
                <Image
                  height={80}
                  width={80}
                  alt={cat.name}
                  className="mx-auto mb-2 size-20 object-contain"
                  src={cat.image}
                />
                <span className="text-text-darkGray text-center text-sm font-medium">
                  {cat.name}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Desktop / Tablet: Grid */}
      <div className="mx-auto hidden max-w-6xl grid-cols-4 gap-4 sm:grid sm:grid-cols-6">
        {categories.map((cat) => (
          <a
            className="group flex flex-col items-center justify-center rounded-full p-4 transition"
            href={cat.link}
            key={cat.id}
          >
            <Image
              height={100}
              width={100}
              alt={cat.name}
              className="mb-2 size-20 object-contain"
              src={cat.image}
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
