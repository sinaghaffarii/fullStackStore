'use client';

const specs = [
  { label: 'برند', value: 'نوتریگا (Nutriga)' },
  { label: 'کشور مبدا برند', value: 'ایتالیا' },
  { label: 'حجم', value: '۱۰۰ میلی‌لیتر' },
  { label: 'مناسب برای', value: 'انواع مو، موهای خشک و آسیب دیده' },
  { label: 'ویتامین', value: 'دارای ویتامین E و B5' },
  { label: 'مجوز غذا و دارو', value: 'دارد' },
  { label: 'ترکیبات شاخص', value: 'روغن آرگان خالص، بدون پارابن' },
];

export function ProductSpecs() {
  return (
    <div className="space-y-4">
      {specs.map((spec) => (
        <div
          className="flex flex-col rounded-lg border border-gray-100 bg-gray-50/60 px-4 py-3 transition hover:border-gray-200 sm:flex-row"
          key={spec.label}
        >
          <div className="text-sm font-semibold text-gray-500 sm:w-1/3">
            {spec.label}
          </div>
          <div className="text-sm font-semibold text-gray-900 sm:w-2/3">
            {spec.value}
          </div>
        </div>
      ))}
    </div>
  );
}
