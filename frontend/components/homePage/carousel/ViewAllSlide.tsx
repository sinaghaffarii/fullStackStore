'use client';

import React from 'react';

const ViewAllSlide: React.FC<{ href: string }> = ({ href }) => {
  return (
    <div className="keen-slider__slide">
      <a
        className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-white p-6 transition-colors hover:bg-gray-50"
        href={href}
      >
        <svg
          height="48"
          width="48"
          className="mb-3 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M11.97 22.75C6.05 22.75 1.22 17.93 1.22 12S6.05 1.25 11.97 1.25 22.72 6.07 22.72 12 17.9 22.75 11.97 22.75m0-20c-5.1 0-9.25 4.15-9.25 9.25s4.15 9.25 9.25 9.25 9.25-4.15 9.25-9.25-4.15-9.25-9.25-9.25"
            fill="currentColor"
          />
          <path
            d="M13.278 16.558c-.19 0-.38-.07-.53-.22l-3.53-3.53a.754.754 0 0 1 0-1.06l3.53-3.53c.29-.29.77-.29 1.06 0s.29.77 0 1.06l-3 3 3 3c.29.29.29.77 0 1.06a.7.7 0 0 1-.53.22"
            fill="currentColor"
          />
        </svg>

        <span className="text-center font-semibold text-blue-600">
          مشاهده همه محصولات
        </span>
      </a>
    </div>
  );
};

export default ViewAllSlide;
