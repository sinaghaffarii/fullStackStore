import { ProfileSidebar } from './+components/Sidebar';
import { UserInfoCard } from './+components/UserInfoCard';

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row">
          <aside className="w-full shrink-0 space-y-4 md:w-72">
            <UserInfoCard name="سینا غفاری" />
            <ProfileSidebar />
          </aside>

          {/* محتوای اصلی - children هر صفحه */}
          <main className="min-h-[500px] flex-1 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
