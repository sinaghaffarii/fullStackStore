/* eslint-disable max-lines */
'use client';

import { Check, Flame, Minus, Plus, Sparkles, Star } from 'lucide-react';
import { useState } from 'react';

import type {
  ProductColor,
  ProductDetail,
  StockStatus,
} from '@/src/types/product';

import { Button } from '@/components/ui/button';
import {
  cn,
  formatPrice,
  getStockLabel,
  getStockStatus,
} from '@/src/lib/utils';

interface ProductInfoProps {
  product: ProductDetail;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    product.colors?.[0] ?? null,
  );
  const [quantity, setQuantity] = useState(1);

  const stockStatus = getStockStatus(product);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {product.brandFa ?? product.brand}
          </span>
          {product.isNew && (
            <Badge text="جدید" variant="blue" icon={Sparkles} />
          )}
          {product.isBestseller && (
            <Badge text="پرفروش" variant="orange" icon={Flame} />
          )}
        </div>

        <h1 className="mt-2 text-2xl font-bold text-gray-900 lg:text-3xl">
          {product.name}
        </h1>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="size-4 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-sm text-gray-400">
            ({product.reviews} دیدگاه)
          </span>
        </div>
      </header>

      {product.colors && product.colors.length > 0 && (
        <section>
          <p className="mb-3 text-sm font-medium text-gray-700">انتخاب مدل</p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <ColorButton
                isSelected={selectedColor?.id === color.id}
                key={color.id}
                color={color}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </section>
      )}

      {product.features && product.features.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.features.map((feature) => (
            <span
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
              key={feature}
            >
              <Check className="size-3" />
              {feature}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto space-y-4 rounded-2xl bg-gray-50 p-5">
        <PriceSection product={product} stockStatus={stockStatus} />

        <div className="flex gap-3">
          <QuantitySelector
            disabled={stockStatus === 'out-of-stock'}
            value={quantity}
            onChange={setQuantity}
          />
          <Button
            size="lg"
            className="flex-1 text-base"
            disabled={stockStatus === 'out-of-stock'}
          >
            افزودن به سبد خرید
          </Button>
        </div>
      </div>

      {/* Mobile Fixed Bar */}
      <MobileBar product={product} />
    </div>
  );
}

// Sub-components
function Badge({
  icon: Icon,
  text,
  variant,
}: {
  icon: React.ElementType;
  text: string;
  variant: 'blue' | 'orange';
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
        variant === 'blue' && 'bg-blue-50 text-blue-600',
        variant === 'orange' && 'bg-orange-50 text-orange-600',
      )}
    >
      <Icon className="size-3" />
      {text}
    </span>
  );
}

function ColorButton({
  color,
  isSelected,
  onClick,
}: {
  color: ProductColor;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all',
        isSelected
          ? 'border-gray-900 bg-gray-900 text-white'
          : 'border-gray-200 hover:border-gray-300',
      )}
    >
      <span
        className="size-4 rounded-full border border-white/20"
        style={{ backgroundColor: color.code }}
      />
      {color.value}
    </button>
  );
}

function PriceSection({
  product,
  stockStatus,
}: {
  product: ProductDetail;
  stockStatus: StockStatus;
}) {
  return (
    <div className="flex items-end justify-between">
      <div>
        {product.discount > 0 && (
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-md bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
              {product.discount}%
            </span>
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          </div>
        )}
        <p className="text-3xl font-bold text-gray-900">
          {formatPrice(product.price)}
          <span className="mr-1 text-sm font-normal text-gray-500">تومان</span>
        </p>
      </div>

      <span
        className={cn(
          'text-sm font-medium',
          stockStatus === 'in-stock' && 'text-emerald-600',
          stockStatus === 'low-stock' && 'text-amber-600',
          stockStatus === 'out-of-stock' && 'text-red-500',
        )}
      >
        {getStockLabel(stockStatus)}
      </span>
    </div>
  );
}

function QuantitySelector({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex h-12 items-center rounded-lg border border-gray-200 bg-white">
      <button
        className="flex size-12 items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-40"
        disabled={disabled || value <= 1}
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        <Minus className="size-4" />
      </button>
      <span className="w-10 text-center font-medium">{value}</span>
      <button
        className="flex size-12 items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-40"
        disabled={disabled}
        type="button"
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}

function MobileBar({ product }: { product: ProductDetail }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t bg-white px-4 py-3 shadow-lg lg:hidden">
      <div>
        {product.discount > 0 && (
          <p className="text-xs text-gray-400 line-through">
            {formatPrice(product.originalPrice)}
          </p>
        )}
        <p className="text-lg font-bold text-gray-900">
          {formatPrice(product.price)}
          <span className="mr-1 text-xs font-normal">تومان</span>
        </p>
      </div>
      <Button className="px-8">افزودن به سبد</Button>
    </div>
  );
}
