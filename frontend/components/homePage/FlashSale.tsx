'use client';

import { ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import CarouselProducts from './carousel/CarouselProducts';

interface Props {
  products: any[];
}

const FlashSale: React.FC<Props> = ({ products }) => {
  return (
    <section className="mx-auto mt-10 w-11/12 max-w-7xl rounded-lg bg-[#570018] px-4 py-6 md:px-6 md:py-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
        {/* --- Banner (Exactly Same Height as Product Cards) --- */}
        <div className="relative w-full shrink-0 lg:w-[280px]">
          <div className="relative h-[170px] w-full overflow-hidden rounded-lg md:h-[250px] lg:h-[390px]">
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-8 text-center">
              <span className="text-4xl leading-tight font-black text-white/90 drop-shadow-lg">
                UP TO <br /> 90% <br /> OFF
              </span>

              <span className="mt-4 text-lg font-bold text-white drop-shadow-md">
                یه ویترین پر از تخفیف
              </span>

              <div className="mt-auto mb-8 flex items-center justify-center gap-2">
                <span className="rounded-sm bg-white/20 px-2 py-1 text-xs text-white">
                  05 : 12 : 40
                </span>
              </div>
            </div>

            <Image
              fill
              alt="Flash Sale Banner"
              className="object-cover opacity-70 mix-blend-overlay"
              src="/images/homePage/discount.jpg"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <CarouselProducts
            className="py-0!"
            breakpoints={{
              '(min-width: 640px)': { slides: { perView: 2, spacing: 14 } },
              '(min-width: 768px)': { slides: { perView: 2.5, spacing: 14 } },
              '(min-width: 1024px)': { slides: { perView: 3, spacing: 14 } },
              '(min-width: 1280px)': { slides: { perView: 3.5, spacing: 14 } },
            }}
            products={products}
            showArrows
          />
        </div>
      </div>

      <div className="mt-4 flex w-full justify-end border-t border-white/10 pt-3">
        <Link
          className="group flex items-center gap-1 text-sm font-medium text-white transition-opacity hover:opacity-80"
          href="/flash-sale"
        >
          مشاهده همه
          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-1" />
        </Link>
      </div>
    </section>
  );
};

export default FlashSale;
