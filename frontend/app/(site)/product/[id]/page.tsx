import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import { ProductGallery } from '@/components/product/single/ProductGallery';
import { ProductInfo } from '@/components/product/single/ProductInfo';
import { ProductTabs } from '@/components/product/single/ProductTabs';
import { RelatedProducts } from '@/components/product/single/RelatedProducts';
import DynamicBreadcrumb from '@/components/ui/dynamicBreadcrumb';
import { getProductById } from '@/src/services/Products';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: 'محصول یافت نشد' };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.map((url) => ({ url })),
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

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
          <ProductGallery alt={product.name} images={product.images} />
          <ProductInfo product={product} />
        </div>

        <ProductTabs className="mt-16" product={product} />
        <RelatedProducts className="mt-20" />
      </div>
    </main>
  );
}
