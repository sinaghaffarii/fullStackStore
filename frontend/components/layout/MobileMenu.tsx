'use client';
import { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useClickAway } from 'react-use';
import { menuData } from '../ui/megaMenu';

export default function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );
  const ref = useRef<HTMLDivElement>(null);

  useClickAway(ref, onClose);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <nav className="py-2">
        {menuData.map((item) => (
          <div key={item.title}>
            {item.children && item.children.length > 0 ? (
              <div>
                <button
                  onClick={() => toggleExpanded(item.title)}
                  className="w-full px-4 py-2.5 text-right text-sm font-medium text-gray-700 hover:bg-pink-50 flex items-center justify-between transition-colors duration-200"
                >
                  <span>{item.title}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${
                      expandedItems[item.title] ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedItems[item.title] && (
                  <div className="bg-gray-50 border-t border-gray-100 animate-in fade-in duration-200">
                    {item.children.map((child) => (
                      <Link
                        key={child.title}
                        href={child.href || '#'}
                        onClick={onClose}
                        className="block px-6 py-2 text-sm text-gray-600 hover:text-pink-600 hover:bg-pink-50/50 transition-colors duration-200"
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                {item.href && (
                  <Link
                    href={item.href || '#'}
                    onClick={onClose}
                    className="block w-full px-4 py-2.5 text-right text-sm font-medium text-gray-700 hover:bg-pink-50 transition-colors duration-200"
                  >
                    {item.title}
                  </Link>
                )}
              </>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
