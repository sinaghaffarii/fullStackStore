'use client';

import Image from 'next/image';
import React from 'react';

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
    <section className="bg-surface-solid-50 py-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2">
        {banners.map((banner) => (
          <a
            className="block overflow-hidden rounded-sm shadow-sm transition hover:shadow-lg"
            href={banner.link}
            key={banner.id}
          >
            <Image
              height={300}
              width={1200}
              alt={banner.alt}
              className="h-48 w-full object-cover md:h-60"
              src={banner.image}
            />
          </a>
        ))}
      </div>
    </section>
  );
};

export default PromoBanner;
