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

// کامپوننت فیلترها - مشابه سایت خانومی
function FiltersSidebar({ filters }: { filters: CategoryData['filters'] }) {
  return (
    <div className="space-y-8">
      {/* فیلتر برند */}
      <div className="border-b pb-6">
        <h3 className="font-bold text-lg mb-4 text-gray-800">برند</h3>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {filters.brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center space-x-3 space-x-reverse">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-primary transition-colors mx-2">
                  {brand}
                </span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded me-2">
                {Math.floor(Math.random() * 50) + 1}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* فیلتر محدوده قیمت */}
      <div className="border-b pb-6">
        <h3 className="font-bold text-lg mb-4 text-gray-800">محدوده قیمت</h3>
        <div className="space-y-3">
          {filters.priceRanges.map((range, index) => (
            <label
              key={index}
              className="flex items-center space-x-3 space-x-reverse cursor-pointer group"
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-primary transition-colors mx-2">
                {range.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* فیلتر ویژگی‌ها */}
      <div>
        <h3 className="font-bold text-lg mb-4 text-gray-800">ویژگی‌ها</h3>
        <div className="space-y-3">
          {filters.features.map((feature) => (
            <label
              key={feature}
              className="flex items-center space-x-3 space-x-reverse cursor-pointer group"
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-primary transition-colors mx-2">
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
    <div className="min-h-screen max-w-8xl mx-auto">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb داینامیک */}
        <DynamicBreadcrumb segments={breadcrumbItems} />

        {/* هدر دسته‌بندی */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {data.title}
          </h1>
          <p className="text-gray-600">{data.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* سایدبار فیلترها - در موبایل اول نمی‌آید */}
          <div className="lg:w-80 shrink-0">
            <div className="static top-24 bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-xl text-gray-900">
                  فیلتر محصولات
                </h2>
                <button className="text-primary text-sm font-medium">
                  پاک کردن همه
                </button>
              </div>
              <FiltersSidebar filters={data.filters} />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm border">
              <div className="text-gray-600 mb-2 sm:mb-0">
                <span className="font-medium">{data.products.length}</span>{' '}
                محصول
              </div>
              <div className="flex items-center gap-4">
                <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
                  <option>مرتب‌سازی: پیش‌فرض</option>
                  <option>مرتب‌سازی: ارزان‌ترین</option>
                  <option>مرتب‌سازی: گران‌ترین</option>
                  <option>مرتب‌سازی: پرفروش‌ترین</option>
                  <option>مرتب‌سازی: محبوب‌ترین</option>
                </select>

                <div className="lg:hidden flex items-center gap-2">
                  <button className="p-2 border border-gray-300 rounded-lg">
                    <svg
                      className="w-5 h-5"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {data.products.map((product) => (
                <Card
                  key={product.id}
                  className="group hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden"
                >
                  <CardHeader className="p-4 pb-0 relative">
                    <div className="relative">
                      {/* تصویر محصول */}
                      <div className="aspect-square bg-linear-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                        <div className="text-4xl text-gray-400">🛍️</div>

                        {/* نشانگرهای محصول */}
                        <div className="absolute top-2 right-2 flex flex-col gap-2">
                          {product.discount > 0 && (
                            <Badge className="bg-red-500 text-white border-0 text-xs">
                              %{product.discount}
                            </Badge>
                          )}
                          {product.isNew && (
                            <Badge
                              variant="secondary"
                              className="bg-green-500 text-white border-0 text-xs"
                            >
                              جدید
                            </Badge>
                          )}
                          {product.isBestseller && (
                            <Badge
                              variant="secondary"
                              className="bg-orange-500 text-white border-0 text-xs"
                            >
                              پرفروش
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* برند محصول */}
                      <div className="absolute bottom-2 right-2">
                        <span className="text-xs bg-black/70 text-white px-2 py-1 rounded">
                          {product.brand}
                        </span>
                      </div>
                    </div>

                    <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2 h-14 leading-relaxed">
                      {product.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-4">
                    {/* رتبه‌بندی و نظرات */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <span className="text-yellow-400 text-lg">★</span>
                        <span className="text-sm font-medium mx-1 text-gray-700">
                          {product.rating}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        ({product.reviews} نظر)
                      </span>
                    </div>

                    {/* قیمت‌ها */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xl font-bold text-gray-900">
                        {product.price.toLocaleString('fa-IR')} تومان
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.originalPrice.toLocaleString('fa-IR')}
                        </span>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="p-4 pt-0">
                    <Button
                      asChild
                      className="w-full bg-primary hover:bg-primary/90 text-white py-2.5"
                    >
                      <a href={`/products/${slugs.join('/')}/${product.id}`}>
                        افزودن به سبد خرید
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* صفحه‌بندی */}
            <div className="flex justify-center items-center gap-2 mt-12">
              <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50">
                <svg
                  className="w-5 h-5"
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

              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 flex items-center justify-center border rounded-lg ${
                    page === 1
                      ? 'bg-primary text-white border-primary'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50">
                <svg
                  className="w-5 h-5"
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
