'use client';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4">
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinner {
          animation: spin 2s linear infinite;
        }
      `}</style>
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-8 flex justify-center">
          <svg
            height="120"
            width="120"
            className="spinner"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 120 120"
          >
            <circle
              cx="60"
              cy="60"
              fill="none"
              r="50"
              stroke="#e2e8f0"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              fill="none"
              r="50"
              stroke="#3b82f6"
              strokeDasharray="78.5 314"
              strokeLinecap="round"
              strokeWidth="8"
            />
          </svg>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">
            درحال بارگذاری...
          </h2>
          <p className="text-lg text-slate-600">
            لطفا صبر کن، ما در حال آماده کردن چیزای خوب برای تو هستیم! 😊
          </p>

          <div className="mt-8 space-y-2">
            <div className="mx-auto h-2 w-64 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-linear-to-r from-blue-600 to-blue-400"
                style={{
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}
              />
            </div>
            <p className="text-sm text-slate-500">چند لحظه دیگر...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
