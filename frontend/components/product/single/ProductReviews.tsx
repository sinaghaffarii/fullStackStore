'use client';

import { Star, ThumbsDown, ThumbsUp, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Props {
  rating: number;
  count: number;
}

export function ProductReviews({ rating, count }: Props) {
  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <aside className="space-y-6 rounded-lg border border-gray-100 bg-gray-50/80 p-6 lg:sticky lg:top-24 lg:col-span-4">
        <div className="text-center">
          <p className="text-5xl font-black text-gray-900">{rating}</p>
          <div className="mt-2 flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={
                  s <= Math.round(rating)
                    ? 'size-4 fill-amber-400 text-amber-400'
                    : 'size-4 text-gray-300'
                }
              />
            ))}
          </div>
          <p className="mt-3 text-sm text-gray-500">بر اساس {count} دیدگاه</p>
        </div>

        <div className="space-y-3 text-xs text-gray-600">
          {[
            { label: 'کیفیت ساخت', val: 88 },
            { label: 'ارزش خرید', val: 74 },
            { label: 'دیزاین بسته‌بندی', val: 92 },
            { label: 'میزان چربی‌زایی', val: 67 },
          ].map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex justify-between">
                <span>{item.label}</span>
                <span>{(item.val / 20).toFixed(1)}</span>
              </div>
              <Progress className="h-2 bg-white" value={item.val} />
            </div>
          ))}
        </div>

        <Button variant="outline">ثبت دیدگاه جدید</Button>
      </aside>

      <div className="space-y-6 lg:col-span-8">
        {[1, 2, 3].map((item) => (
          <article
            className="rounded-lg border border-gray-100 p-4 shadow-sm"
            key={item}
          >
            <header className="mb-4 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <User className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    کاربر خریدار
                  </p>
                  <p className="text-xs text-gray-400">۱۴ آذر ۱۴۰۳</p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-semibold text-emerald-600">
                خرید تایید شده
              </span>
              <div className="ml-auto flex gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    className="size-3 fill-amber-400 text-amber-400"
                    key={s}
                  />
                ))}
              </div>
            </header>

            <p className="text-sm leading-7 text-gray-600">
              تجربه‌ی شخصی کاربر درباره‌ی کیفیت، بافت و اثرگذاری محصول...
            </p>

            <footer className="mt-4 flex items-center gap-4 text-xs text-gray-500">
              <span>آیا این دیدگاه مفید بود؟</span>
              <button
                className="flex items-center gap-1 hover:text-emerald-600"
                type="button"
              >
                <ThumbsUp className="size-4" /> (۱۲)
              </button>
              <button
                className="flex items-center gap-1 hover:text-rose-500"
                type="button"
              >
                <ThumbsDown className="size-4" /> (۰)
              </button>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
