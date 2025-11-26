'use client';

import { CheckCircle, Clock, MessageSquare, XCircle } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/src/lib/utils';

export type TicketStatus = 'answered' | 'closed' | 'open';

interface TicketCardProps {
  id: string;
  subject: string;
  department: string;
  status: TicketStatus;
  lastUpdate: string;
  hasNewReply?: boolean;
}

const statusConfig: Record<
  TicketStatus,
  { label: string; icon: React.ReactNode; color: string; bgColor: string }
> = {
  open: {
    label: 'در انتظار پاسخ',
    icon: <Clock className="size-4" />,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 border-orange-200',
  },
  answered: {
    label: 'پاسخ داده شده',
    icon: <CheckCircle className="size-4" />,
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
  },
  closed: {
    label: 'بسته شده',
    icon: <XCircle className="size-4" />,
    color: 'text-gray-700',
    bgColor: 'bg-gray-50 border-gray-200',
  },
};

export const TicketCard = ({
  id,
  subject,
  department,
  status,
  lastUpdate,
  hasNewReply = false,
}: TicketCardProps) => {
  const config = statusConfig[status];

  return (
    <Link
      className="group block rounded-xl border border-gray-200 bg-white p-4 transition-all hover:shadow-md"
      href={`/profile/tickets/${id}`}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="font-medium text-gray-900 transition-colors group-hover:text-rose-600">
              {subject}
            </h3>
            {hasNewReply && (
              <span className="flex size-2">
                <span className="absolute inline-flex size-2 animate-ping rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-rose-600"></span>
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{department}</p>
        </div>

        <MessageSquare className="size-5 text-gray-400 transition-colors group-hover:text-rose-600" />
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
            config.color,
            config.bgColor,
          )}
        >
          {config.icon}
          {config.label}
        </span>

        <span className="text-xs text-gray-500">
          آخرین بروزرسانی: {lastUpdate}
        </span>
      </div>
    </Link>
  );
};
