import { Plus, Search } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Props {
  total: number;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onAddClick: () => void;
}

export function BrandHeader({
  total,
  searchValue,
  onSearchChange,
  onAddClick,
}: Props) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">مدیریت برند</h1>
          <p className="text-sm text-muted-foreground">{total} برند</p>
        </div>

        <Button onClick={onAddClick}>
          <Plus className="ml-2 size-4" />
          افزودن برند
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pr-10"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="جستجو در برند…"
        />
      </div>
    </>
  );
}
