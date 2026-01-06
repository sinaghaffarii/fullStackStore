import { Button } from '@/components/ui/Button';

interface Props {
  isLoading: boolean;
  onCancel: () => void;
}

export function FormActions({ isLoading, onCancel }: Props) {
  return (
    <div className="flex justify-end gap-4">
      <Button type="button" variant="outline" onClick={onCancel}>
        انصراف
      </Button>
      <Button disabled={isLoading} type="submit">
        {isLoading ? 'در حال ذخیره...' : 'ذخیره محصول'}
      </Button>
    </div>
  );
}
