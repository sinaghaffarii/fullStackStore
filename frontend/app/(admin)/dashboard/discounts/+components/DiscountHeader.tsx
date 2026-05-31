import { Plus, Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/Button';
import { BaseInput } from '@/components/ui/Input';

interface Props {
  total: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

enum QueryFilter {
  ValidOnly,
  IsActive,
}

export function DiscountHeader({
  total,
  searchValue,
  onSearchChange,
  onAddClick,
}: Props) {
  const router = useRouter();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const discountQueryFilterHandler = (type: QueryFilter) => {
    const params = new URLSearchParams(searchParams.toString());
    if (type === QueryFilter.ValidOnly) {
      params.set('validOnly', 'true');
    }
    if (type === QueryFilter.IsActive) {
      params.set('is_active', 'true');
    }
    router.replace(`${pathName}?${params.toString()}`);
  };
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت تخفیف</h1>
          <p className="text-sm text-muted-foreground">{total} تخفیف</p>
        </div>

        <Button onClick={onAddClick}>
          <Plus className="ml-2 size-4" />
          ایجاد تخفیف
        </Button>
      </div>

      <div className="flex items-center justify-start gap-2">
        <div className="relative max-w-sm">
          <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <BaseInput
            className="pr-10"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجو در تخفیف…"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => discountQueryFilterHandler(QueryFilter.IsActive)}
        >
          تخفیف های فعال
        </Button>
        <Button
          variant="outline"
          onClick={() => discountQueryFilterHandler(QueryFilter.ValidOnly)}
        >
          تخفیف های معتبر
        </Button>
      </div>
    </>
  );
}
