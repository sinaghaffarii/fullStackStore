import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { HeaderNav } from '@/components/dashboard/HeaderNav';
import { SidebarInset, SidebarProvider } from '@/components/ui/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset className="flex min-h-screen flex-col">
        <HeaderNav />
        <main className="flex-1 overflow-auto bg-background p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
