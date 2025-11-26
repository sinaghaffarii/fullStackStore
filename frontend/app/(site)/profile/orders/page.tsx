import { ShoppingBag } from 'lucide-react';

import { EmptyState } from '../+components/EmptyState';
import { SectionHeader } from '../+components/SectionHeader';

export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <SectionHeader
        title="سفارش های من"
        icon={<ShoppingBag className="size-5" />}
      />

      <EmptyState message="هنوز سفارشی ثبت نکرده‌اید" />
    </div>
  );
}
