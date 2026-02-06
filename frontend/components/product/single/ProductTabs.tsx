'use client';

import type { Product } from '@/types/product';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { cn } from '@/lib/utils';

import { ProductReviews } from './ProductReviews';
import { ProductSpecs } from './ProductSpecs';

interface ProductDetail extends Product {
  specifications?: Record<string, string>;
  highlights?: string[];
}

interface ProductTabsProps {
  product: ProductDetail;
  className?: string;
}

const convertSpecsToArray = (
  specs?: Record<string, string>,
): { label: string; value: string }[] => {
  if (!specs) return [];

  return Object.entries(specs).map(([key, value]) => ({
    label: key,
    value,
  }));
};

export function ProductTabs({ product, className }: ProductTabsProps) {
  const specificationsArray = convertSpecsToArray(product.specifications);

  return (
    <section dir="rtl" className={cn('', className)}>
      <Tabs dir="rtl" defaultValue="description">
        {/* لیست تب‌ها */}
        <TabsList className="w-full justify-start">
          <TabsTrigger value="description">معرفی</TabsTrigger>
          <TabsTrigger value="specs">مشخصات</TabsTrigger>
          <TabsTrigger value="reviews">
            دیدگاه‌ها ({product.review_count})
          </TabsTrigger>
        </TabsList>

        {/* محتوای تب معرفی */}
        <TabsContent className="mt-6" value="description">
          <DescriptionContent product={product} />
        </TabsContent>

        {/* محتوای تب مشخصات */}
        <TabsContent className="mt-6" value="specs">
          <ProductSpecs specifications={specificationsArray} />
        </TabsContent>

        {/* محتوای تب دیدگاه‌ها */}
        <TabsContent className="mt-6" value="reviews">
          <ProductReviews
            rating={Number(product.rating)}
            count={product.review_count}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}

function DescriptionContent({ product }: { product: ProductDetail }) {
  return (
    <div className="space-y-6 text-right">
      {/* توضیحات محصول */}
      <p className="leading-relaxed text-gray-600">
        {product.description ?? 'توضیحاتی برای این محصول ثبت نشده است.'}
      </p>

      {/* نکات برجسته محصول */}
      {product.highlights && product.highlights.length > 0 && (
        <ul className="space-y-2">
          {product.highlights.map((item: string) => (
            <li className="flex items-start gap-2 text-gray-600" key={item}>
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gray-400" />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
