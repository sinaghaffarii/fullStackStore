'use client';

import { useState } from 'react';

import type { Product } from '@/types/product';

import { UnifiedProductCard } from '@/components/ui/UnifiedProductCard';

import { EmptyState } from '../+components/EmptyState';
import { SectionHeader } from '../+components/SectionHeader';

const mockFavorites: Product[] = [
  {
    id: 1,
    slug: 'smok-novo-x',
    name: 'پاد سیستم اسموک نوو ایکس',
    description: 'پاد سیستم حرفه‌ای با طراحی جمع‌وجور و طعم‌دهی عالی',
    price: 350_000,
    originalPrice: 450_000,
    discount: 22,
    base_price: 350_000,
    image: '/images/products/defaultImage.jpg',
    images: ['/images/products/defaultImage.jpg'],
    rating: '4.5',
    reviews: 128,
    isNew: false,
    isBestseller: true,
    brand: 'SMOK',
    category: 'pod-system',
    inStock: true,
    stock: 12,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    slug: 'mat-foundation',
    name: 'کرم پودر مات',
    description: 'کرم پودر مات با پوشش بالا مناسب پوست چرب',
    price: 420_000,
    originalPrice: 550_000,
    discount: 24,
    base_price: 420_000,
    image: '/images/products/defaultImage.jpg',
    images: ['/images/products/defaultImage.jpg'],
    rating: '4.2',
    reviews: 64,
    isNew: true,
    isBestseller: false,
    brand: 'UWELL',
    category: 'makeup',
    inStock: true,
    stock: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(mockFavorites);

  const handleRemove = async (id: number) => {
    await await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddToCart = async (id: number) => {
    // منطق افزودن به سبد خرید
    console.log('Added to cart:', id);
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
              <UnifiedProductCard
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
