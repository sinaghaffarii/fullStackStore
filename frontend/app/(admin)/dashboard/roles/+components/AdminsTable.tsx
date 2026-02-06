'use client';

import type { ColumnDef } from '@tanstack/react-table';

import { Edit, Power, Shield, ShieldAlert } from 'lucide-react';
import { useState } from 'react';

import type { IAdmin } from '@/types/admin';

import { confirmAction } from '@/components/ui/Alert';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { useToggleAdminStatus } from '@/services/Admins';
import { topersianDate } from '@/utils/toPersianDate';

import { AdminModal } from './AdminModal';

interface Props {
  data: IAdmin[];
  isLoading: boolean;
}

export function AdminsTable({ data, isLoading }: Props) {
  const [editingAdmin, setEditingAdmin] = useState<IAdmin | null>(null);
  const { mutate: toggleStatus, isPending } = useToggleAdminStatus();

  const handleToggleStatus = async (admin: IAdmin) => {
    const action = admin.isActive ? 'غیرفعال' : 'فعال';
    const confirmed = await confirmAction({
      title: `${action} کردن ادمین`,
      text: `آیا از ${action} کردن ${admin.username} اطمینان دارید؟`,
      confirmButtonText: action,
      cancelButtonText: 'انصراف',
    });

    if (confirmed) {
      toggleStatus(admin.id);
    }
  };

  const columns: ColumnDef<IAdmin>[] = [
    {
      accessorKey: 'username',
      header: 'نام کاربری',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-cyan-500 text-sm font-semibold text-white">
            {row.original.username[0].toUpperCase()}
          </div>
          <span className="font-medium">{row.original.username}</span>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'ایمیل',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.email}
        </span>
      ),
    },
    {
      accessorKey: 'role',
      header: 'نقش',
      cell: ({ row }) => {
        const isSuperAdmin = row.original.role === 'super-admin';
        return (
          <Badge variant={isSuperAdmin ? 'destructive' : 'default'}>
            {isSuperAdmin ? (
              <>
                <ShieldAlert className="ml-1 size-3" />
                سوپر ادمین
              </>
            ) : (
              <>
                <Shield className="ml-1 size-3" />
                ادمین
              </>
            )}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'isActive',
      header: 'وضعیت',
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? 'success' : 'secondary'}>
          {row.original.isActive ? 'فعال' : 'غیرفعال'}
        </Badge>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'تاریخ ایجاد',
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {topersianDate(row.original.createdAt)}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'عملیات',
      cell: ({ row }) => {
        const isSuperAdmin = row.original.role === 'super-admin';
        return (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              disabled={isSuperAdmin}
              variant="outline"
              onClick={() => setEditingAdmin(row.original)}
              title={
                isSuperAdmin ? 'نمی‌توانید سوپر ادمین را ویرایش کنید' : 'ویرایش'
              }
            >
              <Edit className="size-4" />
            </Button>
            <Button
              size="sm"
              disabled={isSuperAdmin}
              variant={row.original.isActive ? 'destructive' : 'default'}
              onClick={() => handleToggleStatus(row.original)}
              title={
                isSuperAdmin
                  ? 'نمی‌توانید وضعیت سوپر ادمین را تغییر دهید'
                  : row.original.isActive
                    ? 'غیرفعال کردن'
                    : 'فعال کردن'
              }
            >
              <Power className="size-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataTable
        data={data}
        emptyMessage="ادمینی یافت نشد"
        columns={columns}
        isLoading={isLoading || isPending}
      />

      {editingAdmin && (
        <AdminModal
          admin={editingAdmin}
          isOpen={!!editingAdmin}
          onClose={() => setEditingAdmin(null)}
        />
      )}
    </>
  );
}
