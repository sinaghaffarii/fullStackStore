'use client';

import { CartItem } from '@/components/cart/CartItem';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { items, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">سبد خرید</h1>
          <p className="text-muted-foreground">سبد خرید شما خالی است</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">سبد خرید</h1>
        <Button variant="outline" onClick={clearCart}>
          پاک کردن سبد
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItem item={item} key={item.id} />
          ))}
        </div>

        <div className="bg-muted p-6 rounded-lg space-y-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>جمع کل:</span>
            <span>{totalPrice.toLocaleString()} تومان</span>
          </div>

          <Button size="lg" className="w-full">
            ادامه فرآیند خرید
          </Button>
        </div>
      </div>
    </div>
  );
}
