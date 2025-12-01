'use client';

import type { ProductDetail } from '@/src/types/product';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/src/lib/utils';

import { ProductReviews } from './ProductReviews';
import { ProductSpecs } from './ProductSpecs';

interface ProductTabsProps {
  product: ProductDetail;
  className?: string;
}

export function ProductTabs({ product, className }: ProductTabsProps) {
  return (
    <section dir="rtl" className={cn('', className)}>
      <Tabs dir="rtl" defaultValue="description">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="description">معرفی</TabsTrigger>
          <TabsTrigger value="specs">مشخصات</TabsTrigger>
          <TabsTrigger value="reviews">
            دیدگاه‌ها ({product.reviews})
          </TabsTrigger>
        </TabsList>

        <TabsContent className="mt-6" value="description">
          <DescriptionContent product={product} />
        </TabsContent>

        <TabsContent className="mt-6" value="specs">
          <ProductSpecs specifications={product.specifications} />
        </TabsContent>

        <TabsContent className="mt-6" value="reviews">
          <ProductReviews
            rating={Number(product.rating)}
            count={product.reviews}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}

function DescriptionContent({ product }: { product: ProductDetail }) {
  return (
    <div className="space-y-6 text-right">
      <p className="leading-relaxed text-gray-600">{product.description}</p>

      {product.highlights && product.highlights.length > 0 && (
        <ul className="space-y-2">
          {product.highlights.map((item) => (
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
