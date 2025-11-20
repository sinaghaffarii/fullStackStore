'use client';

import Image from 'next/image';
import Link from 'next/link';
import { memo, useRef } from 'react';

import type { Product } from '@/src/types/product';

import { useLazyLoad } from '@/src/hooks/useIntersectionObserver';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard = memo(function ProductCard({
  product: { id, name, base_price, description, images },
  priority = false,
}: ProductCardProps) {
  const PLACEHOLDER_IMAGE = '/images/placeholder.jpg';
  const cardRef = useRef<HTMLDivElement>(null);
  const [lazyRef, isVisible] = useLazyLoad<HTMLDivElement>(cardRef);

  // border-b border-l nth-[5n]:border-l-0 nth-last-[-n+4]:border-b-0
  return (
    <div
      className="p-2 bg-white border rounded-lg"
      itemType="https://schema.org/Product"
      ref={lazyRef}
      itemScope
    >
      <Link className="block" href={`/products/${id}`}>
        <div className="aspect-square relative overflow-hidden">
          {isVisible && (
            <Image
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              alt={name}
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              src={images?.[0] || PLACEHOLDER_IMAGE}
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
            {name}
          </h3>

          <div
            className="text-primary font-bold text-xl"
            itemType="https://schema.org/Offer"
            itemProp="offers"
            itemScope
          >
            <span itemProp="price">{base_price.toLocaleString()}</span>
            <span className="text-sm mr-1" itemProp="priceCurrency">
              تومان
            </span>
          </div>

          {description && (
            <p
              className="text-muted-foreground text-sm mt-2 line-clamp-2"
              itemProp="description"
            >
              {description}
            </p>
          )}
        </div>
      </Link>
    </div>
  );
});
