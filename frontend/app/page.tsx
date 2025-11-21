import CarouselProducts from '@/components/homePage/carousel/CarouselProducts';
import Categories from '@/components/homePage/Categories';
import Hero from '@/components/homePage/Hero';
import Newsletter from '@/components/homePage/Newsletter';
import PromoBanner from '@/components/homePage/PromoBanner';
import Testimonials from '@/components/homePage/Testimonials';

const productsData = [
  {
    id: 1,
    name: 'کرم مرطوب کننده مدل Hydralift AC مناسب پوست چرب حجم 50میلی لیتر',
    brand: 'درمالیفت',
    image:
      'https://storage.khanoumi.com/ProductImages/34983-202452814372188.jpg',
    originalPrice: 268000,
    discountedPrice: 134000,
    discountPercentage: 50,
    href: '/products/dermalift-hydralift-ac-greasy-skin-moisturizing-cream',
  },
  {
    id: 2,
    name: 'ژل شست و شوی و صورت مدل Vitamin C حجم 200 میلی لیتر',
    brand: 'ویتالیر',
    image:
      'https://storage.khanoumi.com/ProductImages/3241100035-202473162931375.jpg',
    originalPrice: 353800,
    discountedPrice: 280100,
    discountPercentage: 21,
    href: '/products/vitalayer-vitamin-c-face-wash-200ml-32411',
  },
  {
    id: 3,
    name: 'فوم شستشو صورت مناسب پوست نرمال تا خشک حجم 150 میلی لیتر',
    brand: 'درمالیفت',
    image:
      'https://storage.khanoumi.com/ProductImages/DSC00053-202532141156303.jpg',
    originalPrice: 288000,
    discountedPrice: 144000,
    discountPercentage: 50,
    href: '/products/dermalift-face-foaming-wash',
  },
  {
    id: 4,
    name: 'کرم ضد آفتاب رنگی روشن کننده دارای spf50 و رنگ طبیعی حجم 50 میل',
    brand: 'سیسپرسا',
    image:
      'https://storage.khanoumi.com/ProductImages/900649-2025727155548102.jpg',
    originalPrice: 650000,
    discountedPrice: 487500,
    discountPercentage: 25,
    href: '/products/cyspersa-colored-sunscreen-50-ml-75777',
  },
  {
    id: 5,
    name: 'سرم ویتامین C مناسب انواع پوست حجم 30 میلی لیتر',
    brand: 'ژنو بایوتیک',
    image:
      'https://storage.khanoumi.com/ProductImages/84921-20251694316979.jpg',
    originalPrice: 750800,
    discountedPrice: 710000,
    discountPercentage: 5,
    href: '/products/geno-biotic-vitamin-c-serum-30-ml-84920',
  },
  {
    id: 6,
    name: 'رژ لب جامد مدل Pure Plant وزن 4 گرم',
    brand: 'سالوته',
    image:
      'https://storage.khanoumi.com/ProductImages/82296-902-20241027114154339.jpg',
    originalPrice: 750000,
    discountedPrice: 250000,
    discountPercentage: 67,
    href: '/products/salute-pure-plant-lipstick-4-g-82296',
  },
];

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      <Hero />

      <Categories />

      <CarouselProducts
        title="حراج ویژه تابستان"
        viewAllLink="/summer-sale"
        description="تخفیف‌های استثنایی برای فصل گرم"
        products={productsData}
        specialOffer={{
          title: 'حراج بزرگ تابستانه',
          subtitle: 'تا 70% تخفیف',
          href: '/tags/summer-sale',
          timer: {
            hours: 48,
            minutes: 15,
            seconds: 30,
          },
          backgroundColor: 'from-orange-500 to-red-600',
        }}
      />
      <CarouselProducts
        title="جلوه نوروزی"
        viewAllLink="/new-year-products"
        autoPlay
        description="محصولات ویژه سال نو"
        products={productsData}
        specialOffer={{
          title: 'شگفت‌انگیزهای نوروز',
          subtitle: 'آغاز سال نو با تخفیف‌های ویژه',
          href: '/tags/new-year',
          backgroundColor: 'from-green-500 to-emerald-600',
        }}
      />
      <CarouselProducts
        title="پیشنهادهای ویژه"
        viewAllLink="/all-products"
        products={productsData}
        showArrows={false}
      />
      <CarouselProducts
        title="Black Friday"
        viewAllLink="/black-friday"
        autoPlay
        description="فقط 24 ساعت فرصت دارید!"
        products={productsData}
        specialOffer={{
          title: 'شب سیاه جمعه',
          subtitle: 'تخفیف‌های باورنکردنی',
          href: '/tags/black-friday',
          timer: {
            hours: 23,
            minutes: 59,
            seconds: 59,
          },
          backgroundColor: 'from-gray-900 to-black',
          headerImage: '/images/black-friday-header.png',
          mainImage: '/images/black-friday-main.png',
        }}
      />

      <PromoBanner />

      {/* <FeaturedProducts /> */}

      <Testimonials />

      <Newsletter />
    </main>
  );
}
