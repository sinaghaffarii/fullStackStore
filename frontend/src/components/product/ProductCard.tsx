'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo, useRef } from 'react';

import type { Product } from '@/types';

import { useLazyLoad } from '@/hooks/useIntersectionObserver';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard = memo(function ProductCard({
  product,
  priority = false,
}: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [lazyRef, isVisible] = useLazyLoad(cardRef);

  return (
    <div
      className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
      itemType="https://schema.org/Product"
      ref={lazyRef}
      itemScope
    >
      <Link className="block" href={`/products/${product.id}`}>
        <div className="aspect-square relative overflow-hidden">
          {isVisible && (
            <Image
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              alt={product.name}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              src={product.images?.[0] || '/images/placeholder.jpg'}
              loading={priority ? 'eager' : 'lazy'}
              priority={priority}
            />
          )}
        </div>

        <div className="p-4">
          <h3
            className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors"
            itemProp="name"
          >
            {product.name}
          </h3>

          <div
            className="text-primary font-bold text-xl"
            itemType="https://schema.org/Offer"
            itemProp="offers"
            itemScope
          >
            <span itemProp="price">{product.base_price.toLocaleString()}</span>
            <span className="text-sm mr-1" itemProp="priceCurrency">
              تومان
            </span>
          </div>

          {product.description && (
            <p
              className="text-muted-foreground text-sm mt-2 line-clamp-2"
              itemProp="description"
            >
              {product.description}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
});
