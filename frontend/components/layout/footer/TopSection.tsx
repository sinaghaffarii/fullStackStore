import { Instagram, SendIcon } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TopSection: React.FC = () => (
  <section className="absolute -top-45 my-4 hidden h-auto w-full lg:block">
    <div className="container mx-auto">
      <div className="flex w-full items-center justify-around rounded-sm bg-black py-3">
        <div className="flex w-full flex-col px-5 py-2">
          <a className="text-right" href="tel:02157826000">
            <strong className="mb-1 block text-sm font-semibold text-blue-500">
              تماس با فاران: <span dir="ltr">021 8608 3140</span>
            </strong>
            <strong className="mb-1 block text-sm font-semibold text-blue-500">
              تماس با فاران: <span dir="ltr">021 8879 8540</span>
            </strong>
            <span className="block text-sm font-semibold text-white">
              شنبه تا چهارشنبه از ساعت 9:00 تا 22:00
            </span>
            <span className="block text-sm font-semibold text-white">
              پنج‌شنبه از ساعت 9:00 تا 19:00
            </span>
          </a>
        </div>

        <div className="flex w-full flex-col border-r border-l border-gray-600 px-5 py-2">
          <strong className="mb-2 text-center text-sm font-semibold text-white">
            از تخفیف‌ها و جدیدترین‌های فاران شاپ باخبر شوید:
          </strong>
          <form
            className="mt-2 flex gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              className="w-[300px] border-0 bg-gray-800 text-white placeholder-gray-400"
              placeholder="شماره موبایل یا ایمیل خود را وارد نمایید"
            />
            <Button
              size="lg"
              className="bg-blue-600 whitespace-nowrap text-white hover:bg-blue-700"
            >
              ارسال
            </Button>
          </form>
        </div>

        <div className="flex w-full flex-col items-start px-5 py-2">
          <strong className="mb-2 text-sm font-semibold text-white">
            فاران در شبکه های اجتماعی
          </strong>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
              variant="outline"
            >
              <Instagram className="size-4" />
            </Button>
            <Button
              size="sm"
              className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
              variant="outline"
            >
              <SendIcon className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default TopSection;
