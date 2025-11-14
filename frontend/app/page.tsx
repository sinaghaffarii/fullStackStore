import Categories from '@/components/homePage/Categories';
import Hero from '@/components/homePage/Hero';
import Newsletter from '@/components/homePage/Newsletter';
import PromoBanner from '@/components/homePage/PromoBanner';
import Testimonials from '@/components/homePage/Testimonials';

export default function Home() {
  return (
    <main className="w-full overflow-x-hidden">
      <Hero />

      <Categories />

      <PromoBanner />

      {/* <FeaturedProducts /> */}

      <Testimonials />

      <Newsletter />
    </main>
  );
}
