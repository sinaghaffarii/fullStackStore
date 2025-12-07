import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { HeaderNav } from '@/components/dashboard/HeaderNav';
import { SidebarInset, SidebarProvider } from '@/components/ui/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset>
        <HeaderNav />
        <main className="flex-1 overflow-auto bg-background p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
