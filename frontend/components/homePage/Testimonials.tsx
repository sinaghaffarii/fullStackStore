'use client';

import React from 'react';
import Image from 'next/image';

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
    <section className="py-12 bg-surface-solid-50">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-2xl font-bold mb-8 text-text-darkGray text-center">
          نظرات مشتریان ما
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-lg p-6 shadow-lg hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden me-3">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="font-medium text-text-darkGray ms-2">{t.name}</p>
              </div>
              <p className="text-sm text-text-gray mb-2">“{t.text}”</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
