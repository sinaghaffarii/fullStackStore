'use client';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-20 h-screen">
      <DotLottieReact src="/images/NotFound.json" autoplay loop />
      <p className="text-lg text-gray-500">Loading...</p>
    </div>
  );
}
