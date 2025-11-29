'use client';

import {
  Bell,
  ChevronLeft,
  Command,
  Grid3X3,
  Maximize2,
  Search,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-6">
      {/* Right Side - Breadcrumb & Search */}
      <div className="flex items-center gap-4">
        {/* Avatar & Quick Actions */}
        <div className="flex items-center gap-2">
          <Avatar className="size-9 cursor-pointer ring-2 ring-primary/20">
            <AvatarImage alt="مدیر" src="/avatars/admin.jpg" />
            <AvatarFallback className="bg-primary/10 text-sm text-primary">
              مد
            </AvatarFallback>
          </Avatar>

          <Button
            size="icon"
            className="size-9 text-muted-foreground hover:text-foreground"
            variant="ghost"
          >
            <Bell className="size-4" />
          </Button>

          <Button
            size="icon"
            className="size-9 text-muted-foreground hover:text-foreground"
            variant="ghost"
          >
            <Maximize2 className="size-4" />
          </Button>

          <Button
            size="icon"
            className="size-9 text-muted-foreground hover:text-foreground"
            variant="ghost"
          >
            <Grid3X3 className="size-4" />
          </Button>
        </div>
      </div>

      {/* Center - Search */}
      <div className="mx-auto max-w-md flex-1">
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

      {/* Left Side - Breadcrumb & Sidebar Trigger */}
      <div className="flex items-center gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-muted-foreground hover:text-foreground"
                href="/"
              >
                اپلیکیشن
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronLeft className="size-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink
                className="text-muted-foreground hover:text-foreground"
                href="/"
              >
                داشبوردها
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ChevronLeft className="size-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-foreground">
                آنالیزها
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <SidebarTrigger className="size-9" />
      </div>
    </header>
  );
}
