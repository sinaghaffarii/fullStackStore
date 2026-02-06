/* eslint-disable max-lines */
'use client';

import { Check, Flame, Minus, Plus, Sparkles, Star } from 'lucide-react';
import { useState } from 'react';

import type { Product, StockStatus } from '@/types/product';

import { Button } from '@/components/ui/Button';
import { cn, formatPrice, getStockLabel } from '@/lib/utils';

interface ProductColor {
  label: string;
  value: string;
}

interface ProductInfoProps {
  product: Product;
}

const mapStockStatus = (
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK',
): StockStatus => {
  const statusMap = {
    IN_STOCK: 'in-stock',
    LOW_STOCK: 'low-stock',
    OUT_OF_STOCK: 'out-of-stock',
  } as const;

  return statusMap[status];
};

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    product.colors?.[0] ?? null,
  );
  const [quantity, setQuantity] = useState(1);

  const stockStatus = mapStockStatus(product.stock_status);

  return (
    <div className="flex flex-col gap-6">
      <header>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {product.brand?.name_fa ?? product.brand?.name ?? 'بدون برند'}
          </span>
          {product.is_new && (
            <Badge text="جدید" variant="blue" icon={Sparkles} />
          )}
          {product.is_featured && (
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
            ({product.review_count} دیدگاه)
          </span>
        </div>
      </header>

      {product.colors && product.colors.length > 0 && (
        <section>
          <p className="mb-3 text-sm font-medium text-gray-700">انتخاب مدل</p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((color) => (
              <ColorButton
                isSelected={selectedColor?.value === color.value}
                key={color.value}
                color={color}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
        </section>
      )}

      {/* نمایش توضیحات به عنوان feature */}
      {product.description && (
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
            <Check className="size-3" />
            {product.description}
          </span>
        </div>
      )}

      {/* بخش قیمت و افزودن به سبد */}
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

      {/* نوار ثابت موبایل */}
      <MobileBar product={product} />
    </div>
  );
}

/**
 * کامپوننت Badge برای نمایش برچسب‌های "جدید" و "پرفروش"
 */
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

/**
 * کامپوننت ColorButton برای نمایش و انتخاب رنگ
 * رنگ انتخاب شده با background سیاه و متن سفید نمایش داده می‌شود
 */
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
      {/* دایره رنگی */}
      <span
        className="size-4 rounded-full border border-white/20"
        style={{ backgroundColor: color.value }}
      />
      {color.label}
    </button>
  );
}

/**
 * کامپوننت PriceSection برای نمایش قیمت، تخفیف و وضعیت موجودی
 */
function PriceSection({
  product,
  stockStatus,
}: {
  product: Product;
  stockStatus: StockStatus;
}) {
  const hasDiscount = product.discount_percent > 0;

  return (
    <div className="flex items-end justify-between">
      <div>
        {/* نمایش تخفیف و قیمت اصلی */}
        {hasDiscount && (
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-md bg-red-500 px-2 py-0.5 text-xs font-bold text-white">
              {product.discount_percent}%
            </span>
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.base_price)}
            </span>
          </div>
        )}

        {/* قیمت نهایی */}
        <p className="text-3xl font-bold text-gray-900">
          {formatPrice(product.final_price)}
          <span className="mr-1 text-sm font-normal text-gray-500">تومان</span>
        </p>
      </div>

      {/* وضعیت موجودی */}
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

/**
 * کامپوننت QuantitySelector برای انتخاب تعداد محصول
 * شامل دکمه‌های + و - برای افزایش و کاهش تعداد
 */
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
      {/* دکمه کاهش */}
      <button
        className="flex size-12 items-center justify-center text-gray-500 hover:text-gray-900 disabled:opacity-40"
        disabled={disabled || value <= 1}
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
      >
        <Minus className="size-4" />
      </button>

      {/* نمایش تعداد */}
      <span className="w-10 text-center font-medium">{value}</span>

      {/* دکمه افزایش */}
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

/**
 * کامپوننت MobileBar برای نمایش نوار ثابت در پایین صفحه در موبایل
 * شامل قیمت و دکمه افزودن به سبد
 */
function MobileBar({ product }: { product: Product }) {
  const hasDiscount = product.discount_percent > 0;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t bg-white px-4 py-3 shadow-lg lg:hidden">
      <div>
        {/* قیمت اصلی با خط خورده */}
        {hasDiscount && (
          <p className="text-xs text-gray-400 line-through">
            {formatPrice(product.base_price)}
          </p>
        )}

        {/* قیمت نهایی */}
        <p className="text-lg font-bold text-gray-900">
          {formatPrice(product.final_price)}
          <span className="mr-1 text-xs font-normal">تومان</span>
        </p>
      </div>

      {/* دکمه افزودن به سبد */}
      <Button className="px-8">افزودن به سبد</Button>
    </div>
  );
}
