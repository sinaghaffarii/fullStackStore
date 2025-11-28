/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
'use client';

import {
  Bell,
  ChevronLeft,
  Command,
  Grid3X3,
  LogOut,
  Maximize2,
  Minimize2,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from 'lucide-react';
import Link from 'next/link';
import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/src/lib/utils';

interface HeaderNavProps {
  className?: string;
}

export function HeaderNav({ className }: HeaderNavProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-border bg-card/95 px-4 backdrop-blur-sm supports-backdrop-filter:bg-card/60 lg:px-6',
        className,
      )}
    >
      {/* Right Side - Breadcrumb & Sidebar Trigger */}
      <div className="flex items-center gap-4">
        <SidebarTrigger className="size-9" />

        <nav className="hidden items-center gap-1 text-sm md:flex">
          <Link
            className="font-medium text-primary hover:underline"
            href="/admin"
          >
            اپلیکیشن
          </Link>
          <ChevronLeft className="size-4 text-muted-foreground" />
          <Link
            className="text-muted-foreground transition-colors hover:text-foreground"
            href="/admin"
          >
            داشبوردها
          </Link>
          <ChevronLeft className="size-4 text-muted-foreground" />
          <span className="text-muted-foreground">آنالیزها</span>
        </nav>
      </div>

      {/* Center - Search */}
      <div className="mx-4 max-w-md flex-1">
        <div className="relative">
          <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-10 w-full border-0 bg-muted/50 pr-10 pl-16 focus-visible:ring-1 focus-visible:ring-primary/30"
            type="search"
            placeholder="جستجوی سریع..."
          />
          <div className="absolute top-1/2 left-2 flex -translate-y-1/2 items-center gap-1">
            <kbd className="pointer-events-none flex h-6 items-center gap-1 rounded-sm border bg-background px-1.5 font-mono text-xs font-medium opacity-100 select-none">
              <Command className="size-3" />K
            </kbd>
          </div>
        </div>
      </div>

      {/* Left Side - User & Quick Actions */}
      <div className="flex items-center gap-2">
        {/* Fullscreen */}
        <Button
          size="icon"
          className="hidden size-9 md:flex"
          variant="ghost"
          onClick={toggleFullscreen}
        >
          {isFullscreen ? (
            <Minimize2 className="size-5 text-muted-foreground" />
          ) : (
            <Maximize2 className="size-5 text-muted-foreground" />
          )}
        </Button>

        {/* Apps Grid */}
        <Button size="icon" className="size-9" variant="ghost">
          <Grid3X3 className="size-5 text-muted-foreground" />
        </Button>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="relative size-9" variant="ghost">
              <Bell className="size-5 text-muted-foreground" />
              <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                ۳
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>اعلان‌ها</span>
              <Badge className="text-xs" variant="secondary">
                ۳ جدید
              </Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-auto">
              {[
                {
                  title: 'سفارش جدید',
                  desc: 'سفارش #۱۲۳۴ ثبت شد',
                  time: '۵ دقیقه پیش',
                  unread: true,
                },
                {
                  title: 'پرداخت موفق',
                  desc: 'پرداخت ۲,۵۰۰,۰۰۰ تومان تایید شد',
                  time: '۱ ساعت پیش',
                  unread: true,
                },
                {
                  title: 'کاربر جدید',
                  desc: 'محمد احمدی عضو شد',
                  time: '۲ ساعت پیش',
                  unread: false,
                },
              ].map((notif, i) => (
                <DropdownMenuItem
                  key={i}
                  className={cn(
                    'flex cursor-pointer flex-col items-start gap-1 p-3',
                    notif.unread && 'bg-primary/5',
                  )}
                >
                  <div className="flex w-full items-center gap-2">
                    <span className="text-sm font-medium">{notif.title}</span>
                    {notif.unread && (
                      <span className="mr-auto size-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {notif.desc}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {notif.time}
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary">
              مشاهده همه اعلان‌ها
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" className="size-9 rounded-full" variant="ghost">
              <Avatar className="size-8">
                <AvatarImage alt="کاربر" src="/avatars/admin.jpg" />
                <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                  م
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">محمد احمدی</span>
                <span className="text-xs font-normal text-muted-foreground">
                  admin@example.com
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="ml-2 size-4" />
              پروفایل
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="ml-2 size-4" />
              تنظیمات
            </DropdownMenuItem>
            <DropdownMenuItem onClick={toggleTheme}>
              {isDark ? (
                <Sun className="ml-2 size-4" />
              ) : (
                <Moon className="ml-2 size-4" />
              )}
              {isDark ? 'حالت روشن' : 'حالت تاریک'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="ml-2 size-4" />
              خروج
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
