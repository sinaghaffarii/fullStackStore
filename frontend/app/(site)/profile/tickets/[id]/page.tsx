/* eslint-disable max-lines */
'use client';

import { ArrowRight, Headset, Send, User } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { cn } from '@/lib/utils';

import { SectionHeader } from '../../+components/SectionHeader';

interface Message {
  id: string;
  sender: 'support' | 'user';
  message: string;
  timestamp: string;
  senderName: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    sender: 'user',
    message:
      'سلام، من در پرداخت آنلاین مشکل دارم. وقتی روی دکمه پرداخت کلیک می‌کنم، صفحه بانک باز نمی‌شود.',
    timestamp: '1403/09/15 - 14:30',
    senderName: 'سینا غفاری',
  },
  {
    id: '2',
    sender: 'support',
    message:
      'سلام وقت بخیر. لطفا مرورگر خود را عوض کنید و دوباره امتحان کنید. همچنین مطمئن شوید که فیلترشکن شما خاموش است.',
    timestamp: '1403/09/15 - 16:20',
    senderName: 'تیم پشتیبانی',
  },
  {
    id: '3',
    sender: 'user',
    message: 'ممنون، مشکل حل شد.',
    timestamp: '1403/09/15 - 18:45',
    senderName: 'سینا غفاری',
  },
];

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    await new Promise((resolve) => {
      setTimeout(resolve, 500);
    });

    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        sender: 'user',
        message: newMessage,
        timestamp: new Date().toLocaleString('fa-IR'),
        senderName: 'سینا غفاری',
      },
    ]);
    setNewMessage('');
    setIsSending(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          size="sm"
          className="hover:bg-gray-100"
          variant="ghost"
          onClick={() => router.back()}
        >
          <ArrowRight className="size-4" />
        </Button>
        <SectionHeader
          className="flex-1"
          title={`تیکت شماره ${params.id} - مشکل در پرداخت آنلاین`}
        />
      </div>

      {/* پیام‌ها */}
      <div className="max-h-[600px] min-h-[400px] space-y-4 overflow-y-auto rounded-lg bg-gray-50 p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              'flex gap-3',
              msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row',
            )}
          >
            {/* آواتار */}
            <div
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-full',
                msg.sender === 'user'
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-blue-100 text-blue-600',
              )}
            >
              {msg.sender === 'user' ? (
                <User className="size-5" />
              ) : (
                <Headset className="size-5" />
              )}
            </div>

            {/* محتوای پیام */}
            <div
              className={cn(
                'max-w-[70%] flex-1',
                msg.sender === 'user' ? 'text-right' : 'text-left',
              )}
            >
              <div
                className={cn(
                  'rounded-lg p-4 shadow-sm',
                  msg.sender === 'user'
                    ? 'rounded-tr-none bg-rose-600 text-white'
                    : 'rounded-tl-none bg-white text-gray-800',
                )}
              >
                <p className="text-sm leading-relaxed">{msg.message}</p>
              </div>
              <div
                className={cn(
                  'mt-1 px-2 text-xs text-gray-500',
                  msg.sender === 'user' ? 'text-right' : 'text-left',
                )}
              >
                {msg.senderName} • {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* فرم ارسال پیام */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex gap-3">
          <Textarea
            className="flex-1 resize-none"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.ctrlKey) {
                handleSend();
              }
            }}
            placeholder="پیام خود را بنویسید..."
            rows={3}
          />
          <Button
            className="h-auto bg-rose-600 hover:bg-rose-700"
            disabled={isSending || !newMessage.trim()}
            onClick={handleSend}
          >
            <Send className="size-4" />
          </Button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          برای ارسال سریع از Ctrl + Enter استفاده کنید
        </p>
      </div>
    </div>
  );
}
