'use client';

import {
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Settings,
  User,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

interface NavUserProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile, state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-9 rounded-lg ring-2 ring-primary/20">
                <AvatarImage alt={user.name} src={user.avatar} />
                <AvatarFallback className="rounded-lg bg-primary/10 font-semibold text-primary">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <>
                  <div className="grid flex-1 text-right text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="mr-auto size-4 text-muted-foreground" />
                </>
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 rounded-xl"
            side={isMobile ? 'bottom' : 'left'}
            sideOffset={8}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 p-3 text-right">
                <Avatar className="size-12 rounded-xl">
                  <AvatarImage alt={user.name} src={user.avatar} />
                  <AvatarFallback className="rounded-xl bg-primary/10 font-semibold text-primary">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-right leading-tight">
                  <span className="font-semibold">{user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-3 p-2.5">
                <User className="size-4 text-muted-foreground" />
                <span>پروفایل</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 p-2.5">
                <Settings className="size-4 text-muted-foreground" />
                <span>تنظیمات</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 p-2.5">
                <Bell className="size-4 text-muted-foreground" />
                <span>اعلان‌ها</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 p-2.5">
                <CreditCard className="size-4 text-muted-foreground" />
                <span>صورتحساب</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-3 p-2.5 text-destructive focus:text-destructive">
              <LogOut className="size-4" />
              <span>خروج</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
