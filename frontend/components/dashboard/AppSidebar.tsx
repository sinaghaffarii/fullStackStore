/* eslint-disable max-lines */
'use client';

import {
  Bitcoin,
  Building2,
  FileText,
  Lightbulb,
  Settings,
  ShoppingCart,
  Sparkles,
  Store,
  User2,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { Badge } from '@/components/ui/Badge';
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
} from '@/components/ui/Sidebar';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
  isActive?: boolean;
  badge?: string;
  color?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const sidebarData: {
  brand: { name: string; logo: string };
  navigation: NavSection[];
  user: { name: string; email: string; avatar: string };
} = {
  brand: {
    name: 'فروشگاه آرایشی',
    logo: '/logo.svg',
  },
  navigation: [
    {
      label: 'داشبوردها',
      items: [
        {
          title: 'داشبورد اصلی',
          url: '/dashboard',
          icon: ShoppingCart,
          isActive: true,
          color: 'text-blue-600',
        },
        {
          title: 'گزارش فروش',
          url: '/dashboard/analytics',
          icon: Sparkles,
          color: 'text-amber-600',
        },
      ],
    },
    {
      label: 'مدیریت محصولات',
      items: [
        {
          title: 'لیست محصولات',
          url: '/dashboard/products',
          icon: Store,
          color: 'text-purple-600',
        },
        {
          title: 'دسته‌بندی‌ها',
          url: '/dashboard/categories',
          icon: Building2,
          color: 'text-pink-600',
        },
        {
          title: 'برندها',
          url: '/dashboard/brands',
          icon: Lightbulb,
          color: 'text-yellow-600',
        },
        {
          title: 'موجودی انبار',
          url: '/dashboard/inventory',
          icon: FileText,
          color: 'text-orange-600',
        },
      ],
    },
    {
      label: 'سفارشات و فروش',
      items: [
        {
          title: 'لیست سفارشات',
          url: '/dashboard/orders',
          icon: ShoppingCart,
          badge: '۱۲',
          color: 'text-green-600',
        },
        {
          title: 'فاکتورها',
          url: '/dashboard/invoices',
          icon: FileText,
          color: 'text-blue-500',
        },
        {
          title: 'کوپن‌ها و تخفیف‌ها',
          url: '/dashboard/coupons',
          icon: Bitcoin,
          color: 'text-emerald-600',
        },
      ],
    },
    {
      label: 'مدیریت کاربران',
      items: [
        {
          title: 'لیست مشتریان',
          url: '/dashboard/customers',
          icon: Users,
          color: 'text-cyan-600',
        },
        {
          title: 'سطح دسترسی',
          url: '/dashboard/roles',
          icon: Settings,
          color: 'text-slate-600',
        },
      ],
    },
    // {
    //   label: 'پشتیبانی و ارتباطات',
    //   items: [
    //     {
    //       title: 'تیکت‌های پشتیبانی',
    //       url: '/admin/tickets',
    //       icon: MessageSquare,
    //       badge: '۵',
    //       color: 'text-rose-600',
    //     },
    //     {
    //       title: 'نظرات و بررسی‌ها',
    //       url: '/admin/reviews',
    //       icon: Sparkles,
    //       color: 'text-violet-600',
    //     },
    //     {
    //       title: 'پیام‌ها',
    //       url: '/admin/messages',
    //       icon: Inbox,
    //       color: 'text-fuchsia-600',
    //     },
    //     {
    //       title: 'خبرنامه',
    //       url: '/admin/newsletter',
    //       icon: FileText,
    //       color: 'text-teal-600',
    //     },
    //   ],
    // },
    // {
    //   label: 'مالی و گزارشات',
    //   items: [
    //     {
    //       title: 'گزارش درآمد',
    //       url: '/admin/revenue',
    //       icon: CreditCard,
    //       color: 'text-lime-600',
    //     },
    //     {
    //       title: 'سود و زیان',
    //       url: '/admin/profit',
    //       icon: CreditCard,
    //       color: 'text-green-700',
    //     },
    //     {
    //       title: 'تراکنش‌ها',
    //       url: '/admin/transactions',
    //       icon: CreditCard,
    //       color: 'text-blue-700',
    //     },
    //     {
    //       title: 'گزارش‌ها',
    //       url: '/admin/reports',
    //       icon: FileText,
    //       color: 'text-indigo-700',
    //     },
    //   ],
    // },
    // {
    //   label: 'تنظیمات',
    //   items: [
    //     {
    //       title: 'اطلاعات فروشگاه',
    //       url: '/admin/settings/store',
    //       icon: Store,
    //       color: 'text-orange-500',
    //     },
    //     {
    //       title: 'روش‌های پرداخت',
    //       url: '/admin/settings/payment',
    //       icon: CreditCard,
    //       color: 'text-green-600',
    //     },
    //     {
    //       title: 'روش‌های ارسال',
    //       url: '/admin/settings/shipping',
    //       icon: Network,
    //       color: 'text-purple-500',
    //     },
    //     {
    //       title: 'تنظیمات عمومی',
    //       url: '/admin/settings',
    //       icon: Settings,
    //       color: 'text-gray-600',
    //     },
    //   ],
    // },
  ],
  user: {
    name: 'مدیر فروشگاه',
    email: 'admin@store.com',
    avatar: '',
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
      <SidebarHeader className="border-b border-sidebar-border p-3 h-14">
        <Link className="flex items-center gap-3" href="/admin">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground shadow-md">
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
                const isActive =
                  pathname === item.url ||
                  (item.isActive && pathname === item.url);
                const ItemIcon = item.icon;

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                    >
                      <Link
                        href={item.url}
                        className={cn(
                          'flex items-center gap-3 transition-all duration-200',
                          isActive &&
                            'bg-sidebar-accent font-medium text-sidebar-primary',
                        )}
                      >
                        <ItemIcon
                          className={cn(
                            'size-4 shrink-0',
                            isActive
                              ? 'text-sidebar-primary'
                              : item.color || 'text-sidebar-muted',
                          )}
                        />
                        <span className="truncate group-data-[collapsible=icon]:hidden">
                          {item.title}
                        </span>
                        {item.badge && (
                          <Badge
                            className="h-5 min-w-5 shrink-0 px-1.5 text-xs group-data-[collapsible=icon]:hidden"
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
              className="w-full gap-3 hover:bg-sidebar-accent"
              icon={
                <User2 className="size-14 shrink-0 rounded-lg bg-primary/10 text-sm text-primary" />
              }
              tooltip={sidebarData.user.name}
            >
              <div className="flex gap-4">
                <div className="flex min-w-0 flex-col items-start text-sm group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-medium text-sidebar-foreground">
                    {sidebarData.user.name}
                  </span>
                  <span className="truncate text-xs text-sidebar-muted">
                    {sidebarData.user.email}
                  </span>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
