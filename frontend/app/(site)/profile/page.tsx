import { User } from 'lucide-react';

import { Label } from '@/components/ui/label';

import { SectionHeader } from './+components/SectionHeader';

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <SectionHeader title="حساب کاربری" icon={<User className="size-5" />} />

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label className="mb-2 block text-sm font-medium text-gray-700">
              نام و نام خانوادگی
            </Label>
            <input
              className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              type="text"
              placeholder="سینا غفاری"
            />
          </div>

          <div>
            <Label className="mb-2 block text-sm font-medium text-gray-700">
              شماره موبایل
            </Label>
            <input
              className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
              type="text"
              placeholder="09123456789"
            />
          </div>
        </div>

        <button
          className="rounded-lg bg-rose-600 px-6 py-2 text-white transition-colors hover:bg-rose-700"
          type="button"
        >
          ذخیره تغییرات
        </button>
      </div>
    </div>
  );
}
