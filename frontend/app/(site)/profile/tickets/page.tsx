'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';

import { EmptyState } from '../+components/EmptyState';
import { NewTicketForm } from '../+components/NewTicketForm';
import { SectionHeader } from '../+components/SectionHeader';
import { TicketCard } from '../+components/TicketCard';

// نمونه داده
const mockTickets = [
  {
    id: '1',
    subject: 'مشکل در پرداخت آنلاین',
    department: 'امور مالی',
    status: 'answered' as const,
    lastUpdate: '2 ساعت پیش',
    hasNewReply: true,
  },
  {
    id: '2',
    subject: 'سوال درباره ارسال محصول',
    department: 'پشتیبانی فنی',
    status: 'open' as const,
    lastUpdate: '1 روز پیش',
    hasNewReply: false,
  },
  {
    id: '3',
    subject: 'درخواست مرجوعی کالا',
    department: 'محصولات',
    status: 'closed' as const,
    lastUpdate: '3 روز پیش',
    hasNewReply: false,
  },
];

export default function TicketsPage() {
  const [tickets, setTickets] = useState(mockTickets);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleNewTicket = async (data: any) => {
    // در پروژه واقعی اینجا API call می‌شود
    console.log('New ticket:', data);
    await await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionHeader title="تیکت های پشتیبانی" />
        <Button
          className="bg-rose-600 hover:bg-rose-700"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="ml-1.5 size-4" />
          تیکت جدید
        </Button>
      </div>

      {tickets.length === 0 ? (
        <EmptyState message="تیکتی ثبت نشده است" />
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} {...ticket} />
          ))}
        </div>
      )}

      {/* دیالوگ ایجاد تیکت جدید */}
      <Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>ایجاد تیکت جدید</DialogTitle>
          </DialogHeader>
          <NewTicketForm
            onCancel={() => setIsDialogOpen(false)}
            onSubmit={handleNewTicket}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
