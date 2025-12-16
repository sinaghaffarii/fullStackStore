/* eslint-disable max-lines */
'use client';

import { useSearchParams } from 'next/navigation';
import React, { useRef, useState } from 'react';

import type { ProductFiltersWrapperRef } from '@/components/product/ProductFiltersWrapper';
import type { BreadcrumbSegment, CategoryData, Product } from '@/types/product';

import { CategoryHeader } from '@/components/product/CategoryHeader';
import { ProductFiltersWrapper } from '@/components/product/ProductFiltersWrapper';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductPagination } from '@/components/product/ProductPagination';
import DynamicBreadcrumb from '@/components/ui/DynamicBreadcrumb';
import { slugToPersianMap } from '@/utils/SlugToPersianMap';

function generateBreadcrumbItems(slugs: string[]): BreadcrumbSegment[] {
  const items: BreadcrumbSegment[] = [
    { title: 'خانه', href: '/' },
    { title: 'محصولات', href: '/products' },
  ];

  let currentPath = '/products';
  slugs.forEach((slug, index) => {
    currentPath += `/${slug}`;
    const persianTitle =
      slugToPersianMap[slug] ||
      slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    items.push({
      title: persianTitle,
      href: index === slugs.length - 1 ? undefined : currentPath,
    });
  });

  return items;
}

function getCategoryData(slugs: string[]): CategoryData {
  const lastSlug = slugs.length > 0 ? slugs[slugs.length - 1] : 'all-products';
  const categoryTitle =
    slugs.length > 0 ? slugToPersianMap[lastSlug] || lastSlug : 'همه محصولات';

  const filterData = {
    brands: [
      'لورآل',
      'گارنیر',
      'شوارتسکف',
      'پنتین',
      'جدول',
      'کرست',
      'نسرین',
      'هلن',
    ],
    priceRanges: [
      { label: 'زیر ۱۰۰ هزار تومان', min: 0, max: 100000 },
      { label: '۱۰۰ تا ۲۰۰ هزار تومان', min: 100000, max: 200000 },
      { label: '۲۰۰ تا ۵۰۰ هزار تومان', min: 200000, max: 500000 },
      { label: 'بالای ۵۰۰ هزار تومان', min: 500000, max: Infinity },
    ],
    features: ['پرفروش', 'جدید', 'دارای تخفیف', 'تست شده'],
  };

  const products: Product[] = Array(12)
    .fill(null)
    .map((_, i) => {
      const productId = i + 1;
      const fixedRating = ((i % 5) + 3).toFixed(1);
      const fixedReviews = (i % 50) + 10;
      const fixedIsNew = i < 8;
      const fixedIsBestseller = i < 5;

      return {
        id: productId,
        slug: `product-${productId}`,
        name: `محصول مراقبت مو ${productId}`,
        description: `توضیحات محصول مراقبت مو ${productId}`,
        price: 150000 + i * 10000,
        originalPrice: 200000 + i * 10000,
        discount: i % 3 === 0 ? 15 : 0,
        base_price: 200000 + i * 10000,
        image: '/images/products/product_2.jpg',
        images: ['/images/products/product_2.jpg'],
        rating: fixedRating,
        reviews: fixedReviews,
        isNew: fixedIsNew,
        isBestseller: fixedIsBestseller,
        brand: filterData.brands[i % filterData.brands.length] || 'لورآل',
        category: slugs[slugs.length - 1] || 'hair',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as Product;
    });

  return {
    type: 'category',
    title: categoryTitle,
    description: `محصولات مراقبت از ${categoryTitle} با بهترین کیفیت و قیمت`,
    products,
    filters: filterData,
  };
}

interface Props {
  params: Promise<{
    slug?: string[];
  }>;
}

export default function ProductsPage({ params }: Props) {
  const searchParams = useSearchParams();
  const [resolvedParams, setResolvedParams] = React.useState<{
    slug?: string[];
  } | null>(null);

  const filtersRef = useRef<ProductFiltersWrapperRef>(null);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  React.useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) {
    return <div>Loading...</div>;
  }

  const slugs = resolvedParams.slug || [];
  const data = getCategoryData(slugs);
  const breadcrumbItems = generateBreadcrumbItems(slugs);

  const handleOpenMobileFilters = () => {
    filtersRef.current?.openMobileDialog();
  };

  const handleClearFilters = () => {
    filtersRef.current?.resetFilters();
  };

  return (
    <div className="min-h-screen bg-[#f8f8f872]">
      <div className="mx-auto w-11/12 max-w-7xl">
        <div className="py-6">
          <div className="mb-6">
            <DynamicBreadcrumb segments={breadcrumbItems} />
          </div>

          <CategoryHeader
            title={data.title}
            activeFilterCount={activeFilterCount}
            description={data.description}
            onClearFilters={handleClearFilters}
            onOpenMobileFilters={handleOpenMobileFilters}
            productCount={data.products.length}
          />

          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-6">
            <div className="shrink-0 lg:w-72">
              <ProductFiltersWrapper
                filters={data.filters}
                ref={filtersRef}
                searchParams={searchParams}
                onFilterCountChange={setActiveFilterCount}
              />
            </div>

            <div className="min-w-0 flex-1">
              <ProductGrid products={data.products} />

              <ProductPagination currentPage={1} totalPages={6} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
