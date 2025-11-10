import TrashIcon from '@/public/icons/TrashIcon';
import { Button } from '../components/ui/button';

export default function Home() {
  return (
    <div className="grid grid-cols-5 gap-5 w-1/2 mx-auto py-10">
      <Button>خرید </Button>
      <Button variant={'destructive'}>ایجاد</Button>
      <Button variant={'ghost'}>حذف</Button>
      <Button variant={'link'}>ویرایش</Button>
      <Button variant={'outline'}>ذخیره</Button>
      <Button variant={'secondary'}>فراموشی </Button>
      <TrashIcon />
    </div>
  );
}
