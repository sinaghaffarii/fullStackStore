import { EmptyState } from '../+components/EmptyState';
import { SectionHeader } from '../+components/SectionHeader';

export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <SectionHeader title="سفارش های من" />

      <EmptyState message="هنوز سفارشی ثبت نکرده‌اید" />
    </div>
  );
}
