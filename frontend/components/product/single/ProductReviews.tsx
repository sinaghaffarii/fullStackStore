'use client';

import { Star, ThumbsUp, User } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface ProductReviewsProps {
  rating: number;
  count: number;
}

export function ProductReviews({ rating, count }: ProductReviewsProps) {
  return (
    <div dir="rtl" className="grid gap-8 lg:grid-cols-3">
      <ReviewSummary rating={rating} count={count} />
      <ReviewsList />
    </div>
  );
}

function ReviewSummary({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="rounded-xl bg-gray-50 p-6 text-center">
      <p className="text-5xl font-bold text-gray-900">{rating}</p>
      <div className="mt-2 flex justify-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={
              i <= Math.round(rating)
                ? 'size-4 fill-amber-400 text-amber-400'
                : 'size-4 text-gray-300'
            }
          />
        ))}
      </div>
      <p className="mt-2 text-sm text-gray-500">از {count} دیدگاه</p>
      <Button className="mt-4 w-full" variant="outline">
        ثبت دیدگاه
      </Button>
    </div>
  );
}

function ReviewsList() {
  const reviews = [
    {
      id: 1,
      user: 'کاربر خریدار',
      date: '۱۴ آذر ۱۴۰۳',
      text: 'محصول عالی بود، کیفیت بسته‌بندی و اصالت کالا تایید شده.',
      likes: 12,
      rating: 5,
    },
    {
      id: 2,
      user: 'خریدار تایید شده',
      date: '۱۰ آذر ۱۴۰۳',
      text: 'کیفیت خوبی داشت، ارسال هم سریع بود.',
      likes: 8,
      rating: 4,
    },
  ];

  return (
    <div className="space-y-4 lg:col-span-2">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
}

function ReviewCard({
  review,
}: {
  review: {
    id: number;
    user: string;
    date: string;
    text: string;
    likes: number;
    rating: number;
  };
}) {
  return (
    <article className="rounded-xl border border-gray-100 p-4">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-gray-100">
            <User className="size-5 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{review.user}</p>
            <p className="text-xs text-gray-400">{review.date}</p>
          </div>
        </div>

        {/* Stars aligned to left in RTL */}
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={
                i <= review.rating
                  ? 'size-3 fill-amber-400 text-amber-400'
                  : 'size-3 text-gray-300'
              }
            />
          ))}
        </div>
      </header>

      <p className="mt-3 text-sm leading-relaxed text-gray-600">
        {review.text}
      </p>

      <footer className="mt-3">
        <button
          className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600"
          type="button"
        >
          <ThumbsUp className="size-3" />
          مفید ({review.likes})
        </button>
      </footer>
    </article>
  );
}
