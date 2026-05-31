'use client';

import { useState } from 'react';

import type { CreateProductDto, ProductImage } from '@/types/product';

import { ProductCard } from '@/components/ui/ProductCard';

import { EmptyState } from '../+components/EmptyState';
import { SectionHeader } from '../+components/SectionHeader';

const defaultProductImage: ProductImage = {
  id: 'default-image-id',
  url: '/images/products/defaultImage.jpg',
  is_primary: false,
};

const mockFavorites: CreateProductDto[] = [
  {
    id: '1', // ✅ string
    slug: 'smok-novo-x',
    name: 'پاد سیستم اسموک نوو ایکس',
    description: 'پاد سیستم حرفه‌ای با طراحی جمع‌وجور و طعم‌دهی عالی',
    base_price: 450_000,
    final_price: 350_000,
    discount_percent: 22,
    primary_image: '/images/products/defaultImage.jpg',
    images: [defaultProductImage],
    rating: 4.5, // ✅ number
    review_count: 128,
    is_new: false,
    is_featured: true,
    brand: { id: 'brand-smok', name: 'SMOK', name_fa: 'اسموک' },
    category: { id: 'cat-pod-system', name: 'پاد سیستم', slug: 'pod-system' },
    stock_status: 'IN_STOCK',
    colors: [],
    sizes: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2', // ✅ string
    slug: 'mat-foundation',
    name: 'کرم پودر مات',
    description: 'کرم پودر مات با پوشش بالا مناسب پوست چرب',
    base_price: 550_000,
    final_price: 420_000,
    discount_percent: 24,
    primary_image: '/images/products/defaultImage.jpg',
    images: [defaultProductImage],
    rating: 4.2, // ✅ number
    review_count: 64,
    is_new: true,
    is_featured: false,
    brand: { id: 'brand-uwell', name: 'UWELL', name_fa: 'یوول' }, // ✅ object
    category: { id: 'cat-makeup', name: 'آرایشی', slug: 'makeup' }, // ✅ object
    stock_status: 'IN_STOCK', // ✅ enum
    colors: [],
    sizes: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(mockFavorites);

  const handleRemove = async (id: string) => {
    // ✅ string
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddToCart = async (id: string) => {
    // ✅ string
    // منطق افزودن به سبد خرید
    // TODO: پیاده‌سازی API call
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="علاقه مندی های من" />

      {favorites.length === 0 ? (
        <EmptyState message="محصولی در لیست علاقه‌مندی‌های شما وجود ندارد" />
      ) : (
        <>
          <div className="flex items-center justify-between border-b border-gray-100 pb-2 text-sm text-gray-600">
            <span>{favorites.length} محصول</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((product) => (
              <ProductCard
                key={product.id}
                mode="favorite"
                onAddToCart={handleAddToCart}
                onQuickView={() => {
                  /* empty */
                }}
                onRemoveFromFavorite={handleRemove}
                product={product}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
