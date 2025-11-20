'use client';

interface ProductToolbarProps {
  productCount: number;
}

export function ProductToolbar({ productCount }: ProductToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="text-gray-600 text-sm mb-3 sm:mb-0">
        <span className="font-medium">{productCount}</span> محصول
      </div>

      <div className="flex items-center gap-3">
        {/* دکمه‌های نمایش */}
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button className="p-2 bg-white border-l border-gray-300 hover:bg-gray-50 transition-colors">
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
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </button>
          <button className="p-2 bg-gray-100 border-l border-gray-300 hover:bg-gray-200 transition-colors">
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
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* مرتب‌سازی */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">مرتب‌سازی:</span>
          <select className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[180px]">
            <option>پیش‌فرض</option>
            <option>ارزان‌ترین</option>
            <option>گران‌ترین</option>
            <option>پرفروش‌ترین</option>
            <option>محبوب‌ترین</option>
            <option>جدیدترین</option>
          </select>
        </div>

        {/* دکمه فیلتر در موبایل */}
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
