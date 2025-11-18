'use client';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4">
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinner {
          animation: spin 2s linear infinite;
        }
      `}</style>
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8 flex justify-center">
          <svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="spinner"
          >
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="8"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="8"
              strokeDasharray="78.5 314"
              strokeLinecap="round"
            />
          </svg>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            درحال بارگذاری...
          </h2>
          <p className="text-lg text-slate-600">
            لطفا صبر کن، ما در حال آماده کردن چیزای خوب برای تو هستیم! 😊
          </p>

          <div className="mt-8 space-y-2">
            <div className="w-64 h-2 bg-slate-200 rounded-full mx-auto overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-blue-600 to-blue-400 rounded-full"
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
