import type { Metadata } from 'next';

import type { Product } from '@/types';

import { ProductCard } from '@/components/product/ProductCard';
import { HomeStructuredData } from '@/components/seo/HomeStructuredData';
import { apiClient } from '@/lib/apiClient';

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await apiClient.get('/products/featured', {
      next: { revalidate: 3600 }, // ISR: هر 1 ساعت
    });
    return response.data;
  } catch (error) {
    return [];
  }
}

async function getCategories() {
  try {
    const response = await apiClient.get('/categories', {
      next: { revalidate: 86400 }, // ISR: هر 24 ساعت
    });
    return response.data;
  } catch (error) {
    return [];
  }
}

export const metadata: Metadata = {
  title: 'فروشگاه آنلاین - بهترین قیمت‌ها و کیفیت',
  description:
    'خرید آنلاین از فروشگاه اینترنتی با بهترین قیمت‌ها، کیفیت عالی و تحویل سریع. تضمین بهترین کیفیت و پشتیبانی 24 ساعته.',
  openGraph: {
    title: 'فروشگاه آنلاین - بهترین قیمت‌ها و کیفیت',
    description:
      'خرید آنلاین از فروشگاه اینترنتی با بهترین قیمت‌ها و کیفیت عالی',
    images: ['/images/og-home.jpg'],
  },
  alternates: {
    canonical: '/',
  },
};

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <>
      <HomeStructuredData categories={categories} products={products} />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            فروشگاه آنلاین
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            بهترین محصولات با بهترین قیمت‌ها
          </p>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">محصولات ویژه</h2>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          itemType="https://schema.org/ItemList"
          itemScope
        >
          {products.map((product, index) => (
            <div
              itemType="https://schema.org/Product"
              key={product.id}
              itemProp="itemListElement"
              itemScope
            >
              <ProductCard
                priority={index < 4} // Lazy load after first 4
                product={product}
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

// برای SSG
export async function generateStaticParams() {
  return [{}];
}
