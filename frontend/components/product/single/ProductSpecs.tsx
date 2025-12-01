interface ProductSpecsProps {
  specifications?: { label: string; value: string }[];
}

export function ProductSpecs({ specifications }: ProductSpecsProps) {
  if (!specifications || specifications.length === 0) {
    return <p className="text-center text-gray-500">مشخصاتی ثبت نشده است.</p>;
  }

  return (
    <div
      dir="rtl"
      className="divide-y divide-gray-100 rounded-xl border border-gray-100"
    >
      {specifications.map((spec) => (
        <div
          className="flex flex-col gap-1 px-4 py-3 text-sm sm:flex-row sm:items-center sm:gap-0"
          key={spec.label}
        >
          <span className="text-gray-500 sm:w-1/3">{spec.label}</span>
          <span className="font-medium text-gray-900 sm:w-2/3">
            {spec.value}
          </span>
        </div>
      ))}
    </div>
  );
}
