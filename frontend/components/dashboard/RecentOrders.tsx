/* eslint-disable max-lines */
/* eslint-disable max-lines-per-function */
'use client';

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  MoreVertical,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/src/lib/utils';

interface Order {
  id: string;
  customer: {
    name: string;
    avatar: string;
    category: string;
  };
  date: string;
  status: 'active' | 'delivered' | 'processing' | 'rejected';
  team: { avatar: string }[];
}

const ordersData: Order[] = [
  {
    id: 'IVR/۲۰۲۴۰۳۰۱/۱۱/۱۱/۸۴۳۲۸۶۲۰۷۹',
    customer: {
      name: 'احمد محمدی',
      avatar: '/avatars/customer-1.jpg',
      category: 'الکترونیک',
    },
    date: 'سه‌شنبه ۱۵ آذر ۱۴۰۳',
    status: 'active',
    team: [
      { avatar: '/avatars/team-1.jpg' },
      { avatar: '/avatars/team-2.jpg' },
      { avatar: '/avatars/team-3.jpg' },
    ],
  },
  {
    id: 'IVR/۲۰۲۴۰۳۰۱/۱۷/۱۷/۵۶۰۶۸۹۷۱۷',
    customer: {
      name: 'حامی دریب',
      avatar: '/avatars/customer-2.jpg',
      category: 'لباس‌ها',
    },
    date: 'جمعه ۵ فروردین ۱۴۰۴',
    status: 'delivered',
    team: [
      { avatar: '/avatars/team-4.jpg' },
      { avatar: '/avatars/team-5.jpg' },
    ],
  },
  {
    id: 'IVR/۲۰۲۴۰۳۰۱/۸/۱۸/۲۴۸۰۸۰۴۹۸',
    customer: {
      name: 'جواد رابرز',
      avatar: '/avatars/customer-3.jpg',
      category: 'کتاب‌ها',
    },
    date: 'یکشنبه ۱ اردیبهشت ۱۴۰۳',
    status: 'processing',
    team: [{ avatar: '/avatars/team-6.jpg' }],
  },
  {
    id: 'IVR/۲۰۲۴۰۳۰۱/۷/۱۸/۶۱۸۸۴۶۵۰۳۸',
    customer: {
      name: 'نام همکنی',
      avatar: '/avatars/customer-4.jpg',
      category: 'زیبایی و سلامت',
    },
    date: 'شنبه ۹ فروردین ۱۴۰۳',
    status: 'rejected',
    team: [
      { avatar: '/avatars/team-7.jpg' },
      { avatar: '/avatars/team-8.jpg' },
    ],
  },
  {
    id: 'IVR/۲۰۲۴۰۳۰۱/۱۷/۱۰/۶۲۶۴۷۲۹',
    customer: {
      name: 'لیوناردو دی‌کاپریو',
      avatar: '/avatars/customer-5.jpg',
      category: 'کتاب‌ها',
    },
    date: 'یکشنبه ۶ فروردین ۱۴۰۳',
    status: 'delivered',
    team: [
      { avatar: '/avatars/team-9.jpg' },
      { avatar: '/avatars/team-10.jpg' },
      { avatar: '/avatars/team-11.jpg' },
    ],
  },
];

const statusConfig = {
  active: {
    label: 'فعال',
    className: 'bg-green-100 text-green-700',
  },
  delivered: {
    label: 'تحویل شده',
    className: 'bg-gray-100 text-gray-700',
  },
  processing: {
    label: 'در حال پردازش',
    className: 'bg-yellow-100 text-yellow-700',
  },
  rejected: {
    label: 'رد شده',
    className: 'bg-red-100 text-red-700',
  },
};

export function RecentOrders() {
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg font-bold">سفارشات اخیر</CardTitle>
        <Button size="sm" className="gap-2" variant="ghost">
          مشاهده همه
          <ArrowLeft className="size-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-border/50">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-right font-semibold">
                  تاریخ
                </TableHead>
                <TableHead className="text-right font-semibold">
                  وضعیت
                </TableHead>
                <TableHead className="text-right font-semibold">
                  نام مشتری
                </TableHead>
                <TableHead className="text-right font-semibold">
                  پیوند
                </TableHead>
                <TableHead className="text-right font-semibold">تیم</TableHead>
                <TableHead className="text-right font-semibold">
                  عملیات
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordersData.map((order) => (
                <TableRow className="hover:bg-muted/30" key={order.id}>
                  <TableCell className="text-sm text-muted-foreground">
                    {order.date}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={cn(
                        'font-medium',
                        statusConfig[order.status].className,
                      )}
                    >
                      {statusConfig[order.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9 ring-2 ring-primary/10">
                        <AvatarImage
                          alt={order.customer.name}
                          src={order.customer.avatar}
                        />
                        <AvatarFallback className="bg-primary/10 text-xs text-primary">
                          {order.customer.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-foreground">
                          {order.customer.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {order.customer.category}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      className="h-8 gap-1 text-primary hover:text-primary/80"
                      variant="ghost"
                    >
                      <ExternalLink className="size-3" />
                      {order.id.slice(0, 20)}...
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center -space-x-2">
                      {order.team.map((member, idx) => (
                        <Avatar
                          className="size-8 border-2 border-card ring-1 ring-background"
                          // eslint-disable-next-line @eslint-react/no-array-index-key
                          key={idx}
                        >
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-muted text-xs">
                            T{idx + 1}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" className="size-8" variant="ghost">
                          <MoreVertical className="size-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>مشاهده جزئیات</DropdownMenuItem>
                        <DropdownMenuItem>ویرایش سفارش</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          حذف سفارش
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>نمایش</span>
            <select className="h-9 rounded-md border border-border bg-background px-3 text-sm">
              <option>۱۰</option>
              <option>۲۰</option>
              <option>۵۰</option>
            </select>
            <span>از ۱۰۰</span>
          </div>

          <div className="flex items-center gap-1">
            <Button size="icon" className="size-9" variant="outline">
              <ChevronRight className="size-4" />
            </Button>
            <Button size="sm" className="size-9" variant="outline">
              ۱
            </Button>
            <Button size="sm" className="size-9" variant="ghost">
              ۲
            </Button>
            <Button size="sm" className="size-9" variant="ghost">
              ۳
            </Button>
            <span className="px-2 text-muted-foreground">...</span>
            <Button size="icon" className="size-9" variant="outline">
              <ChevronLeft className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
