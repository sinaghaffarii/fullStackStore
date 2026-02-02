'use client';

import { useCart } from '@/hooks/useCart';

import { Button } from '../../../components/ui/Button';

export default function CartPage() {
  const { items, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 min-h-[400px]">
        <div className="text-center mt-16">
          <h1 className="mb-4 text-2xl font-bold">سبد خرید</h1>
          <p className="text-muted-foreground">سبد خرید شما خالی است</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">سبد خرید</h1>
        <Button variant="outline" onClick={clearCart}>
          پاک کردن سبد
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <div key={item.id}>cart items {item.product?.name}</div>
            // <CartItem item={item} key={item.id} />
          ))}
        </div>

        <div className="space-y-4 rounded-lg bg-muted p-6">
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
