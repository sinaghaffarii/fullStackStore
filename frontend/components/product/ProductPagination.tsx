'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../ui/button';

interface ProductPaginationProps {
  totalPages: number;
  currentPage?: number;
}

export function ProductPagination({
  totalPages,
  currentPage: initialPage = 1,
}: ProductPaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // اینجا می‌توانید routing یا fetch داده‌های جدید انجام دهید
    console.log('Page changed to:', page);
  };

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        className="flex size-8 items-center justify-center rounded-lg border border-gray-300 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={currentPage === 1}
        variant="outline"
        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
      >
        <ChevronRight className="size-5" />
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant="outline"
          onClick={() => handlePageChange(page)}
          className={`flex size-8 items-center justify-center rounded-lg border text-sm ${
            page === currentPage
              ? 'border-blue-600 bg-blue-600 text-white'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {page}
        </Button>
      ))}

      <Button
        className="flex size-8 items-center justify-center rounded-lg border border-gray-300 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={currentPage === totalPages}
        variant="outline"
        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
      >
        <ChevronLeft className="size-5" />
      </Button>
    </div>
  );
}
