import type { ProductDetail } from '@/types/product';

export async function getProductById(
  id: string,
): Promise<ProductDetail | null> {
  await new Promise((r) => {
    setTimeout(r, 100);
  });

  if (!id) return null;

  return {
    id: Number(id),
    slug: 'argan-oil-serum',
    name: 'سرم موی روغن آرگان مراکش نوتریگا',
    description:
      'سرم تقویتی و ترمیمی مو با روغن آرگان خالص مراکش. این محصول با فرمول پیشرفته خود، موهای آسیب‌دیده را ترمیم کرده و درخشندگی طبیعی را به آن‌ها باز می‌گرداند.',
    price: 485_000,
    originalPrice: 650_000,
    discount: 25,
    base_price: 650_000,
    image: '/images/products/product_8.webp',
    images: [
      '/images/products/product_8.webp',
      '/images/products/product_8.webp',
      '/images/products/product_8.webp',
    ],
    rating: '4.4',
    reviews: 128,
    isNew: false,
    isBestseller: true,
    inStock: true,
    stock: 42,
    brand: 'Nutriga',
    brandFa: 'نوتریگا',
    category: 'hair-care',
    tags: ['hair', 'serum', 'argan-oil'],
    specifications: [
      { label: 'برند', value: 'نوتریگا' },
      { label: 'کشور', value: 'ایتالیا' },
      { label: 'حجم', value: '۱۰۰ میلی‌لیتر' },
      { label: 'نوع مو', value: 'همه انواع مو' },
    ],
    colors: [
      { id: 1, name: '۱۰۰ میل', code: '#EAB308', value: '100ml' },
      { id: 2, name: '۵۰ میل', code: '#94A3B8', value: '50ml' },
    ],
    features: ['فاقد سولفات', 'حاوی ویتامین E', 'محافظت حرارتی', 'براق کننده'],
    highlights: [
      'ترمیم موهای آسیب‌دیده ظرف ۴ هفته',
      'مناسب موهای کراتین شده',
      'آنتی‌اکسیدان طبیعی',
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
