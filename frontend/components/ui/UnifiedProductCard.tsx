/* eslint-disable max-lines */
'use client';

import { Eye, Heart, ShoppingCart, Star, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { memo, useRef } from 'react';

import type { Product } from '@/types/product';

import { Button } from '@/components/ui/Button';
import { useLazyLoad } from '@/hooks/useIntersectionObserver';

type Mode = 'carousel' | 'catalog' | 'favorite';

interface Props {
  product: Product;
  mode?: Mode;
  priority?: boolean;
  onAddToCart?: (id: number) => Promise<void>;
  onQuickView?: (id: number) => void;
  onLike?: (id: number) => void;
  onRemoveFromFavorite?: (id: number) => void;
}

const FALLBACK_IMAGE = '/images/products/defaultImage.jpg';

const stop = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

const actionsForMode = (mode: Mode) => ({
  cart: mode !== 'favorite',
  quick: mode === 'carousel',
  like: mode !== 'favorite',
  remove: mode === 'favorite',
});

const ActionButtons = ({
  id,
  show,
  onAddToCart,
  onQuickView,
  onLike,
  onRemove,
}: {
  id: number;
  show: ReturnType<typeof actionsForMode>;
  onAddToCart?: (id: number) => void;
  onQuickView?: (id: number) => void;
  onLike?: (id: number) => void;
  onRemove?: (id: number) => void;
}) => (
  <div className="absolute inset-x-2 bottom-2 flex justify-center gap-2 opacity-0 transition group-hover:opacity-100">
    {show.cart && onAddToCart && (
      <Button
        size="icon"
        onClick={(e) => {
          stop(e);
          onAddToCart(id);
        }}
      >
        <ShoppingCart className="size-4" />
      </Button>
    )}

    {show.quick && onQuickView && (
      <Button
        size="icon"
        variant="outline"
        onClick={(e) => {
          stop(e);
          onQuickView(id);
        }}
      >
        <Eye className="size-4" />
      </Button>
    )}

    {show.like && onLike && (
      <Button
        size="icon"
        variant="outline"
        onClick={(e) => {
          stop(e);
          onLike(id);
        }}
      >
        <Heart className="size-4" />
      </Button>
    )}

    {show.remove && onRemove && (
      <Button
        size="icon"
        variant="destructive"
        onClick={(e) => {
          stop(e);
          onRemove(id);
        }}
      >
        <Trash2 className="size-4" />
      </Button>
    )}
  </div>
);

/* ---------------- component ---------------- */

export const UnifiedProductCard = memo(function UnifiedProductCard({
  product,
  mode = 'catalog',
  priority = false,
  onAddToCart,
  onQuickView,
  onLike,
  onRemoveFromFavorite,
}: Props) {
  const { id, name, brand, rating, reviews, image, originalPrice, discount } =
    product;

  const basePrice = product.base_price;
  const ref = useRef<HTMLDivElement>(null);
  const [lazyRef, visible] = useLazyLoad<HTMLDivElement>(ref);

  const hasDiscount = Boolean(discount && discount > 0);
  const price = hasDiscount ? basePrice : (originalPrice ?? basePrice);
  const showActions = actionsForMode(mode);

  return (
    <div
      className="group w-full overflow-hidden rounded-lg border border-gray-200/70 bg-white transition hover:shadow-md"
      ref={lazyRef}
    >
      <Link className="block" href={`/products/${id}`}>
        {/* image */}
        <div className="relative aspect-square w-full">
          {visible && (
            <Image
              fill
              alt={name}
              className="bg-white object-contain p-2 transition-transform duration-300 group-hover:scale-105"
              src={image || FALLBACK_IMAGE}
              loading={priority ? 'eager' : 'lazy'}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
              }}
              priority={priority}
            />
          )}

          {hasDiscount && (
            <span className="absolute top-2 right-2 rounded-md bg-rose-600 px-2 py-1 text-xs font-bold text-white">
              {discount}%
            </span>
          )}

          <ActionButtons
            id={id}
            onAddToCart={onAddToCart}
            onLike={onLike}
            onQuickView={onQuickView}
            onRemove={onRemoveFromFavorite}
            show={showActions}
          />
        </div>

        {/* content */}
        <div className="p-3">
          <div className="mb-1 flex justify-between text-xs text-gray-500">
            <span>{brand}</span>
            {rating && (
              <span className="flex items-center gap-1">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                {rating} ({reviews})
              </span>
            )}
          </div>

          <h3 className="line-clamp-2 text-sm font-medium">{name}</h3>

          <div className="mt-2 flex items-center gap-2">
            <span className="font-semibold">
              {price.toLocaleString()} تومان
            </span>
            {hasDiscount && originalPrice && (
              <span className="text-sm text-gray-400 line-through">
                {originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
});
