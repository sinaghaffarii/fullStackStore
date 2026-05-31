/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable max-lines */
'use client';

import { Eye, Heart, ShoppingCart, Star, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { memo, useRef } from 'react';

import type { CreateProductDto } from '@/types/product';

import { Button } from '@/components/ui/Button';
import { useLazyLoad } from '@/hooks/useIntersectionObserver';

type Mode = 'carousel' | 'catalog' | 'favorite';

interface Props {
  product: CreateProductDto;
  mode?: Mode;
  priority?: boolean;
  onAddToCart?: (id: string) => Promise<void>;
  onQuickView?: (id: string) => void;
  onLike?: (id: string) => void;
  onRemoveFromFavorite?: (id: string) => void;
}

const FALLBACK_IMAGE = '/images/products/defaultImage.jpg';

const stopPropagation = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

const getActionsForMode = (mode: Mode) => ({
  cart: mode !== 'favorite',
  quick: mode === 'carousel',
  like: mode !== 'favorite',
  remove: mode === 'favorite',
});

interface ActionButtonsProps {
  id: string;
  show: ReturnType<typeof getActionsForMode>;
  onAddToCart?: (id: string) => void;
  onQuickView?: (id: string) => void;
  onLike?: (id: string) => void;
  onRemove?: (id: string) => void;
}

const ActionButtons = memo(function ActionButtons({
  id,
  show,
  onAddToCart,
  onQuickView,
  onLike,
  onRemove,
}: ActionButtonsProps) {
  return (
    <div className="absolute inset-x-2 bottom-2 flex justify-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
      {show.cart && onAddToCart && (
        <Button
          size="icon"
          aria-label="افزودن به سبد خرید"
          onClick={(e) => {
            stopPropagation(e);
            onAddToCart(id);
          }}
        >
          <ShoppingCart className="size-4" />
        </Button>
      )}

      {show.quick && onQuickView && (
        <Button
          size="icon"
          aria-label="مشاهده سریع"
          variant="outline"
          onClick={(e) => {
            stopPropagation(e);
            onQuickView(id);
          }}
        >
          <Eye className="size-4" />
        </Button>
      )}

      {show.like && onLike && (
        <Button
          size="icon"
          aria-label="افزودن به علاقه‌مندی"
          variant="outline"
          onClick={(e) => {
            stopPropagation(e);
            onLike(id);
          }}
        >
          <Heart className="size-4" />
        </Button>
      )}

      {show.remove && onRemove && (
        <Button
          size="icon"
          aria-label="حذف از علاقه‌مندی"
          variant="destructive"
          onClick={(e) => {
            stopPropagation(e);
            onRemove(id);
          }}
        >
          <Trash2 className="size-4" />
        </Button>
      )}
    </div>
  );
});

const DiscountBadge = memo(function DiscountBadge({
  percent,
}: {
  percent: number;
}) {
  return (
    <span className="absolute top-2 right-2 rounded-md bg-rose-600 px-2 py-1 text-xs font-bold text-white shadow-sm">
      {percent.toLocaleString('fa-IR')}%
    </span>
  );
});

const RatingDisplay = memo(function RatingDisplay({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) {
  return (
    <span className="flex items-center gap-1">
      <Star className="size-3 fill-amber-400 text-amber-400" />
      <span className="text-xs">
        {rating?.toLocaleString('fa-IR')} (
        {reviewCount?.toLocaleString('fa-IR')})
      </span>
    </span>
  );
});

const PriceDisplay = memo(function PriceDisplay({
  finalPrice,
  basePrice,
  hasDiscount,
}: {
  finalPrice: number;
  basePrice: number;
  hasDiscount: boolean;
}) {
  const formatPrice = (price: number) => (price / 10).toLocaleString('fa-IR'); // تبدیل ریال به تومان

  return (
    <div className="mt-2 flex items-center gap-2">
      <span className="font-semibold text-gray-900">
        {formatPrice(finalPrice)} تومان
      </span>
      {hasDiscount && (
        <span className="text-sm text-gray-400 line-through">
          {formatPrice(basePrice)}
        </span>
      )}
    </div>
  );
});

/* ---------------- Main Component ---------------- */

export const ProductCard = memo(function ProductCard({
  product,
  mode = 'catalog',
  priority = false,
  onAddToCart,
  onQuickView,
  onLike,
  onRemoveFromFavorite,
}: Props) {
  const {
    id,
    name,
    brand,
    rating,
    review_count,
    primary_image,
    base_price,
    final_price,
    discount_percent,
  } = product;

  const ref = useRef<HTMLDivElement>(null);
  const [lazyRef, visible] = useLazyLoad<HTMLDivElement>(ref);

  const hasDiscount = Boolean(discount_percent && discount_percent > 0);
  const showActions = getActionsForMode(mode);
  const brandName = brand?.name_fa || brand?.name || 'بدون برند';

  return (
    <div
      className="group w-full overflow-hidden rounded-lg border border-gray-200/70 bg-white transition-shadow duration-300 hover:shadow-md"
      ref={lazyRef}
    >
      <Link className="block" href={`/product/${id}`}>
        {/* Image Section */}
        <div className="relative aspect-square w-full bg-gray-50">
          {visible && (
            <Image
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              alt={name}
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              src={primary_image || FALLBACK_IMAGE}
              loading={priority ? 'eager' : 'lazy'}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
              }}
              priority={priority}
            />
          )}

          {hasDiscount && <DiscountBadge percent={discount_percent} />}

          <ActionButtons
            id={id}
            onAddToCart={onAddToCart}
            onLike={onLike}
            onQuickView={onQuickView}
            onRemove={onRemoveFromFavorite}
            show={showActions}
          />
        </div>

        {/* Content Section */}
        <div className="p-3">
          <div className="mb-1 flex items-center justify-between text-xs text-gray-500">
            <span className="truncate font-medium">{brandName}</span>
            {rating > 0 && (
              <RatingDisplay rating={rating} reviewCount={review_count} />
            )}
          </div>

          <h3
            className="line-clamp-2 min-h-10 text-sm leading-tight font-medium text-gray-800 transition-colors group-hover:text-gray-900"
            title={name}
          >
            {name}
          </h3>

          <PriceDisplay
            basePrice={base_price}
            finalPrice={final_price}
            hasDiscount={hasDiscount}
          />
        </div>
      </Link>
    </div>
  );
});
