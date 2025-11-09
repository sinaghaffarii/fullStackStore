import { SpeedInsights } from '@/components/analytics/SpeedInsights';
import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Breadcrumb />
        {children}
      </main>
      <Footer />
      <SpeedInsights />
    </div>
  );
}
