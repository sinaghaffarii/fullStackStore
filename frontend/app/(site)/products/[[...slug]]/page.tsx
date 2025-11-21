'use client';

import { BrushCleaning, Filter, Home, Package } from 'lucide-react';
import { notFound } from 'next/navigation';

import type {
  BreadcrumbSegment,
  CategoryData,
  Product,
} from '@/src/types/product';

import { CategoryHeader } from '@/components/product/CategoryHeader';
import { ProductFilters } from '@/components/product/ProductFilters';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductPagination } from '@/components/product/ProductPagination';
import { Button } from '@/components/ui/button';
import DynamicBreadcrumb from '@/components/ui/dynamicBreadcrumb';
import { Tooltip } from '@/components/ui/tooltip';
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

async function getCategoryData(slugs: string[]): Promise<CategoryData> {
  if (!slugs || slugs.length === 0) {
    notFound();
  }

  const lastSlug = slugs[slugs.length - 1];
  const categoryTitle = slugToPersianMap[lastSlug] || lastSlug;

  // داده‌های فیلترها
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

      const simpleProduct: any = {
        id: productId,
        slug: `product-${productId}`,
        name: `محصول مراقبت مو ${productId}`,
        description: `توضیحات محصول مراقبت مو ${productId}`,
        price: 150000 + i * 10000,
        originalPrice: 200000 + i * 10000,
        discount: i % 3 === 0 ? 15 : 0,
        base_price: 200000 + i * 10000,
        image:
          'https://storage.khanoumi.com/ProductImages/84921-20251694316979.jpg',
        images: [
          'https://storage.khanoumi.com/ProductImages/84921-20251694316979.jpg',
        ],
        rating: fixedRating,
        reviews: fixedReviews,
        isNew: fixedIsNew,
        isBestseller: fixedIsBestseller,
        brand: filterData.brands[i % filterData.brands.length],
        category: slugs[slugs.length - 1] || 'hair',
      };

      return simpleProduct as Product;
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
  searchParams: Record<string, string | string[] | undefined>;
}

export default async function ProductsPage({ params }: Props) {
  const resolvedParams = await params;
  const slugs = resolvedParams.slug || [];

  if (slugs.length === 0) {
    notFound();
  }

  const data = await getCategoryData(slugs);
  const breadcrumbItems = generateBreadcrumbItems(slugs);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2 text-sm text-slate-600">
              <Home className="size-4" />
              <span>/</span>
              <Package className="size-4" />
              <span className="text-slate-500">محصولات</span>
            </div>
            <DynamicBreadcrumb segments={breadcrumbItems} />
          </div>

          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="shrink-0 lg:w-72">
              <div className="sticky top-4 overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-xl">
                <div className="absolute top-0 right-0 size-20 translate-x-8 -translate-y-8 rounded-full bg-blue-500/5"></div>
                <div className="absolute bottom-0 left-0 size-16 -translate-x-8 translate-y-8 rounded-full bg-indigo-500/5"></div>

                <div className="relative z-10">
                  <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-indigo-500/10 p-2">
                        <Filter className="size-5 text-indigo-600" />
                      </div>
                      <h2 className="text-xl font-bold text-slate-800">
                        فیلتر محصولات
                      </h2>
                    </div>

                    <Tooltip title="پاک کردن همه فیلترها">
                      <Button
                        className="rounded-xl p-2 text-slate-500 transition-all duration-300 hover:bg-rose-50 hover:text-rose-500"
                        variant="ghost"
                      >
                        <BrushCleaning className="size-5" />
                      </Button>
                    </Tooltip>
                  </div>

                  <div className="space-y-1">
                    <ProductFilters filters={data.filters} />
                  </div>

                  <div className="mt-6 flex gap-3 border-t border-slate-200 pt-4">
                    <Button className="flex-1 rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 py-2.5 font-medium text-white shadow-lg transition-all duration-300 hover:from-indigo-700 hover:to-blue-700 hover:shadow-indigo-500/25">
                      اعمال فیلتر
                    </Button>
                    <Button
                      className="flex-1 rounded-xl border-slate-300 py-2.5 font-medium text-slate-600 transition-all duration-300 hover:bg-slate-50 hover:text-slate-800"
                      variant="outline"
                    >
                      بازنشانی
                    </Button>
                  </div>

                  <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">فیلترهای فعال:</span>
                      <span className="font-medium text-indigo-600">
                        ۳ مورد
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1">
              <CategoryHeader
                title={data.title}
                description={data.description}
                productCount={data.products.length}
              />

              <ProductGrid products={data.products} />

              <ProductPagination currentPage={1} totalPages={6} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
