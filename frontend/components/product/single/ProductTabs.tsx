'use client';

import { FileText, ListFilter, MessageSquare } from 'lucide-react';

import type { Product } from '@/src/types/product';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { ProductReviews } from './ProductReviews';
import { ProductSpecs } from './ProductSpecs';

type ProductDetail = Product & {
  highlights?: string[];
  reviewsCount?: number;
};

interface ProductTabsProps {
  product: ProductDetail;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const highlights = product.highlights ?? [];

  return (
    <section className="mt-12 rounded-lg border border-gray-100 bg-white p-4 shadow-sm lg:p-8">
      <Tabs className="w-full" defaultValue="description">
        <TabsList className="flex w-full flex-wrap justify-start gap-6 overflow-x-auto border-b border-gray-200 bg-transparent px-0">
          {[
            { value: 'description', label: 'نقد و بررسی', icon: FileText },
            { value: 'specs', label: 'مشخصات فنی', icon: ListFilter },
            {
              value: 'reviews',
              label: 'دیدگاه کاربران',
              icon: MessageSquare,
              badge: product.reviewsCount ?? product.reviews,
            },
          ].map(({ value, label, icon: Icon, badge }) => (
            <TabsTrigger key={value} value={value}>
              <Icon className="size-4" />
              {label}
              {badge ? <span className="text-base">{badge}</span> : null}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent
          className="mt-8 space-y-6 text-gray-600"
          value="description"
        >
          <h3 className="text-2xl font-black text-gray-900">معرفی محصول</h3>
          <p className="text-justify leading-8">{product.description}</p>
          {highlights.length ? (
            <ul className="grid gap-4 md:grid-cols-2">
              {highlights.map((item) => (
                <li
                  className="rounded-lg bg-slate-50 p-4 text-sm font-medium"
                  key={item}
                >
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </TabsContent>

        <TabsContent className="mt-8" value="specs">
          <ProductSpecs />
        </TabsContent>

        <TabsContent className="mt-8" value="reviews">
          <ProductReviews
            rating={Number(product.rating)}
            count={product.reviewsCount ?? product.reviews}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}
