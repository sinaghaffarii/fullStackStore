/* eslint-disable max-lines */
import Image from 'next/image';

import type { Product } from '@/types/product';

import BrandSlider from '@/components/homePage/BrandSlider';
import CarouselProducts from '@/components/homePage/carousel/CarouselProducts';
import FlashSale from '@/components/homePage/FlashSale';
import Hero from '@/components/homePage/Hero';
import PromoBanners from '@/components/homePage/PromoBanner';
import ServiceFeatures from '@/components/homePage/ServiceFeatures';

export const productsData: Product[] = [
  {
    id: 1,
    slug: 'smok-novo-x',
    name: 'پاد سیستم اسموک نوو ایکس',
    description: 'پاد سیستم حرفه‌ای با طراحی جمع‌وجور و طعم‌دهی عالی',
    price: 350_000,
    originalPrice: 450_000,
    discount: 22,
    base_price: 350_000,
    image: '/images/products/defaultImage.jpg',
    images: ['/images/products/defaultImage.jpg'],
    rating: '4.5',
    reviews: 128,
    isNew: false,
    isBestseller: true,
    brand: 'SMOK',
    category: 'pod-system',
    inStock: true,
    stock: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    slug: 'mat-foundation',
    name: 'کرم پودر مات',
    description: 'کرم پودر مات با پوشش بالا مناسب پوست چرب',
    price: 420_000,
    originalPrice: 550_000,
    discount: 24,
    base_price: 420_000,
    image: '/images/products/defaultImage.jpg',
    images: ['/images/products/defaultImage.jpg'],
    rating: '4.2',
    reviews: 64,
    isNew: true,
    isBestseller: false,
    brand: 'UWELL',
    category: 'makeup',
    inStock: true,
    stock: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    slug: 'colorless-sunscreen',
    name: 'ضد آفتاب بی‌رنگ',
    description: 'ضد آفتاب بدون رنگ، سبک و مناسب مصرف روزانه',
    price: 420_000,
    originalPrice: 550_000,
    discount: 24,
    base_price: 420_000,
    image: '/images/products/defaultImage.jpg',
    images: ['/images/products/defaultImage.jpg'],
    rating: '4.3',
    reviews: 89,
    isNew: false,
    isBestseller: false,
    brand: 'UWELL',
    category: 'skin-care',
    inStock: true,
    stock: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    slug: 'sulfate-free-hair-mask',
    name: 'ماسک مو بدون سولفات',
    description: 'ماسک مو بدون سولفات برای موهای رنگ‌شده',
    price: 420_000,
    originalPrice: 550_000,
    discount: 24,
    base_price: 420_000,
    image: '/images/products/defaultImage.jpg',
    images: ['/images/products/defaultImage.jpg'],
    rating: '4.6',
    reviews: 147,
    isNew: true,
    isBestseller: true,
    brand: 'UWELL',
    category: 'hair-care',
    inStock: false,
    stock: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    slug: 'colorless-sunscreen',
    name: 'ضد آفتاب بی‌رنگ',
    description: 'ضد آفتاب بدون رنگ، سبک و مناسب مصرف روزانه',
    price: 420_000,
    originalPrice: 550_000,
    discount: 24,
    base_price: 420_000,
    image: '/images/products/defaultImage.jpg',
    images: ['/images/products/defaultImage.jpg'],
    rating: '4.3',
    reviews: 89,
    isNew: false,
    isBestseller: false,
    brand: 'UWELL',
    category: 'skin-care',
    inStock: true,
    stock: 15,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    slug: 'sulfate-free-hair-mask',
    name: 'ماسک مو بدون سولفات',
    description: 'ماسک مو بدون سولفات برای موهای رنگ‌شده',
    price: 420_000,
    originalPrice: 550_000,
    discount: 24,
    base_price: 420_000,
    image: '/images/products/defaultImage.jpg',
    images: ['/images/products/defaultImage.jpg'],
    rating: '4.6',
    reviews: 147,
    isNew: true,
    isBestseller: true,
    brand: 'UWELL',
    category: 'hair-care',
    inStock: false,
    stock: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden pb-10">
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
          فروشگاه اینترنتی فاران بیوتی
        </h2>
        <p>
          فارانی اولین فروشگاه آنلاین تخصصی آرایشی، بهداشتی و عطر و ادکلن در
          حوزه سلامت و زیبایی است...
        </p>
      </section>
    </main>
  );
}
