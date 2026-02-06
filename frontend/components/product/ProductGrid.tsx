'use client';

import type { Product } from '@/types/product';

import { useCart } from '@/hooks/useCart';

import { ProductCard } from '../ui/ProductCard';

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const { addItem } = useCart();

  const handleAddToCart = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      addItem(product, 1);
    }
  };

  const handleLike = async (_id: string) => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  };

  return (
    <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          mode="catalog"
          onAddToCart={handleAddToCart}
          onLike={handleLike}
          onQuickView={() => {
            //view
          }}
          priority
          product={product}
        />
      ))}
    </div>
  );
}
