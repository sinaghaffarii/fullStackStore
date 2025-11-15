'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  HomeIcon,
  MailIcon,
  Instagram,
  Youtube,
  ArrowDown,
  SendIcon,
} from 'lucide-react';

const Footer = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <footer className="relative bg-white mt-auto max-w-[1400px] mx-auto w-11/12">
      {/* Top section - only displayed on desktop */}
      <section className="hidden lg:block absolute w-full -top-45 h-auto my-4">
        <div className="container mx-auto">
          <div className="bg-black w-full py-3 flex rounded justify-around items-center">
            {/* Contact information */}
            <div className="flex flex-col py-2 w-full px-5">
              <a href="tel:02157826000" className="text-right">
                <strong className="text-blue-500 text-sm font-semibold mb-1 block">
                  تماس با فاران: <span dir="ltr">021 8608 3140</span>
                </strong>
                <strong className="text-blue-500 text-sm font-semibold mb-1 block">
                  تماس با فاران: <span dir="ltr">021 8879 8540</span>
                </strong>
                <span className="text-white font-semibold text-sm block">
                  شنبه تا چهارشنبه از ساعت 9:00 تا 22:00
                </span>
                <span className="text-white font-semibold text-sm block">
                  پنج‌شنبه از ساعت 9:00 تا 19:00
                </span>
              </a>
            </div>

            {/* Newsletter form */}
            <div className="flex flex-col py-2 w-full px-5 border-r border-l border-gray-600">
              <strong className="text-white mb-2 font-semibold text-center text-sm">
                از تخفیف‌ها و جدیدترین‌های فاران شاپ باخبر شوید:
              </strong>
              <form className="gap-2 mt-2 flex">
                <Input
                  className="bg-gray-800 border-0 text-white placeholder-gray-400 w-[300px]"
                  placeholder="شماره موبایل یا ایمیل خود را وارد نمایید"
                />
                <Button
                  size={'lg'}
                  className="bg-blue-600 text-white hover:bg-blue-700 whitespace-nowrap"
                >
                  ارسال
                </Button>
              </form>
            </div>

            {/* Social networks */}
            <div className="flex flex-col py-2 w-full px-5 items-start">
              <strong className="text-white mb-2 font-semibold text-sm">
                فاران در شبکه های اجتماعی
              </strong>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  <Instagram className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                >
                  <SendIcon className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The main part of the footer */}
      <div className="container mx-auto pt-32 lg:pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* ستون اول - لوگو و اطلاعات تماس */}
          <div className="col-span-1 flex flex-col">
            <div className="flex justify-between items-center">
              {/* <img
                src="https://rojashop.com/assets/rojashopV2/images/logo.png"
                alt="Roja Shop"
                className="h-10 w-auto"
              /> */}
              <h1 className="text-2xl font-semibold text-primary whitespace-nowrap">
                FaranGallery
              </h1>
              <a
                href="tel:+982157826000"
                className="lg:hidden bg-black text-white px-3 py-2 rounded text-sm"
              >
                تماس با فاران
              </a>
            </div>

            <strong className="font-semibold my-3 text-gray-800">
              اطلاعات تماس
            </strong>

            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <HomeIcon className="w-4 h-4 text-black mt-0.5 shrink-0" />
                <div>
                  <strong>بخش اداری:</strong> تهران، بلوار میرداماد، جنب دفینه،
                  بازار بزرگ میرداماد، ساختمان اداری، ط ۴، واحد ۴۱۲
                </div>
              </div>

              <div className="flex items-start gap-2">
                <HomeIcon className="w-4 h-4 text-black mt-0.5 shrink-0" />
                <div>
                  <strong>آدرس فروشگاه:</strong>{' '}
                  <a
                    href="https://rojashop.com/branches"
                    className="text-black hover:underline"
                  >
                    فروشگاه های فاران
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MailIcon className="w-4 h-4 text-black mt-0.5 shrink-0" />
                <div>
                  <strong>پست الکترونیکی:</strong> online@rojagroup.com
                </div>
              </div>
            </div>
          </div>

          {/* Second and third columns - links */}
          <div className="col-span-1 lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* لینک‌های سمت راست */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* منو کاربری */}
                  <div>
                    <h3 className="sr-only">منو کاربری</h3>
                    <ul className="space-y-3 text-sm">
                      <li>
                        <a
                          href="https://rojashop.com/posts/تماس-با-ما"
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          تماس با ما
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://rojashop.com/posts/درباره-ما"
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          درباره ما
                        </a>
                      </li>
                      <li>
                        <a
                          href="/branches"
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          فروشگاه های فاران
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://rojashop.com/posts/راهنمای-سفارش-و-خرید"
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          راهنمای سفارش و خرید
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://rojashop.com/landing/gift-card-usage-guide"
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          راهنمای استفاده از کارت هدیه
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* auxiliary menu */}
                  <div>
                    <h3 className="sr-only">منو کمکی</h3>
                    <ul className="space-y-3 text-sm">
                      <li>
                        <a
                          href="https://rojashop.com/posts/حریم-خصوصی"
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          حریم خصوصی
                        </a>
                      </li>
                      <li>
                        <a
                          href="/jobs"
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          فرصت های شغلی
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://rojashop.com/posts/قوانین-و-مقررات"
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          قوانین و مقررات
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://rojashop.com/posts/ارسال-هدیه-برای-عزیزان"
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          ارسال هدیه
                        </a>
                      </li>
                      <li>
                        <a
                          href="https://rojashop.com/posts/سوالات-متداول"
                          className="text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          سوالات متداول
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Mobile section - form and social networks */}
                <div className="lg:hidden space-y-4">
                  <form className="flex gap-2">
                    <Input
                      placeholder="ایمیل یا شماره تماس خود را وارد کنید..."
                      className="flex-1"
                    />
                    <Button className="bg-blue-600 text-white hover:bg-blue-700">
                      ارسال
                    </Button>
                  </form>

                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gray-800 text-white hover:bg-gray-700"
                    >
                      <Instagram className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gray-800 text-white hover:bg-gray-700"
                    >
                      <Youtube className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-gray-800 text-white hover:bg-gray-700"
                    >
                      <span className="text-xs">آپارات</span>
                    </Button>
                  </div>
                </div>

                {/* Trust icons - desktop */}
                <div className="hidden lg:flex justify-between items-center">
                  <div className="bg-white rounded p-2">
                    <img
                      src="https://Trustseal.eNamad.ir/logo.aspx?id=85847&Code=Cr8BmH3ATXuWskUna2wf"
                      alt="نماد اعتماد الکترونیکی"
                      className="w-20 h-auto"
                    />
                  </div>
                  <div className="bg-white rounded p-2">
                    <img
                      src="https://logo.samandehi.ir/logo.aspx?id=1010075&p=nbpdlymanbpdlymalymayndtujyn"
                      alt="نماد ساماندهی"
                      className="w-20 h-auto"
                    />
                  </div>
                  <div className="bg-white rounded p-2">
                    <img
                      src="https://images.rojashop.com/pr:sharp/rs:fill:100:0:0/plain/s3://uploads/icons/logo-ecunion.png"
                      alt="اتحادیه"
                      className="w-20 h-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Left column - About us */}
              <div className="space-y-4">
                <strong className="font-semibold text-gray-800 text-lg">
                  زیبا بمانید
                </strong>

                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    isExpanded ? 'h-auto' : 'h-48'
                  }`}
                >
                  <p className="text-justify leading-7 text-gray-600 text-sm">
                    فاران شاپ یکی از معتبرترین فروشگاه‌های اینترنتی محصولات
                    آرایشی، بهداشتی و عطر است که با هدف ارائه بهترین و
                    باکیفیت‌ترین محصولات به مشتریان ایجاد شده است. فروشگاه
                    آرایشی و بهداشتی فارانشاپ، مجموعه‌ای گسترده از برندهای معروف
                    را در دسترس زیبادوستان قرار می‌دهد. شما می‌توانید انواع
                    محصولات آرایشی و بهداشتی از جمله کرم‌ها، لوازم آرایش، عطرها
                    و محصولات مراقبت از پوست و مو را در این فروشگاه آنلاین پیدا
                    کنید. فروشگاه معتبر خرید لوازم آرایشی و بهداشتی فارانشاپ
                    خدماتی مانند مشاوره آنلاین و راهنمای خرید نیز ارائه می‌دهد
                    تا مشتریان بتوانند بهترین انتخاب‌ها را داشته باشند. این
                    فروشگاه و سایت خرید لوازم آرایشی و بهداشتی با سیستم ارسال
                    سریع و بسته‌بندی مناسب، سعی دارد تا رضای مشتریان خود را جلب
                    کند. شما می‌توانید با خیال راحت محصولات زیبایی خود را خرید
                    کنید و از کیفیت بالای محصولات و خدمات بهره‌مند شوید.
                  </p>
                </div>

                <button
                  onClick={toggleExpand}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 transition-colors"
                >
                  {isExpanded ? 'نمایش کمتر' : 'نمایش بیشتر'}
                  <ArrowDown
                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>
              </div>
            </div>

            {/* Trust Symbols - Mobile */}
            <div className="lg:hidden flex justify-between items-center mt-6">
              <div className="bg-white rounded p-2">
                <img
                  src="https://Trustseal.eNamad.ir/logo.aspx?id=85847&Code=Cr8BmH3ATXuWskUna2wf"
                  alt="نماد اعتماد الکترونیکی"
                  className="w-16 h-auto"
                />
              </div>
              <div className="bg-white rounded p-2">
                <img
                  src="https://logo.samandehi.ir/logo.aspx?id=1010075&p=nbpdlymanbpdlymalymayndtujyn"
                  alt="نماد ساماندهی"
                  className="w-16 h-auto"
                />
              </div>
              <div className="bg-white rounded p-2">
                <img
                  src="https://images.rojashop.com/pr:sharp/rs:fill:100:0:0/plain/s3://uploads/icons/logo-ecunion.png"
                  alt="اتحادیه"
                  className="w-16 h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* بخش کپی رایت */}
      <div className="text-center w-full py-6 text-gray-500 text-sm border-t border-gray-200 mt-8">
        استفاده از مطالب فروشگاه اینترنتی فاران فقط برای مقاصد غیرتجاری و با ذکر
        منبع بلامانع است. کلیه حقوق این سایت متعلق به شرکت آ ریاس فارانن
        می‌باشد.
      </div>
    </footer>
  );
};

export default Footer;
