import DynamicBreadcrumb from '@/components/ui/dynamicBreadcrumb';
import { notFound } from 'next/navigation';

import { ProductFilters } from '@/components/product/ProductFilters';
import { ProductGrid } from '@/components/product/ProductGrid';
import { ProductPagination } from '@/components/product/ProductPagination';
import { CategoryHeader } from '@/components/product/CategoryHeader';
import { ProductToolbar } from '@/components/product/ProductToolbar';

import { Product, CategoryData, BreadcrumbSegment } from '@/src/types/product';

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

  const products: Product[] = Array(24)
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <DynamicBreadcrumb segments={breadcrumbItems} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-64 shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-4">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
                <h2 className="font-bold text-lg text-gray-900">
                  فیلتر محصولات
                </h2>
                <button className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors">
                  پاک کردن همه
                </button>
              </div>
              <ProductFilters filters={data.filters} />
            </div>
          </div>

          <div className="flex-1">
            <CategoryHeader title={data.title} description={data.description} />

            <ProductToolbar productCount={data.products.length} />

            <ProductGrid products={data.products} />

            <ProductPagination currentPage={1} totalPages={6} />
          </div>
        </div>
      </div>
    </div>
  );
}
