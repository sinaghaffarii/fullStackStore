'use client';

import { Loader2, LogOut } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { useLogout } from '@/services/auth/hooks';

export function LogoutButton() {
  const logoutMutation = useLogout();

  return (
    <Button
      size="sm"
      className="text-red-500 hover:bg-red-500/10 hover:text-red-500"
      disabled={logoutMutation.isPending}
      variant="ghost"
      onClick={() => logoutMutation.mutate()}
    >
      {logoutMutation.isPending ? (
        <Loader2 className="ml-2 size-4 animate-spin" />
      ) : (
        <LogOut className="ml-2 size-4" />
      )}
      خروج
    </Button>
  );
}
