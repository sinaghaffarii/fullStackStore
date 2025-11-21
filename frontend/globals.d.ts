declare module '*.css';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export {};
