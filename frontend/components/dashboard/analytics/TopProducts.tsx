import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Progress } from '@/components/ui/Progress';

interface Props {
  period: string;
}

const products = [
  { name: 'آیفون ۱۵ پرو', sales: 234, percentage: 100 },
  { name: 'ایرپاد پرو', sales: 186, percentage: 79 },
  { name: 'مک‌بوک ایر', sales: 145, percentage: 62 },
  { name: 'اپل واچ', sales: 98, percentage: 42 },
  { name: 'آیپد پرو', sales: 76, percentage: 32 },
];

export function TopProducts({ period }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">
          محصولات پرفروش
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.map((product, i) => (
          <div className="space-y-2" key={product.name}>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                  {i + 1}
                </span>
                {product.name}
              </span>
              <span className="text-muted-foreground">
                {product.sales.toLocaleString('fa-IR')}
              </span>
            </div>
            <Progress className="h-1.5" value={product.percentage} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
