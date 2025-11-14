'use client';

import React from 'react';
import Image from 'next/image';

const banners = [
  {
    id: 1,
    image: '/images/homePage/headerSlider3.jpeg',
    link: '/tags/takhfif50',
    alt: 'تخفیف ویژه',
  },
  {
    id: 2,
    image: '/images/homePage/headerSlider4.jpeg',
    link: '/landing/game',
    alt: 'بازی بلک بیوتی',
  },
];

const PromoBanner: React.FC = () => {
  return (
    <section className="py-8 bg-surface-solid-50">
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((banner) => (
          <a
            key={banner.id}
            href={banner.link}
            className="block rounded-xl overflow-hidden shadow hover:shadow-lg transition"
          >
            <Image
              src={banner.image}
              alt={banner.alt}
              width={1200}
              height={300}
              className="w-full h-48 md:h-60 object-cover"
            />
          </a>
        ))}
      </div>
    </section>
  );
};

export default PromoBanner;
