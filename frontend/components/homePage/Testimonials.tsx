'use client';

import Image from 'next/image';
import React from 'react';

interface Testimonial {
  id: number;
  avatar: string;
  name: string;
  text: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    avatar: '/images/testimonials/avatar1.jpg',
    name: 'زهرا',
    text: 'خرید از فاران تجربه‌ای عالی بود؛ ارسال سریع و بسته‌بندی حرفه‌ای!',
  },
  {
    id: 2,
    avatar: '/images/testimonials/avatar2.jpg',
    name: 'مهدی',
    text: 'کیفیت محصولات اصلی بسیار خوب بود، مطمئن شدم دوباره سفارش می‌دهم.',
  },
  {
    id: 3,
    avatar: '/images/testimonials/avatar3.jpg',
    name: 'سارا',
    text: 'پشتیبانی عالی دارن، سوالاتم رو سریع جواب دادن و مشکلی نداشتم.',
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="bg-surface-solid-50 py-12">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-text-darkGray mb-8 text-center text-2xl font-bold">
          نظرات مشتریان ما
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              className="rounded-lg bg-white p-6 shadow-lg transition-shadow duration-200 hover:shadow-md"
              key={t.id}
            >
              <div className="mb-4 flex items-center">
                <div className="me-3 size-12 overflow-hidden rounded-full">
                  <Image
                    height={48}
                    width={48}
                    alt={t.name}
                    className="size-full object-cover"
                    src={t.avatar}
                  />
                </div>
                <p className="text-text-darkGray ms-2 font-medium">{t.name}</p>
              </div>
              <p className="text-text-gray mb-2 text-sm">“{t.text}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
