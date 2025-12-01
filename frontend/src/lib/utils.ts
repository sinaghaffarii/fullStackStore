import type { ClassValue } from 'clsx';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { Product, StockStatus } from '../types/product';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return price.toLocaleString('fa-IR');
}

export function getStockStatus(product: Product): StockStatus {
  if (product.inStock === false) return 'out-of-stock';
  if (!product.stock || product.stock === 0) return 'out-of-stock';
  if (product.stock <= 5) return 'low-stock';
  return 'in-stock';
}

export function getStockLabel(status: StockStatus): string {
  const labels: Record<StockStatus, string> = {
    'in-stock': 'موجود',
    'low-stock': 'تعداد محدود',
    'out-of-stock': 'ناموجود',
  };
  return labels[status];
}
