import type { ICategory } from './category';

export interface MenuItem {
  title: string;
  href?: string;
  children?: MenuItem[];
}

export function categoriesToMenu(categories: ICategory[]): MenuItem[] {
  return categories
    .filter((cat) => cat.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((cat) => ({
      title: cat.name,
      href: `/products/${cat.slug}`,
      children: cat.children ? categoriesToMenu(cat.children) : undefined,
    }));
}

export const mockMenuData: MenuItem[] = [
  {
    title: 'مراقبت از مو',
    children: [
      {
        title: 'شامپو',
        href: '/products/hair/shampoo',
        children: [
          { title: 'شامپو خشک', href: '/products/hair/shampoo/dry' },
          { title: 'شامپو چرب', href: '/products/hair/shampoo/oily' },
        ],
      },
      { title: 'نرم‌کننده', href: '/products/hair/conditioner' },
      { title: 'ماسک مو', href: '/products/hair/mask' },
    ],
  },
  {
    title: 'مراقبت از پوست',
    children: [
      { title: 'مرطوب‌کننده', href: '/products/skin/moisturizer' },
      { title: 'ضد آفتاب', href: '/products/skin/sunscreen' },
      { title: 'سرم', href: '/products/skin/serum' },
    ],
  },
  {
    title: 'آرایشی',
    children: [
      { title: 'رژلب', href: '/products/makeup/lipstick' },
      { title: 'ریمل', href: '/products/makeup/mascara' },
      { title: 'فونداسیون', href: '/products/makeup/foundation' },
    ],
  },
];
