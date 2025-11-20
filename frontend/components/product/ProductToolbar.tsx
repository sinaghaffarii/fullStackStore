'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface ProductToolbarProps {
  productCount: number;
}

export function ProductToolbar({ productCount }: ProductToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 p-4 bg-white rounded-lg border border-gray-200">
      <div className="text-gray-600 text-sm mb-3 sm:mb-0">
        <span className="font-medium">{productCount}</span> محصول
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="مرتب سازی" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="0">پیش‌فرض</SelectItem>
                <SelectItem value="1">ارزان‌ترین</SelectItem>
                <SelectItem value="2">گران‌ترین</SelectItem>
                <SelectItem value="3">پرفروش‌ترین</SelectItem>
                <SelectItem value="4">محبوب‌ترین</SelectItem>
                <SelectItem value="5">جدیدترین</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="lg:hidden">
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
