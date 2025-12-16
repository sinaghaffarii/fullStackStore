'use client';

import type { Product } from '@/types/product';

import { UnifiedProductCard } from '../ui/UnifiedProductCard';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const handleAddToCart = async (id: number) => {
    // منطق افزودن به سبد خرید
    console.log('Added to cart:', id);
  };
  return (
    <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      {products.map((product) => (
        <UnifiedProductCard
          key={product.id}
          mode="catalog"
          onAddToCart={handleAddToCart}
          onLike={() => console.log('like')}
          onQuickView={() => {
            /* empty */
          }}
          priority
          product={product}
        />
      ))}
    </div>
  );
}
