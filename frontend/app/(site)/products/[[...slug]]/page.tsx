import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DynamicBreadcrumb from '@/components/ui/dynamicBreadcrumb';
import { notFound } from 'next/navigation';
import { PlusIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scrollArea';

// مپینگ برای تبدیل slug به عنوان فارسی
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

// اینترفیس‌های TypeScript
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  rating: string;
  reviews: number;
  isNew: boolean;
  isBestseller: boolean;
  brand: string;
}

interface CategoryData {
  type: 'category';
  title: string;
  description: string;
  products: Product[];
  filters: {
    brands: string[];
    priceRanges: { label: string; min: number; max: number }[];
    features: string[];
  };
}

interface BreadcrumbSegment {
  title: string;
  href?: string;
}

type Props = {
  params: Promise<{
    slug?: string[];
  }>;
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
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

// داده‌های نمونه برای دسته‌بندی مو - مشابه سایت خانومی
async function getCategoryData(slugs: string[]): Promise<CategoryData> {
  // اگر slug وجود نداشته باشد، 404 برگردان
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

  // تولید محصولات نمونه
  const products: Product[] = Array(24)
    .fill(null)
    .map((_, i) => {
      const hasDiscount = Math.random() > 0.6;
      const originalPrice = Math.floor(Math.random() * 300000) + 50000;
      const discount = hasDiscount ? Math.floor(Math.random() * 40) + 10 : 0;
      const price = hasDiscount
        ? originalPrice * (1 - discount / 100)
        : originalPrice;

      return {
        id: i + 1,
        name: `محصول مراقبت مو ${i + 1}`,
        price: Math.round(price),
        originalPrice,
        discount,
        image: `/products/hair-${(i % 8) + 1}.jpg`,
        rating: (Math.random() * 2 + 3).toFixed(1),
        reviews: Math.floor(Math.random() * 200),
        isNew: Math.random() > 0.7,
        isBestseller: Math.random() > 0.8,
        brand:
          filterData.brands[
            Math.floor(Math.random() * filterData.brands.length)
          ],
      };
    });

  return {
    type: 'category',
    title: categoryTitle,
    description: `محصولات مراقبت از ${categoryTitle} با بهترین کیفیت و قیمت`,
    products,
    filters: filterData,
  };
}

// کامپوننت فیلترها - شبیه Rojashop
function FiltersSidebar({ filters }: { filters: CategoryData['filters'] }) {
  return (
    <div className="space-y-6">
      {/* فیلتر برند */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="font-bold text-base mb-3 text-gray-800 flex items-center justify-between">
          <span>برند</span>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </h3>
        <ScrollArea className="space-y-2 max-h-48 overflow-y-auto ">
          {filters.brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center justify-between cursor-pointer group py-1"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors ms-2">
                  {brand}
                </span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded me-1">
                {Math.floor(Math.random() * 50) + 1}
              </span>
            </label>
          ))}
        </ScrollArea>
      </div>

      {/* فیلتر محدوده قیمت */}
      <div className="pb-4 border-b border-gray-200">
        <h3 className="font-bold text-base mb-3 text-gray-800 flex items-center justify-between">
          <span>محدوده قیمت</span>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </h3>
        <div className="space-y-2">
          {filters.priceRanges.map((range, index) => (
            <label
              key={index}
              className="flex items-center space-x-2 space-x-reverse cursor-pointer group py-1"
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors ms-2">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* فیلتر ویژگی‌ها */}
      <div className="pb-4">
        <h3 className="font-bold text-base mb-3 text-gray-800 flex items-center justify-between">
          <span>ویژگی‌ها</span>
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </h3>
        <div className="space-y-2">
          {filters.features.map((feature) => (
            <label
              key={feature}
              className="flex items-center space-x-2 space-x-reverse cursor-pointer group py-1"
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-blue-600 transition-colors ms-2">
                {feature}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const slugs = resolvedParams.slug || [];

  // اگر مسیر خالی باشد (یعنی /products) 404 بده
  if (slugs.length === 0) {
    notFound();
  }

  const data = await getCategoryData(slugs);
  const breadcrumbItems = generateBreadcrumbItems(slugs);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb داینامیک */}
        <div className="mb-6">
          <DynamicBreadcrumb segments={breadcrumbItems} />
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* سایدبار فیلترها */}
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
              <FiltersSidebar filters={data.filters} />
            </div>
          </div>

          {/* محتوای اصلی */}
          <div className="flex-1">
            {/* هدر دسته‌بندی */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {data.title}
              </h1>
              <p className="text-gray-600 text-sm">{data.description}</p>
            </div>

            {/* نوار ابزار بالا */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="text-gray-600 text-sm mb-3 sm:mb-0">
                <span className="font-medium">{data.products.length}</span>{' '}
                محصول
              </div>

              <div className="flex items-center gap-3">
                {/* دکمه‌های نمایش */}
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                  <button className="p-2 bg-white border-l border-gray-300 hover:bg-gray-50 transition-colors">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </button>
                  <button className="p-2 bg-gray-100 border-l border-gray-300 hover:bg-gray-200 transition-colors">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>

                {/* مرتب‌سازی */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">مرتب‌سازی:</span>
                  <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[180px]">
                    <option>پیش‌فرض</option>
                    <option>ارزان‌ترین</option>
                    <option>گران‌ترین</option>
                    <option>پرفروش‌ترین</option>
                    <option>محبوب‌ترین</option>
                    <option>جدیدترین</option>
                  </select>
                </div>

                {/* دکمه فیلتر در موبایل */}
                <div className="lg:hidden">
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* شبکه محصولات */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5  gap-2 mb-6">
              {data.products.map((product) => (
                <div
                  key={product.id}
                  className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden transform hover:-translate-y-1"
                >
                  {product.discount > 0 && (
                    <div className="absolute top-2 right-2 z-20">
                      <div className="relative">
                        <div className="flex items-center justify-center border shadow rounded-lg bg-gray-100 text-xs p-1 size-8 font-medium">
                          %{product.discount}
                        </div>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[3px] border-r-[3px] border-t-[3px] border-l-transparent border-r-transparent border-t-green-500"></div>
                      </div>
                    </div>
                  )}

                  {/* تصویر محصول با افکت پیشرفته */}
                  <div className="relative p-1.5 pb-0">
                    <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg overflow-hidden relative group">
                      <img
                        // src={product.image}
                        src={
                          'https://storage.khanoumi.com/ProductImages/84921-20251694316979.jpg'
                        }
                        alt={product.name}
                        className="w-full h-full object-contain transition-all duration-700 group-hover:scale-110"
                      />

                      {/* افکت شیشه‌ای روی تصویر */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      {/* دکمه‌های اکشن */}
                      <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <button className="p-1 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110">
                          <svg
                            className="w-3 h-3 text-gray-700 hover:text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* نمایش سریع قیمت روی هاور */}
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm whitespace-nowrap">
                          {product.price.toLocaleString('fa-IR')} تومان
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* محتوای محصول */}
                  <div className="p-1.5 pt-1">
                    {/* نام محصول */}
                    <h3 className="text-xs font-bold text-gray-900 line-clamp-2 leading-4 mb-1 group-hover:text-blue-600 transition-colors min-h-[2rem]">
                      {product.name}
                    </h3>

                    {/* برند */}
                    <div className="mb-1">
                      <span className="text-[10px] text-gray-500 font-medium bg-gray-100 px-1.5 py-0.5 rounded-full">
                        {product.brand}
                      </span>
                    </div>

                    {/* قیمت‌ها */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-gray-900">
                          {product.price.toLocaleString('fa-IR')}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-[10px] text-gray-500 line-through">
                            {product.originalPrice.toLocaleString('fa-IR')}
                          </span>
                        )}
                      </div>

                      {/* تعداد فروش */}
                      <div className="text-[9px] text-gray-400 bg-gray-100 px-1 py-0.5 rounded">
                        {Math.floor(Math.random() * 500) + 50} فروش
                      </div>
                    </div>
                  </div>

                  {/* دکمه CTA مدرن */}
                  <div className="px-1.5 pb-1.5">
                    <Button
                      className="w-full"
                      iconPosition="left"
                      leftIcon={<PlusIcon />}
                    >
                      افزودن به سبد خری
                    </Button>
                  </div>

                  {/* خط برجسته رنگ */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                </div>
              ))}
            </div>

            {/* صفحه‌بندی */}
            <div className="flex justify-center items-center gap-1">
              <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              {[1, 2, 3, 4, 5, 6].map((page) => (
                <button
                  key={page}
                  className={`w-8 h-8 flex items-center justify-center border rounded-lg text-sm ${
                    page === 1
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
