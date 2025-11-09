import type { Metadata } from 'next';

import { notFound } from 'next/navigation';

import type { Product } from '@/types';

import { AddToCartButton } from '@/components/product/AddToCartButton';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductStructuredData } from '@/components/seo/ProductStructuredData';
import { apiClient } from '@/lib/apiClient';

interface ProductPageProps {
  params: { slug: string };
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const response = await apiClient.get(`/products/${slug}`, {
      next: { revalidate: 3600 }, // ISR: هر 1 ساعت
    });
    return response.data;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: 'محصول یافت نشد',
      description: 'محصول مورد نظر یافت نشد.',
    };
  }

  return {
    title: product.name,
    description:
      product.description || `خرید ${product.name} با بهترین قیمت و کیفیت`,
    openGraph: {
      title: product.name,
      description: product.description || `خرید ${product.name}`,
      images: product.images || ['/images/og-product.jpg'],
      type: 'product',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description || `خرید ${product.name}`,
      images: product.images || ['/images/og-product.jpg'],
    },
    alternates: {
      canonical: `/products/${params.slug}`,
    },
  };
}

export async function generateStaticParams() {
  try {
    const response = await apiClient.get('/products/slugs');
    const slugs = response.data;

    return slugs.map((slug: string) => ({
      slug,
    }));
  } catch (error) {
    return [];
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductStructuredData product={product} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div>
            <ProductGallery images={product.images || []} />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold" itemProp="name">
              {product.name}
            </h1>

            <div
              className="text-2xl font-bold text-primary"
              itemType="https://schema.org/Offer"
              itemProp="offers"
              itemScope
            >
              <span itemProp="price">
                {product.base_price.toLocaleString()}
              </span>
              <span itemProp="priceCurrency">تومان</span>
            </div>

            {product.description && (
              <div className="prose prose-lg" itemProp="description">
                {product.description}
              </div>
            )}

            <div className="flex items-center space-x-4 space-x-reverse">
              <AddToCartButton product={product} />
            </div>

            {/* Product Attributes */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-semibold">موجودی:</span>
                <span className="mr-2">{product.stock_quantity} عدد</span>
              </div>
              {/* سایر ویژگی‌ها */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
