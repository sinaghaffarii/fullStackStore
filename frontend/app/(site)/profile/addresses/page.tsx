import { EmptyState } from '../+components/EmptyState';
import { SectionHeader } from '../+components/SectionHeader';

export default function AddressPage() {
  return (
    <div className="space-y-4">
      <SectionHeader title="آدرس های من" />

      <EmptyState message="هنوز آدرسی ثبت نکرده‌اید" />
    </div>
  );
}
