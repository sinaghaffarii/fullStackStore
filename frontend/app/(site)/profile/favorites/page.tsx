'use client';

import { Heart } from 'lucide-react';
import { useState } from 'react';

import { EmptyState } from '../+components/EmptyState';
import { FavoriteProductCard } from '../+components/FavoriteProductCard';
import { SectionHeader } from '../+components/SectionHeader';

const mockFavorites = [
  {
    id: '1',
    name: 'کرم ضد آفتاب لافارر SPF50',
    price: 450000,
    originalPrice: 550000,
    imageUrl: '/products/sunscreen.jpg',
    slug: 'lafarrer-sunscreen-spf50',
    inStock: true,
  },
  {
    id: '2',
    name: 'سرم ویتامین C اوریفلیم',
    price: 380000,
    originalPrice: 480000,
    imageUrl: '/products/serum.jpg',
    slug: 'oriflame-vitamin-c-serum',
    inStock: true,
  },
  {
    id: '3',
    name: 'ماسک صورت هیدراتاسیون',
    price: 220000,
    imageUrl: '/products/mask.jpg',
    slug: 'hydration-face-mask',
    inStock: false,
  },
];

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(mockFavorites);

  const handleRemove = async (id: string) => {
    await await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddToCart = async (id: string) => {
    // منطق افزودن به سبد خرید
    console.log('Added to cart:', id);
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="علاقه مندی های من"
        icon={<Heart className="size-5" />}
      />

      {favorites.length === 0 ? (
        <EmptyState message="محصولی در لیست علاقه‌مندی‌های شما وجود ندارد" />
      ) : (
        <>
          <div className="flex items-center justify-between border-b border-gray-100 pb-2 text-sm text-gray-600">
            <span>{favorites.length} محصول</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favorites.map((product) => (
              <FavoriteProductCard
                key={product.id}
                {...product}
                onAddToCart={handleAddToCart}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
