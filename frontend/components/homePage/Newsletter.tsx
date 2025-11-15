'use client';

import React, { useState } from 'react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // اینجا تابع ارسال ایمیل یا API call قرار بگیرد
    console.log('Subscribed:', email);
    setEmail('');
  };

  return (
    <section className="py-16 bg-primary-light text-black">
      <div className="mx-auto max-w-6xl px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">به خبرنامه فاران بپیوندید</h2>
        <p className="mb-8 text-base text-text-darkGray">
          برای دریافت جدیدترین تخفیف‌ها، برندها و پیشنهادات ویژه ایمیل خود را
          وارد کنید.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            required
            placeholder="ایمیل خود را وارد کنید"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 p-3 rounded-lg sm:rounded-l-lg focus:outline-none border bg-muted"
          />
          <button
            type="submit"
            className="bg-secondary text-white px-6 py-3 rounded-lg sm:rounded-r-lg hover:bg-secondary/90 transition"
          >
            عضویت
          </button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
