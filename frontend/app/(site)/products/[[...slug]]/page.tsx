'use client';

import DynamicBreadcrumb from '@/components/ui/dynamicBreadcrumb';
import { notFound } from 'next/navigation';

import { ProductFilters } from '@/components/product/ProductFilters';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductPagination } from '@/components/product/ProductPagination';
import { CategoryHeader } from '@/components/product/CategoryHeader';

import { Product, CategoryData, BreadcrumbSegment } from '@/src/types/product';
import { BrushCleaning, Filter, Home, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip } from '@/components/ui/tooltip';

const slugToPersianMap: Record<string, string> = {
  hair: 'مو',
  'hair-care': 'مراقبت مو',
  shampoo: 'شامپو',
  conditioner: 'نرم کننده',
  'hair-color': 'رنگ مو',
  'hair-oil': 'روغن مو',
  'hair-mask': 'ماسک مو',
  'hair-serum': 'سرم مو',
  'hair-spray': 'اسپری مو',
  'hair-gel': 'ژل مو',
  'hair-mousse': 'موس مو',
  'hair-cream': 'کرم مو',
  'hair-wax': 'وکس مو',
  'hair-pomade': 'پماد مو',
  'hair-treatment': 'درمان مو',
  'hair-accessories': 'اکسسوری مو',
};

// تابع برای تولید breadcrumb items داینامیک
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
          'https://storage.khanoumi.com/ProductImages/34983-202452814372188.jpg',
        images: [
          'https://storage.khanoumi.com/ProductImages/34983-202452814372188.jpg',
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

type Props = {
  params: Promise<{
    slug?: string[];
  }>;
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
};

export default async function ProductsPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const slugs = resolvedParams.slug || [];

  if (slugs.length === 0) {
    notFound();
  }

  const data = await getCategoryData(slugs);
  const breadcrumbItems = generateBreadcrumbItems(slugs);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-slate-600 mb-2">
              <Home className="w-4 h-4" />
              <span>/</span>
              <Package className="w-4 h-4" />
              <span className="text-slate-500">محصولات</span>
            </div>
            <DynamicBreadcrumb segments={breadcrumbItems} />
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-72 shrink-0">
              <div className="bg-white rounded-2xl shadow-xl p-5 border border-slate-100 sticky top-4 overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-indigo-500/5 rounded-full translate-y-8 -translate-x-8"></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <Filter className="w-5 h-5 text-indigo-600" />
                      </div>
                      <h2 className="font-bold text-xl text-slate-800">
                        فیلتر محصولات
                      </h2>
                    </div>

                    <Tooltip title="پاک کردن همه فیلترها">
                      <Button
                        variant={'ghost'}
                        className="text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-all duration-300 rounded-xl p-2"
                      >
                        <BrushCleaning className="size-5" />
                      </Button>
                    </Tooltip>
                  </div>

                  <div className="space-y-1">
                    <ProductFilters filters={data.filters} />
                  </div>

                  <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
                    <Button className="flex-1 bg-linear-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-indigo-500/25">
                      اعمال فیلتر
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-800 font-medium py-2.5 rounded-xl transition-all duration-300"
                    >
                      بازنشانی
                    </Button>
                  </div>

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">فیلترهای فعال:</span>
                      <span className="text-indigo-600 font-medium">
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
