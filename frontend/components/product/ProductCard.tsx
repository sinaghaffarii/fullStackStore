'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo, useRef } from 'react';

import type { Product } from '@/src/types/product';

import { useLazyLoad } from '@/src/hooks/useIntersectionObserver';
import { Heart, ShoppingBag, Star, Zap, Crown } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/src/lib/utils';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard = memo(function ProductCard({
  product: {
    id,
    name,
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
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 hover:border-indigo-100 overflow-hidden transform "
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
              className="object-cover group-hover:scale-105 transition-transform duration-400"
              src={images?.[0] || PLACEHOLDER_IMAGE}
              loading={priority ? 'eager' : 'lazy'}
              priority={priority}
            />
          )}

          <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
            <Button
              className="bg-white/90 hover:bg-white text-slate-700 hover:text-rose-500 p-2 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Add to wishlist logic
              }}
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="px-5 pt-2">
          {/* Brand */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-500 font-medium">{brand}</p>

            {rating && (
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-3 h-3 fill-current" />
                <span className="text-xs font-semibold text-slate-700">
                  {rating}
                </span>
                <span className="text-xs text-slate-400">({reviews})</span>
              </div>
            )}
          </div>

          <h4
            className="font-semibold text-slate-800 mb-0 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-300 h-10 leading-6"
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
                <span className="text-sm mr-1" itemProp="priceCurrency">
                  تومان
                </span>
              </div>

              {shouldShowOriginalPrice && (
                <div className="text-slate-400 text-sm line-through">
                  {originalPrice.toLocaleString()}
                </div>
              )}
            </div>

            {shouldShowDiscount && (
              <div
                className={cn(
                  'bg-rose-50 text-rose-600 text-xs font-semibold px-2 py-1 rounded-lg border border-rose-200',
                )}
              >
                {discount}%
              </div>
            )}
          </div>

          {description && (
            <p
              className="text-slate-600 text-sm mt-3 line-clamp-2 leading-5 h-10"
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
