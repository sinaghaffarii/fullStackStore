import React from 'react';

const userMenuLinks = [
  {
    id: 'contact-us',
    href: 'https://rojashop.com/posts/تماس-با-ما',
    text: 'تماس با ما',
  },
  {
    id: 'about-us',
    href: 'https://rojashop.com/posts/درباره-ما',
    text: 'درباره ما',
  },
  { id: 'branches', href: '/branches', text: 'فروشگاه‌های فاران آرایشی' },
  {
    id: 'order-guide',
    href: 'https://rojashop.com/posts/راهنمای-سفارش-و-خرید',
    text: 'راهنمای سفارش و خرید',
  },
  {
    id: 'gift-card',
    href: 'https://rojashop.com/landing/gift-card-usage-guide',
    text: 'راهنمای استفاده از کارت هدیه',
  },
];

const auxiliaryMenuLinks = [
  {
    id: 'privacy',
    href: 'https://rojashop.com/posts/حریم-خصوصی',
    text: 'حریم خصوصی',
  },
  { id: 'jobs', href: '/jobs', text: 'فرصت‌های شغلی' },
  {
    id: 'rules',
    href: 'https://rojashop.com/posts/قوانین-و-مقررات',
    text: 'قوانین و مقررات',
  },
  {
    id: 'gift-sending',
    href: 'https://rojashop.com/posts/ارسال-هدیه-برای-عزیزان',
    text: 'ارسال هدیه',
  },
  {
    id: 'faq',
    href: 'https://rojashop.com/posts/سوالات-متداول',
    text: 'سوالات متداول',
  },
];

const LinkColumn: React.FC<{ title: string; links: typeof userMenuLinks }> = ({
  title,
  links,
}) => (
  <nav aria-label={title} className="space-y-2">
    <p className="text-sm font-semibold text-gray-900">{title}</p>
    <ul className="space-y-2 text-sm">
      {links.map((link) => (
        <li key={link.id}>
          <a
            className="text-gray-600 transition-colors hover:text-gray-900"
            href={link.href}
          >
            {link.text}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);

const LinkGroups: React.FC = () => (
  <div className="grid gap-6 sm:grid-cols-2">
    <LinkColumn links={userMenuLinks} title="خدمات مشتریان" />
    <LinkColumn links={auxiliaryMenuLinks} title="لینک‌های پشتیبان" />
  </div>
);

export default LinkGroups;
