import {
  createContext,
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useClickAway } from 'react-use';

interface DialogContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setOpen: (value: boolean) => void;
  contentRef: React.RefObject<HTMLElement | null>;
}

const DialogContext = createContext<DialogContextValue | null>(null);
DialogContext.displayName = 'DialogContext';

interface DialogProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  closeOnOutsideClick?: boolean;
}

export function DialogProvider({
  children,
  defaultOpen = false,
  closeOnOutsideClick = true,
}: DialogProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLElement | null>(null);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  useClickAway(contentRef, () => {
    if (!closeOnOutsideClick || !isOpen) return;
    close();
  }, ['mousedown', 'touchstart']);

  const value = useMemo<DialogContextValue>(
    () => ({
      isOpen,
      open,
      close,
      toggle,
      setOpen: setIsOpen,
      contentRef,
    }),
    [isOpen, open, close, toggle],
  );

  return <DialogContext value={value}>{children}</DialogContext>;
}

export function useDialog() {
  const ctx = use(DialogContext);
  if (!ctx) {
    throw new Error('useDialog must be used inside DialogProvider');
  }
  return ctx;
}
