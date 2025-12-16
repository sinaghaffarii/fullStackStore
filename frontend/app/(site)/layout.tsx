import Footer from '@/components/layout/footer';
import Header from '@/components/layout/Header';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 bg-[#f8f8f872]">{children}</main>
      <Footer />
    </>
  );
}
