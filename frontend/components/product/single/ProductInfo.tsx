/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
'use client';

import {
  Check,
  Flame,
  RotateCcw,
  ShieldCheck,
  Star,
  Truck,
} from 'lucide-react';
import { useMemo, useState } from 'react';

import type { Product } from '@/src/types/product';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/src/lib/utils';

type ProductDetail = Product & {
  title?: string;
  brandFa?: string;
  reviewsCount?: number;
  colors?: { id: number; name: string; code: string; value: string }[];
  features?: string[];
  stockStatus?: 'in-stock' | 'low-stock' | 'out-of-stock';
};

interface ProductInfoProps {
  product: ProductDetail;
}

// eslint-disable-next-line complexity
export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] ?? { id: 0, name: '', code: '#fff', value: '' },
  );
  const [quantity, setQuantity] = useState(1);

  const formattedPrice = useMemo(
    () => product.price.toLocaleString('fa-IR'),
    [product.price],
  );
  const formattedOriginPrice = useMemo(
    () => product.originalPrice.toLocaleString('fa-IR'),
    [product.originalPrice],
  );

  const stockStatus =
    product.stockStatus ??
    (product.stock && product.stock > 5
      ? 'in-stock'
      : product.stock && product.stock > 0
        ? 'low-stock'
        : 'out-of-stock');

  const stockLabel =
    stockStatus === 'in-stock'
      ? 'موجود در انبار مرکزی'
      : stockStatus === 'low-stock'
        ? 'تنها چند عدد باقی مانده'
        : 'ناموجود';

  return (
    <article className="flex flex-col gap-8 rounded-lg bg-white/80 p-6 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)] backdrop-blur-sm">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <Badge
            className="rounded-full bg-blue-50 text-blue-600"
            variant="secondary"
          >
            {product.brandFa ?? product.brand}
          </Badge>
          <span>/</span>
          <span>{product.brand}</span>
          <span className="flex items-center gap-1 text-emerald-600">
            <Check className="size-4" />
            ضمانت اصالت کالا
          </span>
        </div>

        <h1 className="text-3xl leading-tight font-black text-gray-900">
          {product.title ?? product.name}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-1 font-semibold text-gray-900">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            {product.rating}
          </div>
          <Separator className="h-4 bg-gray-200" orientation="vertical" />
          <button className="text-gray-500 hover:text-gray-900" type="button">
            {product.reviewsCount ?? product.reviews} دیدگاه ثبت شده
          </button>
          <Separator className="h-4 bg-gray-200" orientation="vertical" />
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-600">
            ۸۵٪ رضایت کاربران
          </span>
        </div>
      </header>

      {product.colors?.length ? (
        <section>
          <div className="mb-3 flex items-center justify-between text-sm font-semibold">
            <span>انتخاب مدل</span>
            <span className="text-gray-500">{selectedColor.name}</span>
          </div>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => setSelectedColor(color)}
                className={cn(
                  'group flex items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-all',
                  selectedColor.id === color.id
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 hover:border-gray-400',
                )}
              >
                <span
                  className="size-6 rounded-full border border-white/30 shadow-sm"
                  style={{ backgroundColor: color.code }}
                />
                {color.value}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {product.features?.length ? (
        <section className="grid gap-3 text-sm text-gray-600 md:grid-cols-2">
          {product.features.map((feature) => (
            <div className="flex items-center gap-2" key={feature}>
              <Flame className="size-4 text-rose-400" />
              {feature}
            </div>
          ))}
        </section>
      ) : null}

      <section className="space-y-5 rounded-lg border border-gray-100 bg-gray-50/80 p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            {product.discount > 0 && (
              <div className="mb-1 flex items-center gap-2 text-sm text-gray-400">
                <Badge
                  className="rounded-xl px-2 text-xs"
                  variant="destructive"
                >
                  {product.discount}٪
                </Badge>
                <del>{formattedOriginPrice}</del>
              </div>
            )}
            <p className="text-4xl font-black text-gray-900">
              {formattedPrice}{' '}
              <span className="text-base font-medium text-gray-500">تومان</span>
            </p>
          </div>
          <span
            className={cn(
              'text-sm font-semibold',
              stockStatus === 'in-stock' && 'text-emerald-600',
              stockStatus === 'low-stock' && 'text-amber-600',
              stockStatus === 'out-of-stock' && 'text-red-500',
            )}
          >
            {stockLabel}
          </span>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex h-12 w-36 items-center justify-between rounded-lg border border-gray-200 bg-white px-3">
            <button
              aria-label="افزایش تعداد"
              className="text-lg font-bold text-gray-800"
              type="button"
              onClick={() => setQuantity((prev) => prev + 1)}
            >
              +
            </button>
            <span className="text-lg font-bold">{quantity}</span>
            <button
              aria-label="کاهش تعداد"
              className="text-lg font-bold text-gray-800"
              type="button"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
            >
              –
            </button>
          </div>

          <Button className="h-12 flex-1 rounded-lg text-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40">
            افزودن به سبد خرید
          </Button>
        </div>
      </section>

      <section className="grid gap-4 border-t pt-6 sm:grid-cols-3">
        {[
          { icon: ShieldCheck, text: 'ضمانت اصالت کالا' },
          { icon: Truck, text: 'ارسال سریع و مطمئن' },
          { icon: RotateCcw, text: '۷ روز ضمانت بازگشت' },
        ].map(({ icon: Icon, text }) => (
          <div
            className="flex flex-col items-center gap-2 rounded-lg bg-slate-50/80 p-4 text-center text-xs text-gray-600"
            key={text}
          >
            <Icon className="size-6 text-gray-400" />
            {text}
          </div>
        ))}
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t bg-white/95 px-4 py-3 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.2)] lg:hidden">
        <div>
          <p className="text-xs text-gray-400 line-through">
            {formattedOriginPrice}
          </p>
          <p className="text-lg font-bold text-gray-900">
            {formattedPrice} <span className="text-xs font-medium">تومان</span>
          </p>
        </div>
        <Button className="rounded-lg px-8">افزودن به سبد</Button>
      </div>
    </article>
  );
}
