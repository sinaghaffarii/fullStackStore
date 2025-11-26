import Image from 'next/image';

import BrandSlider from '@/components/homePage/BrandSlider';
import CarouselProducts from '@/components/homePage/carousel/CarouselProducts';
import FlashSale from '@/components/homePage/FlashSale';
import Hero from '@/components/homePage/Hero';
import PromoBanners from '@/components/homePage/PromoBanner';
import ServiceFeatures from '@/components/homePage/ServiceFeatures';

const productsData = [
  // ... همان دیتای قبلی خودت
  {
    id: 1,
    name: 'پاد سیستم اسموک نوو ایکس',
    brand: 'SMOK',
    image: '', // خالی میذاریم چون قراره placeholder باشه
    originalPrice: 450000,
    discountedPrice: 350000,
    discountPercentage: 22,
    href: '/products/1',
  },
  {
    id: 2,
    name: 'کرم پودر مات',
    brand: 'UWELL',
    image: '',
    originalPrice: 550000,
    discountedPrice: 420000,
    discountPercentage: 24,
    href: '/products/2',
  },
  {
    id: 3,
    name: 'ضد آفتاب بی رنگ',
    brand: 'UWELL',
    image: '',
    originalPrice: 550000,
    discountedPrice: 420000,
    discountPercentage: 24,
    href: '/products/3',
  },
  {
    id: 4,
    name: 'ماسک مو بدون سولفات',
    brand: 'UWELL',
    image: '',
    originalPrice: 550000,
    discountedPrice: 420000,
    discountPercentage: 24,
    href: '/products/4',
  },
  {
    id: 5,
    name: 'ریمل حجم دهنده',
    brand: 'UWELL',
    image: '',
    originalPrice: 550000,
    discountedPrice: 420000,
    discountPercentage: 24,
    href: '/products/5',
  },
];

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden bg-[#f5f5f5] pb-10">
      <Hero />

      <FlashSale products={productsData} />

      <PromoBanners heightClass="h-40 md:h-52" count={2} />

      <CarouselProducts
        title="🔥 پیشنهادات داغ بلک فرایدی"
        viewAllLink="/products/hot"
        products={productsData}
      />

      <PromoBanners heightClass="h-40 md:h-64" count={2} />

      <CarouselProducts
        title="محصولات تخصصی"
        viewAllLink="/products/special"
        products={productsData}
      />

      <PromoBanners heightClass="h-40 md:h-72" count={4} />

      <section className="mx-auto mt-10 w-11/12 max-w-7xl">
        <div className="relative h-32 w-full overflow-hidden rounded-lg bg-gray-300 md:h-48">
          <Image
            fill
            alt="Big Banner"
            className="object-cover opacity-0"
            src="/images/homePage/discount.jpg"
          />
          <div className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-500">
            هر روز 90% تخفیف (بنر بزرگ)
          </div>
        </div>
      </section>

      <CarouselProducts
        title="پک های جذاب بلک فرایدی"
        viewAllLink="/products/packs"
        products={productsData}
      />

      <CarouselProducts
        title="🔌 لوازم برقی"
        viewAllLink="/products/electric"
        products={productsData}
      />

      <CarouselProducts
        title="عطر و ادکلن"
        viewAllLink="/products/perfume"
        products={productsData}
      />

      <BrandSlider />

      <ServiceFeatures />

      <section className="mx-auto my-10 w-11/12 max-w-7xl text-justify text-sm text-gray-500">
        <h2 className="mb-2 font-bold text-gray-700">
          فروشگاه اینترنتی ویترین
        </h2>
        <p>
          ویترین، اولین فروشگاه آنلاین تخصصی آرایشی، بهداشتی و عطر و ادکلن در
          حوزه سلامت و زیبایی است...
        </p>
      </section>
    </main>
  );
}
