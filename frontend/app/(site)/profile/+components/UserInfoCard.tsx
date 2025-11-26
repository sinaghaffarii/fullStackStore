import { Lock, LogOut, User } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface UserInfoCardProps {
  name: string;
  avatarUrl?: string;
}

export const UserInfoCard = ({ name, avatarUrl }: UserInfoCardProps) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-3 border-b border-gray-50 pb-4">
        <Avatar className="size-12 border border-gray-200">
          <AvatarImage alt={name} src={avatarUrl} />
          <AvatarFallback className="bg-gray-100 text-gray-500">
            <User className="size-6" />
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium text-gray-800">{name}</span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <Button
          size="sm"
          className="h-8 px-2 text-gray-500 hover:bg-rose-50 hover:text-rose-600"
          variant="ghost"
        >
          <Lock className="ml-1.5 size-3.5" />
          تغییر رمز عبور
        </Button>
        <Button
          size="sm"
          className="h-8 px-2 text-gray-500 hover:bg-rose-50 hover:text-rose-600"
          variant="ghost"
        >
          <LogOut className="ml-1.5 size-3.5" />
          خروج
        </Button>
      </div>
    </div>
  );
};
