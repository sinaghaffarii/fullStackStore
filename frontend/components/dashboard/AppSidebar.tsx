/* eslint-disable max-lines */
'use client';

import {
  Bitcoin,
  Building2,
  Calendar,
  Coffee,
  CreditCard,
  Factory,
  FileText,
  Hotel,
  Inbox,
  Lightbulb,
  MessageSquare,
  MousePointer2,
  Network,
  Settings,
  ShoppingCart,
  Sparkles,
  Store,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { cn } from '@/src/lib/utils';

// تعریف تایپ برای آیتم‌های منو
interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  isActive?: boolean;
  badge?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

// داده‌های سایدبار
const sidebarData: {
  brand: { name: string; logo: string };
  navigation: NavSection[];
  user: { name: string; email: string; avatar: string };
} = {
  brand: {
    name: 'انعکاس',
    logo: '/logo.svg',
  },
  navigation: [
    {
      label: 'داشبوردها',
      items: [
        {
          title: 'تجارت الکترونیک',
          url: '/admin',
          icon: ShoppingCart,
          isActive: true,
        },
        {
          title: 'مدیریت ارتباط با مشتریان',
          url: '/admin/crm',
          icon: Users,
        },
        {
          title: 'بیمارستان',
          url: '/admin/hospital',
          icon: Building2,
        },
        {
          title: 'کارخانه',
          url: '/admin/factory',
          icon: Factory,
        },
        {
          title: 'بانکداری',
          url: '/admin/banking',
          icon: CreditCard,
        },
        {
          title: 'کافه',
          url: '/admin/cafe',
          icon: Coffee,
        },
        {
          title: 'رمزارز',
          url: '/admin/crypto',
          icon: Bitcoin,
        },
        {
          title: 'هتل',
          url: '/admin/hotel',
          icon: Hotel,
        },
      ],
    },
    {
      label: 'برنامه‌ها',
      items: [
        {
          title: 'صندوق دریافت',
          url: '/admin/inbox',
          icon: Inbox,
          badge: '۴',
        },
        {
          title: 'مدیریت فایل - لیست',
          url: '/admin/files/list',
          icon: FileText,
        },
        {
          title: 'مدیریت فایل - شبکه',
          url: '/admin/files/grid',
          icon: Network,
        },
        {
          title: 'نقطه فروش',
          url: '/admin/pos',
          icon: Store,
        },
        {
          title: 'چت',
          url: '/admin/chat',
          icon: MessageSquare,
        },
        {
          title: 'تقویم',
          url: '/admin/calendar',
          icon: Calendar,
        },
      ],
    },
    {
      label: 'ابزارک‌های کاربری',
      items: [
        {
          title: 'خلاقانه',
          url: '/admin/widgets/creative',
          icon: Lightbulb,
        },
        {
          title: 'پویا',
          url: '/admin/widgets/dynamic',
          icon: Sparkles,
        },
        {
          title: 'تعاملی',
          url: '/admin/widgets/interactive',
          icon: MousePointer2,
        },
      ],
    },
    {
      label: 'مدیریت کاربر',
      items: [
        {
          title: 'لیست کاربران',
          url: '/admin/users',
          icon: Users,
        },
        {
          title: 'تنظیمات',
          url: '/admin/settings',
          icon: Settings,
        },
      ],
    },
  ],
  user: {
    name: 'مدیر فروشگاه',
    email: 'admin@store.com',
    avatar: '/avatars/admin.jpg',
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar
      className="border-l border-sidebar-border bg-sidebar"
      side="right"
      collapsible="icon"
      {...props}
    >
      {/* Header - Brand */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link className="flex items-center gap-3" href="/admin">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
            <Sparkles className="size-5" />
          </div>
          {!isCollapsed && (
            <span className="truncate text-lg font-bold text-sidebar-foreground">
              {sidebarData.brand.name}
            </span>
          )}
        </Link>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="overflow-y-auto px-2 py-4">
        {sidebarData.navigation.map((section) => (
          <SidebarGroup className="mb-4" key={section.label}>
            <SidebarGroupLabel className="mb-2 px-3 text-xs font-medium text-sidebar-muted">
              {section.label}
            </SidebarGroupLabel>
            <SidebarMenu className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.url || item.isActive;
                const ItemIcon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={isCollapsed ? item.title : undefined}
                      className={cn(
                        'transition-all duration-200',
                        isActive &&
                          'bg-sidebar-accent font-medium text-sidebar-primary',
                      )}
                    >
                      <Link className="flex items-center gap-3" href={item.url}>
                        <ItemIcon
                          className={cn(
                            'size-4 shrink-0',
                            isActive
                              ? 'text-sidebar-primary'
                              : 'text-sidebar-muted',
                          )}
                        />
                        <span className="flex-1 truncate">{item.title}</span>
                        {item.badge && !isCollapsed && (
                          <Badge
                            className="h-5 min-w-5 shrink-0 px-1.5 text-xs"
                            variant="secondary"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      {/* Footer - User */}
      <SidebarFooter className="p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="w-full justify-start gap-3 hover:bg-sidebar-accent"
            >
              <Avatar className="size-9 shrink-0 rounded-lg">
                <AvatarImage
                  alt={sidebarData.user.name}
                  src={sidebarData.user.avatar}
                />
                <AvatarFallback className="rounded-lg bg-primary/10 text-sm text-primary">
                  مد
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex min-w-0 flex-col items-start text-sm">
                  <span className="truncate font-medium text-sidebar-foreground">
                    {sidebarData.user.name}
                  </span>
                  <span className="truncate text-xs text-sidebar-muted">
                    {sidebarData.user.email}
                  </span>
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
