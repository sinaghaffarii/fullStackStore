'use client';

import React, { useState } from 'react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <section className="bg-primary-light mx-auto w-11/12 py-16 text-black md:w-full">
      <div className="mx-auto max-w-7xl px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold">
          به خبرنامه فاران آرایشی بپیوندید
        </h2>
        <p className="text-text-darkGray mb-8 text-base">
          برای دریافت جدیدترین تخفیف‌ها، برندها و پیشنهادات ویژه ایمیل خود را
          وارد کنید.
        </p>
        <form
          className="mx-auto flex max-w-md flex-col items-center justify-center gap-3 sm:flex-row"
          onSubmit={handleSubmit}
        >
          <input
            required
            className="flex-1 rounded-lg border bg-muted p-3 focus:outline-none sm:rounded-l-lg"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ایمیل خود را وارد کنید"
          />
          <button
            className="rounded-lg bg-secondary px-6 py-3 text-white transition hover:bg-secondary/90 sm:rounded-r-lg"
            type="submit"
          >
            عضویت
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
