'use client';

import { ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/src/lib/utils';

interface FavoriteProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  slug: string;
  inStock?: boolean;
  onRemove?: (id: string) => void;
  onAddToCart?: (id: string) => void;
}

export const FavoriteProductCard = ({
  id,
  name,
  price,
  originalPrice,
  imageUrl,
  slug,
  inStock = true,
  onRemove,
  onAddToCart,
}: FavoriteProductCardProps) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove?.(id);
  };

  const handleAddToCart = async () => {
    await onAddToCart?.(id);
  };

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div
      className={cn(
        'group relative rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-md',
        isRemoving && 'pointer-events-none opacity-50',
      )}
    >
      <button
        aria-label="حذف از علاقه‌مندی‌ها"
        className="group/delete absolute top-3 left-3 z-10 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-red-50"
        type="button"
        onClick={handleRemove}
      >
        <Trash2 className="size-4 text-gray-400 group-hover/delete:text-red-600" />
      </button>

      <Link className="block" href={`/products/${slug}`}>
        <div className="relative mb-4 aspect-square overflow-hidden rounded-lg bg-gray-50">
          <Image
            fill
            alt={name}
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            src={imageUrl}
          />

          {discount > 0 && (
            <div className="absolute top-2 right-2 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white">
              {discount}%
            </div>
          )}

          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-800">
                ناموجود
              </span>
            </div>
          )}
        </div>

        <h3 className="mb-3 line-clamp-2 min-h-10 text-sm font-medium text-gray-800">
          {name}
        </h3>
      </Link>

      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex flex-col gap-1">
          {originalPrice && (
            <span className="text-xs text-gray-400 line-through">
              {originalPrice.toLocaleString('fa-IR')} تومان
            </span>
          )}
          <span className="text-base font-bold text-gray-900">
            {price.toLocaleString('fa-IR')} تومان
          </span>
        </div>

        <Button
          size="sm"
          disabled={!inStock}
          onClick={handleAddToCart}
          className={cn(
            'h-9 px-3',
            inStock
              ? 'bg-rose-600 text-white hover:bg-rose-700'
              : 'cursor-not-allowed bg-gray-200 text-gray-500',
          )}
        >
          <ShoppingCart className="ml-1.5 size-4" />
          افزودن
        </Button>
      </div>
    </div>
  );
};
