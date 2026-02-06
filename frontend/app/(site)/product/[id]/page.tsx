'use client';

import { notFound, useParams } from 'next/navigation';

import { ProductGallery } from '@/components/product/single/ProductGallery';
import { ProductInfo } from '@/components/product/single/ProductInfo';
import { ProductTabs } from '@/components/product/single/ProductTabs';
import { RelatedProducts } from '@/components/product/single/RelatedProducts';
import DynamicBreadcrumb from '@/components/ui/DynamicBreadcrumb';
import { Spinner } from '@/components/ui/Spinner';
import { useGetProductById } from '@/services/Products';

export default function ProductPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, isLoading, isError } = useGetProductById(id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !data?.data) {
    notFound();
  }

  const product = data.data;

  const imageUrls = product.images?.map((img) => img.url) ?? [];

  const breadcrumbs = [
    { title: 'خانه', href: '/' },
    { title: 'محصولات', href: '/products' },
    { title: product.name },
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <DynamicBreadcrumb segments={breadcrumbs} />

        <div className="mt-8 grid gap-12 lg:grid-cols-2">
          <ProductGallery alt={product.name} images={imageUrls} />
          <ProductInfo product={product} />
        </div>

        <ProductTabs className="mt-16" product={product} />
        <RelatedProducts className="mt-20" />
      </div>
    </main>
  );
}
