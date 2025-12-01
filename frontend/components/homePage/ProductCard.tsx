/* eslint-disable max-lines */
'use client';

import { Eye, Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

import { cn } from '@/src/lib/utils';

interface ProductCardProps {
  id: number;
  name: string;
  brand: string;
  image: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  href: string;
  onAddToCart?: (id: number) => void;
}

const ActionButton = ({
  icon: Icon,
  label,
  onClick,
  primary = false,
}: {
  icon: any;
  label: string;
  onClick: (e: React.MouseEvent) => void;
  primary?: boolean;
}) => (
  <button
    aria-label={label}
    type="button"
    onClick={onClick}
    className={cn(
      'flex size-10 cursor-pointer items-center justify-center rounded-full transition-all duration-300 hover:scale-110 focus:ring-2 focus:ring-offset-1 focus:outline-none',
      primary
        ? 'bg-black text-white shadow-lg hover:bg-gray-800'
        : 'bg-white text-gray-700 shadow-md hover:bg-gray-50 hover:text-black',
    )}
  >
    <Icon size={18} strokeWidth={2} />
  </button>
);

const PriceDisplay = ({
  original,
  discounted,
  hasDiscount,
}: {
  original: number;
  discounted: number;
  hasDiscount: boolean;
}) => {
  const format = (n: number) => n.toLocaleString('fa-IR');

  return (
    <div className="flex flex-col items-end gap-1">
      {hasDiscount && (
        <span className="text-xs text-gray-400 line-through decoration-red-400/50 decoration-1">
          {format(original)}
        </span>
      )}
      <div className="flex items-center gap-1.5">
        <span className="text-lg font-bold tracking-tight text-gray-900">
          {format(discounted)}
        </span>
        <span className="text-[10px] font-medium text-gray-500">تومان</span>
      </div>
    </div>
  );
};

// --- Main Component ---

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  brand,
  image,
  originalPrice,
  discountedPrice,
  discountPercentage,
  href,
  onAddToCart,
}) => {
  const hasDiscount = discountPercentage > 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.(id);
  };

  return (
    <div className="group relative block h-[390px] w-full overflow-hidden rounded-lg border border-gray-100 bg-white transition-all duration-500">
      {/* Image Section */}
      {/* Image Section inside ProductCard */}
      <a
        className="relative block h-[60%] w-full overflow-hidden bg-white p-4"
        href={href}
      >
        <div className="relative size-full rounded-md bg-gray-200">
          <Image
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt={name}
            src={image || '/placeholder.png'}
          />
          <span className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
            تصویر محصول
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="inline-flex items-center justify-center rounded-sm bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-sm backdrop-blur-md">
              {discountPercentage.toLocaleString('fa-IR')}%
            </span>
          )}
        </div>

        {/* Floating Actions (Appears on Hover) */}
        <div className="absolute right-0 bottom-4 left-0 flex translate-y-10 justify-center gap-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ActionButton
            primary
            label="افزودن به سبد"
            icon={ShoppingCart}
            onClick={handleAddToCart}
          />
          <ActionButton
            label="مشاهده سریع"
            icon={Eye}
            onClick={(e) => {
              e.preventDefault(); /* Open Modal Logic */
            }}
          />
          <ActionButton
            label="افزودن به علاقه مندی"
            icon={Heart}
            onClick={(e) => {
              e.preventDefault();
            }}
          />
        </div>
      </a>

      {/* Content Section */}
      <div className="flex h-[35%] flex-col justify-between p-2">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold tracking-wider text-gray-400 uppercase transition-colors group-hover:text-primary">
            {brand}
          </span>
          <a href={href}>
            <h3
              className="line-clamp-2 text-sm leading-relaxed font-medium text-gray-800 transition-colors group-hover:text-black"
              title={name}
            >
              {name}
            </h3>
          </a>
        </div>

        <div className="flex items-end justify-between border-t border-gray-50 pt-3">
          {/* Rating or Extra info can go here */}
          <div className="text-xs text-gray-400">⭐ 4.5</div>
          <PriceDisplay
            discounted={discountedPrice}
            hasDiscount={hasDiscount}
            original={originalPrice}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
