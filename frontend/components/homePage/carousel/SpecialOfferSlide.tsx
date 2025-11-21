'use client';

import React from 'react';

import Timer from './Timer';

export interface SpecialOffer {
  title: string;
  subtitle?: string;
  href: string;
  timer?: { hours: number; minutes: number; seconds: number };
  headerImage?: string;
  mainImage?: string;
  backgroundColor?: string;
  textColor?: string;
}

const SpecialOfferSlide: React.FC<{ offer: SpecialOffer }> = ({ offer }) => {
  return (
    <div className="keen-slider__slide">
      <a
        className={`flex min-h-[280px] flex-col items-center justify-center rounded-lg bg-linear-to-br p-4 ${offer.backgroundColor} ${offer.textColor} transition-shadow hover:shadow-lg`}
        href={offer.href}
      >
        <div className="space-y-3 text-center">
          {offer.headerImage && (
            <div
              className="mx-auto h-8 w-20 bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${offer.headerImage})` }}
            />
          )}

          {offer.mainImage && (
            <div
              className="mx-auto size-16 animate-pulse bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${offer.mainImage})` }}
            />
          )}

          <span className="block text-sm font-bold">{offer.title}</span>

          {offer.subtitle && (
            <span className="block text-xs opacity-90">{offer.subtitle}</span>
          )}

          {offer.timer && (
            <Timer
              minutes={offer.timer.minutes}
              hours={offer.timer.hours}
              seconds={offer.timer.seconds}
              textColor={offer.textColor || ''}
            />
          )}
        </div>
      </a>
    </div>
  );
};

export default SpecialOfferSlide;
