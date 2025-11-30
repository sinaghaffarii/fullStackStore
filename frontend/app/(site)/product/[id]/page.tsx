// app/(site)/product/[id]/page.tsx
import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import type { Product } from '@/src/types/product';

import { ProductGallery } from '@/components/product/single/ProductGallery';
import { ProductInfo } from '@/components/product/single/ProductInfo';
import { ProductTabs } from '@/components/product/single/ProductTabs';
import { RelatedProducts } from '@/components/product/single/RelatedProducts';
import DynamicBreadcrumb from '@/components/ui/dynamicBreadcrumb';

type ProductDetail = Product & {
  title?: string;
  brandFa?: string;
  reviewsCount?: number;
  colors?: { id: number; name: string; code: string; value: string }[];
  features?: string[];
  highlights?: string[];
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock';
};

async function getProduct(id: string): Promise<ProductDetail | null> {
  await new Promise((resolve) => {
    setTimeout(resolve, 120);
  });
  if (!id) return null;

  const numericId = Number.parseInt(id, 10);

  return {
    id: numericId,
    slug: 'argan-oil-serum',
    name: 'سرم موی روغن آرگان مراکش نوتریگا',
    title: 'سرم موی روغن آرگان مراکش نوتریگا',
    description: 'سرم موی روغن آرگان مراکش نوتریگا ...',
    price: 485_000,
    originalPrice: 650_000,
    discount: 25,
    base_price: 650_000,
    image: '/images/products/product_8.webp',
    images: [
      '/images/products/product_8.webp',
      '/images/products/product_8_alt1.webp',
      '/images/products/product_8_alt2.webp',
    ],
    rating: '4.4',
    reviews: 128,
    reviewsCount: 128,
    isNew: false,
    isBestseller: true,
    inStock: true,
    stock: 42,
    stockStatus: 'in-stock',
    brand: 'Nutriga',
    brandFa: 'نوتریگا',
    category: 'hair-care',
    tags: ['hair', 'serum', 'argan-oil'],
    specifications: {
      country: 'ایتالیا',
      volume: '۱۰۰ میل',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    colors: [
      { id: 1, name: 'طلایی (۱۰۰ میل)', code: '#EAB308', value: '100ml' },
      { id: 2, name: 'نقره‌ای (۵۰ میل)', code: '#94A3B8', value: '50ml' },
    ],
    features: [
      'فاقد سولفات',
      'حاوی ویتامین E',
      'محافظت در برابر حرارت',
      'براق کننده',
    ],
    highlights: [
      'ترمیم موهای آسیب‌دیده ظرف ۴ هفته',
      'بدون سولفات، مناسب کراتین و تراپی',
      'آنتی‌اکسیدان طبیعی برای محافظت روزانه',
    ],
  };
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return { title: 'محصول یافت نشد | فروشگاه من' };
  }
  return {
    title: `${product.name} | فروشگاه من`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.map((src) => ({ url: src })),
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  const breadcrumbs = [
    { title: 'خانه', href: '/' },
    { title: 'محصولات', href: '/products' },
    { title: product.name, href: `/products/${product.slug ?? product.id}` },
  ];

  return (
    <main className="font-kalameh bg-linear-to-b from-slate-50 via-white to-white">
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-28 sm:px-6 lg:px-10 lg:pb-16">
        <DynamicBreadcrumb segments={breadcrumbs} />

        <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          <section className="lg:col-span-5">
            <ProductGallery images={product.images} title={product.name} />
          </section>
          <section className="lg:col-span-7">
            <ProductInfo product={product} />
          </section>
        </div>

        <ProductTabs product={product} />

        <div className="my-16 border-t border-dashed border-gray-200" />

        <RelatedProducts />
      </div>
    </main>
  );
}
