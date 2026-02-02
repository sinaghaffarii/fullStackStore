import type { Metadata } from 'next';

import { AdminLoginForm } from '@/components/dashboard/admin/AdminLoginForm';

export const metadata: Metadata = {
  title: 'ورود به پنل مدیریت',
  description: 'صفحه ورود مدیران سایت',
  robots: 'noindex, nofollow',
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-xl bg-slate-900">
            <svg
              className="size-7 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
              />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-slate-900">پنل مدیریت</h1>
          <p className="mt-1 text-sm text-slate-500">
            برای ورود اطلاعات خود را وارد کنید
          </p>
        </div>

        <AdminLoginForm />

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} تمامی حقوق محفوظ است
        </p>
      </div>
    </div>
  );
}
