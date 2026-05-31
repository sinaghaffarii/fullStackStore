import Image from 'next/image';

import type { CreateProductDto, ProductImage } from '@/types/product';

import BrandSlider from '@/components/homePage/BrandSlider';
import CarouselProducts from '@/components/homePage/carousel/CarouselProducts';
import FlashSale from '@/components/homePage/FlashSale';
import Hero from '@/components/homePage/Hero';
import PromoBanners from '@/components/homePage/PromoBanner';
import ServiceFeatures from '@/components/homePage/ServiceFeatures';

const defaultProductImage: ProductImage = {
  id: 'default-image-id',
  url: '/images/products/defaultImage.jpg',
  is_primary: false,
};

// export const productsData: Product[] = [
//   {
//     id: '1', // ✅ string
//     slug: 'smok-novo-x',
//     name: 'پاد سیستم اسموک نوو ایکس',
//     description: 'پاد سیستم حرفه‌ای با طراحی جمع‌وجور و طعم‌دهی عالی',
//     base_price: 450_000,
//     final_price: 350_000,
//     discount_percent: 22,
//     primary_image: '/images/products/defaultImage.jpg',
//     images: [defaultProductImage], // ✅ ProductImage[]
//     rating: 4.5, // ✅ number
//     review_count: 128,
//     is_new: false,
//     is_featured: true,
//     brand: { id: 'brand-smok-id', name: 'SMOK', name_fa: 'اسموک' }, // ✅ object
//     category: {
//       id: 'cat-pod-system-id',
//       name: 'پاد سیستم',
//       slug: 'pod-system',
//     }, // ✅ object
//     stock_status: 'IN_STOCK', // ✅ enum
//     colors: [],
//     sizes: [],
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//   },
//   {
//     id: '2',
//     slug: 'mat-foundation',
//     name: 'کرم پودر مات',
//     description: 'کرم پودر مات با پوشش بالا مناسب پوست چرب',
//     base_price: 550_000,
//     final_price: 420_000,
//     discount_percent: 24,
//     primary_image: '/images/products/defaultImage.jpg',
//     images: [defaultProductImage],
//     rating: 4.2,
//     review_count: 64,
//     is_new: true,
//     is_featured: false,
//     brand: { id: 'brand-uwell-id', name: 'UWELL', name_fa: 'یوول' },
//     category: { id: 'cat-makeup-id', name: 'آرایشی', slug: 'makeup' },
//     stock_status: 'IN_STOCK',
//     colors: [],
//     sizes: [],
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//   },
//   {
//     id: '3',
//     slug: 'colorless-sunscreen',
//     name: 'ضد آفتاب بی‌رنگ',
//     description: 'ضد آفتاب بدون رنگ، سبک و مناسب مصرف روزانه',
//     base_price: 550_000,
//     final_price: 420_000,
//     discount_percent: 24,
//     primary_image: '/images/products/defaultImage.jpg',
//     images: [defaultProductImage],
//     rating: 4.3,
//     review_count: 89,
//     is_new: false,
//     is_featured: false,
//     brand: { id: 'brand-uwell-id', name: 'UWELL', name_fa: 'یوول' },
//     category: {
//       id: 'cat-skin-care-id',
//       name: 'مراقبت پوست',
//       slug: 'skin-care',
//     },
//     stock_status: 'IN_STOCK',
//     colors: [],
//     sizes: [],
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//   },
//   {
//     id: '4',
//     slug: 'sulfate-free-hair-mask',
//     name: 'ماسک مو بدون سولفات',
//     description: 'ماسک مو بدون سولفات برای موهای رنگ‌شده',
//     base_price: 550_000,
//     final_price: 420_000,
//     discount_percent: 24,
//     primary_image: '/images/products/defaultImage.jpg',
//     images: [defaultProductImage],
//     rating: 4.6,
//     review_count: 147,
//     is_new: true,
//     is_featured: true,
//     brand: { id: 'brand-uwell-id', name: 'UWELL', name_fa: 'یوول' },
//     category: { id: 'cat-hair-care-id', name: 'مراقبت مو', slug: 'hair-care' },
//     stock_status: 'OUT_OF_STOCK',
//     colors: [],
//     sizes: [],
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//   },
//   {
//     id: '5',
//     slug: 'colorless-sunscreen-2',
//     name: 'ضد آفتاب بی‌رنگ',
//     description: 'ضد آفتاب بدون رنگ، سبک و مناسب مصرف روزانه',
//     base_price: 550_000,
//     final_price: 420_000,
//     discount_percent: 24,
//     primary_image: '/images/products/defaultImage.jpg',
//     images: [defaultProductImage],
//     rating: 4.3,
//     review_count: 89,
//     is_new: false,
//     is_featured: false,
//     brand: { id: 'brand-uwell-id', name: 'UWELL', name_fa: 'یوول' },
//     category: {
//       id: 'cat-skin-care-id',
//       name: 'مراقبت پوست',
//       slug: 'skin-care',
//     },
//     stock_status: 'IN_STOCK',
//     colors: [],
//     sizes: [],
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//   },
//   {
//     id: '6',
//     slug: 'sulfate-free-hair-mask-2',
//     name: 'ماسک مو بدون سولفات',
//     description: 'ماسک مو بدون سولفات برای موهای رنگ‌شده',
//     base_price: 550_000,
//     final_price: 420_000,
//     discount_percent: 24,
//     primary_image: '/images/products/defaultImage.jpg',
//     images: [defaultProductImage],
//     rating: 4.6,
//     review_count: 147,
//     is_new: true,
//     is_featured: true,
//     brand: { id: 'brand-uwell-id', name: 'UWELL', name_fa: 'یوول' },
//     category: { id: 'cat-hair-care-id', name: 'مراقبت مو', slug: 'hair-care' },
//     stock_status: 'OUT_OF_STOCK',
//     colors: [],
//     sizes: [],
//     created_at: new Date().toISOString(),
//     updated_at: new Date().toISOString(),
//   },
// ];

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden pb-10">
      <Hero />

      <FlashSale products={[]} />

      <PromoBanners heightClass="h-40 md:h-52" count={2} />

      <CarouselProducts
        title="🔥 پیشنهادات داغ بلک فرایدی"
        viewAllLink="/products/hot"
        products={[]}
      />

      <PromoBanners heightClass="h-40 md:h-64" count={2} />

      <CarouselProducts
        title="محصولات تخصصی"
        viewAllLink="/products/special"
        products={[]}
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
        products={[]}
      />

      <CarouselProducts
        title="🔌 لوازم برقی"
        viewAllLink="/products/electric"
        products={[]}
      />

      <CarouselProducts
        title="عطر و ادکلن"
        viewAllLink="/products/perfume"
        products={[]}
      />

      <BrandSlider />

      <ServiceFeatures />

      <section className="mx-auto my-10 w-11/12 max-w-7xl text-justify text-sm text-gray-500">
        <h2 className="mb-2 font-bold text-gray-700">
          فروشگاه اینترنتی فاران بیوتی
        </h2>
        <p>
          فاران بیوتی اولین فروشگاه آنلاین تخصصی آرایشی، بهداشتی و عطر و ادکلن
          در حوزه سلامت و زیبایی است...
        </p>
      </section>
    </main>
  );
}
