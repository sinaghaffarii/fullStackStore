import React from 'react';

import MobileNewsletterSection from './MobileNewsletter';

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
  { id: 'branches', href: '/branches', text: 'فروشگاه های فاران' },
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
  { id: 'jobs', href: '/jobs', text: 'فرصت های شغلی' },
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

const LinksSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="sr-only">منو کاربری</h3>
          <ul className="space-y-3 text-sm">
            {userMenuLinks.map((link) => (
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
        </div>

        <div>
          <h3 className="sr-only">منو کمکی</h3>
          <ul className="space-y-3 text-sm">
            {auxiliaryMenuLinks.map((link) => (
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
        </div>
      </div>

      <MobileNewsletterSection />
    </div>
  );
};

export default LinksSection;
