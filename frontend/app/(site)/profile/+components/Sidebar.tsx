'use client';

import type { LucideIcon } from 'lucide-react';

import {
  Heart,
  HelpCircle,
  LogOut,
  MapPin,
  ShoppingBag,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/src/lib/utils';

interface MenuItem {
  title: string;
  href: string;
  icon: LucideIcon;
  variant?: 'danger' | 'default';
}

const menuItems: MenuItem[] = [
  { title: 'حساب کاربری', href: '/profile', icon: User },
  { title: 'سفارش های من', href: '/profile/orders', icon: ShoppingBag },
  { title: 'آدرس های من', href: '/profile/addresses', icon: MapPin },
  { title: 'علاقه مندی ها', href: '/profile/favorites', icon: Heart },
  { title: 'تیکت های پشتیبانی', href: '/profile/tickets', icon: HelpCircle },
  { title: 'خروج از سامانه', href: '/', icon: LogOut, variant: 'danger' },
];

export const ProfileSidebar = () => {
  const pathname = usePathname();

  return (
    <nav className="overflow-hidden rounded-lg border border-gray-100 bg-white py-2 shadow-sm">
      <ul className="flex flex-col">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const isDanger = item.variant === 'danger';

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'relative flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                  'hover:bg-gray-50',
                  isActive && !isDanger
                    ? 'border-r-4 border-rose-600 bg-rose-50 font-medium text-rose-600'
                    : 'border-r-4 border-transparent text-gray-600',
                  isDanger &&
                    'mt-2 border-t border-gray-50 pt-4 hover:bg-red-50 hover:text-red-600',
                )}
              >
                <item.icon
                  className={cn(
                    'size-5',
                    isActive && !isDanger ? 'text-rose-600' : 'text-gray-400',
                    isDanger && 'text-gray-400',
                  )}
                />
                <span>{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
