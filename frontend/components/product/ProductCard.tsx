'use client';

import { Heart, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useRef } from 'react';

import type { Product } from '@/src/types/product';

import { useLazyLoad } from '@/src/hooks/useIntersectionObserver';
import { cn } from '@/src/lib/utils';

import { Button } from '../ui/button';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

// eslint-disable-next-line complexity
export const ProductCard = memo(function ProductCard({
  product: {
    id,
    name,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    base_price,
    originalPrice,
    discount,
    description,
    images,
    brand,
    rating,
    reviews,
  },
  priority = false,
}: ProductCardProps) {
  const PLACEHOLDER_IMAGE = '/images/placeholder.jpg';
  const cardRef = useRef<HTMLDivElement>(null);
  const [lazyRef, isVisible] = useLazyLoad<HTMLDivElement>(cardRef);

  const hasDiscount =
    discount !== undefined && discount !== null && discount > 0;
  const finalPrice = hasDiscount ? base_price : originalPrice || base_price;

  const shouldShowOriginalPrice =
    originalPrice !== undefined &&
    originalPrice !== null &&
    originalPrice > 0 &&
    hasDiscount &&
    originalPrice > finalPrice;

  const shouldShowDiscount =
    discount !== undefined &&
    discount !== null &&
    discount > 0 &&
    discount < 100;

  return (
    <div
      className="group transform overflow-hidden rounded-lg border border-slate-100 bg-white shadow-lg transition-all duration-500 hover:border-indigo-100 hover:shadow-2xl"
      itemType="https://schema.org/Product"
      ref={lazyRef}
      itemScope
    >
      <Link className="block" href={`/products/${id}`}>
        <div className="relative aspect-square overflow-hidden bg-linear-to-br to-slate-50">
          {isVisible && (
            <Image
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              alt={name}
              className="object-cover transition-transform duration-400 group-hover:scale-105"
              src={images?.[0] || PLACEHOLDER_IMAGE}
              loading={priority ? 'eager' : 'lazy'}
              priority={priority}
            />
          )}

          <div className="absolute top-3 left-3 opacity-0 transition-all delay-200 duration-500 group-hover:opacity-100">
            <Button
              className="transform rounded-xl bg-white/90 p-2 text-slate-700 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-white hover:text-rose-500"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Add to wishlist logic
              }}
            >
              <Heart className="size-4" />
            </Button>
          </div>
        </div>

        <div className="px-5 pt-2">
          {/* Brand */}
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">{brand}</p>

            {rating && (
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="size-3 fill-current" />
                <span className="text-xs font-semibold text-slate-700">
                  {rating}
                </span>
                <span className="text-xs text-slate-400">({reviews})</span>
              </div>
            )}
          </div>

          <h4
            className="mb-0 line-clamp-2 h-10 leading-6 font-semibold text-slate-800 transition-colors duration-300 group-hover:text-indigo-600"
            itemProp="name"
          >
            {name}
          </h4>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Final Price */}
              <div
                className="text-lg font-semibold text-slate-800"
                itemType="https://schema.org/Offer"
                itemProp="offers"
                itemScope
              >
                <span itemProp="price">{finalPrice.toLocaleString()}</span>
                <span className="mr-1 text-sm" itemProp="priceCurrency">
                  تومان
                </span>
              </div>

              {shouldShowOriginalPrice && (
                <div className="text-sm text-slate-400 line-through">
                  {originalPrice.toLocaleString()}
                </div>
              )}
            </div>

            {shouldShowDiscount && (
              <div
                className={cn(
                  'rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-600',
                )}
              >
                {discount}%
              </div>
            )}
          </div>

          {description && (
            <p
              className="mt-3 line-clamp-2 h-10 text-sm leading-5 text-slate-600"
              itemProp="description"
            >
              {description}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
});
