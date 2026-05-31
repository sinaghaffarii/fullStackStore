/* eslint-disable max-lines */
'use client';

import type {
  ColumnDef,
  PaginationState,
  SortingState,
} from '@tanstack/react-table';

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table';
import { cn } from '@/lib/utils';

// ============================================
// Types
// ============================================

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: PaginationState;
  onPaginationChange?: (pagination: PaginationState) => void;
  totalCount?: number;
  pageSizeOptions?: number[];
  isLoading?: boolean;
  className?: string;
  showPagination?: boolean;
  emptyMessage?: string;
}

interface PaginationProps<TData> {
  table: ReturnType<typeof useReactTable<TData>>;
  totalCount: number;
  pageSizeOptions: number[];
}

// ============================================
// Constants (✅ Fix unstable default props)
// ============================================

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 50];
const DEFAULT_PAGINATION = { pageIndex: 0, pageSize: 10 };

// ============================================
// Pagination Component (✅ Simplified)
// ============================================

function DataTablePagination<TData>({
  table,
  totalCount,
  pageSizeOptions,
}: PaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, totalCount);

  // ✅ ساده‌سازی محاسبه صفحات
  const getVisiblePages = () => {
    const pages: (number | 'dots')[] = [];
    const maxVisible = 3;

    if (pageCount <= maxVisible + 2) {
      return Array.from({ length: pageCount }, (_, i) => i);
    }

    pages.push(0);

    if (pageIndex > 2) pages.push('dots');

    const start = Math.max(1, pageIndex - 1);
    const end = Math.min(pageCount - 2, pageIndex + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (pageIndex < pageCount - 3) pages.push('dots');

    pages.push(pageCount - 1);

    return pages;
  };

  return (
    <div className="flex flex-col gap-3 px-2 py-3 sm:flex-row sm:items-center sm:justify-center">
      {/* Controls */}
      <div className="flex items-center gap-1">
        <Button
          size="icon"
          className="hidden size-8 sm:flex"
          disabled={!table.getCanPreviousPage()}
          variant="outline"
          onClick={() => table.setPageIndex(0)}
        >
          <ChevronsRight className="size-4" />
        </Button>

        <Button
          size="icon"
          className="size-8"
          disabled={!table.getCanPreviousPage()}
          variant="outline"
          onClick={() => table.previousPage()}
        >
          <ChevronRight className="size-4" />
        </Button>

        {/* ✅ استفاده از id به جای index */}
        {getVisiblePages().map((page, idx) =>
          page === 'dots' ? (
            <span className="px-2 text-muted-foreground" key={`dots-${idx}`}>
              ...
            </span>
          ) : (
            <Button
              size="sm"
              className="size-8"
              key={`page-${page}`}
              variant={pageIndex === page ? 'default' : 'ghost'}
              onClick={() => table.setPageIndex(page)}
            >
              {((page as number) + 1).toLocaleString('fa-IR')}
            </Button>
          ),
        )}

        <Button
          size="icon"
          className="size-8"
          disabled={!table.getCanNextPage()}
          variant="outline"
          onClick={() => table.nextPage()}
        >
          <ChevronLeft className="size-4" />
        </Button>

        <Button
          size="icon"
          className="hidden size-8 sm:flex"
          disabled={!table.getCanNextPage()}
          variant="outline"
          onClick={() => table.setPageIndex(pageCount - 1)}
        >
          <ChevronsLeft className="size-4" />
        </Button>
      </div>
    </div>
  );
}

// ============================================
// Main DataTable Component
// ============================================

export function DataTable<TData, TValue>({
  columns,
  data,
  pagination = DEFAULT_PAGINATION,
  onPaginationChange,
  totalCount = 0,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  isLoading = false,
  className,
  showPagination = true,
  emptyMessage = 'داده‌ای یافت نشد',
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const pageCount = React.useMemo(
    () => (totalCount > 0 ? Math.ceil(totalCount / pagination.pageSize) : 0),
    [totalCount, pagination.pageSize],
  );

  const table = useReactTable({
    data,
    columns,
    pageCount,
    state: { sorting, pagination },
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      if (!onPaginationChange) return;
      const newPagination =
        typeof updater === 'function' ? updater(pagination) : updater;
      onPaginationChange(newPagination);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  return (
    <div className="space-y-3">
      <div className={cn('overflow-hidden rounded-lg border', className)}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="bg-muted/50 hover:bg-muted/50"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="text-center font-semibold"
                    key={header.id}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  className="h-32 text-center"
                  colSpan={columns.length}
                >
                  <Loader2 className="mx-auto size-8 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="text-center hover:bg-muted/30"
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="h-32 text-center text-muted-foreground"
                  colSpan={columns.length}
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {showPagination && totalCount > 0 && (
        <DataTablePagination
          table={table}
          pageSizeOptions={pageSizeOptions}
          totalCount={totalCount}
        />
      )}
    </div>
  );
}

export type { PaginationState };
