import React from 'react';

const LINK_GROUPS = [
  {
    id: 'customer-service',
    title: 'خدمات مشتریان',
    links: [
      {
        id: 'contact-us',
        text: 'تماس با ما',
        href: 'https://rojashop.com/posts/تماس-با-ما',
      },
      {
        id: 'order-guide',
        text: 'راهنمای سفارش و خرید',
        href: 'https://rojashop.com/posts/راهنمای-سفارش-و-خرید',
      },
      {
        id: 'gift-card',
        text: 'راهنمای استفاده از کارت هدیه',
        href: 'https://rojashop.com/landing/gift-card-usage-guide',
      },
      {
        id: 'faq',
        text: 'سوالات متداول',
        href: 'https://rojashop.com/posts/سوالات-متداول',
      },
    ],
  },
  {
    id: 'policies',
    title: 'سیاست‌ها و پشتیبانی',
    links: [
      {
        id: 'privacy',
        text: 'حریم خصوصی',
        href: 'https://rojashop.com/posts/حریم-خصوصی',
      },
      {
        id: 'rules',
        text: 'قوانین و مقررات',
        href: 'https://rojashop.com/posts/قوانین-و-مقررات',
      },
      {
        id: 'gift-sending',
        text: 'ارسال هدیه',
        href: 'https://rojashop.com/posts/ارسال-هدیه-برای-عزیزان',
      },
      { id: 'branches', text: 'فروشگاه‌های پرشین ویپ', href: '/branches' },
    ],
  },
  {
    id: 'about',
    title: 'درباره پرشین ویپ',
    links: [
      {
        id: 'about-us',
        text: 'درباره ما',
        href: 'https://rojashop.com/posts/درباره-ما',
      },
      { id: 'jobs', text: 'فرصت‌های شغلی', href: '/jobs' },
      { id: 'blog', text: 'مجله زیبایی', href: '/blog' },
    ],
  },
];

const FooterLinkColumns: React.FC = () => (
  <section
    aria-label="لینک‌های کمکی"
    className="grid grid-cols-2 gap-6 text-sm text-gray-600 sm:grid-cols-3"
  >
    {LINK_GROUPS.map((group) => (
      <div key={group.id}>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          {group.title}
        </h3>
        <ul className="space-y-2">
          {group.links.map((link) => (
            <li key={link.id}>
              <a
                className="transition-colors hover:text-gray-900"
                href={link.href}
              >
                {link.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </section>
);

export default FooterLinkColumns;
