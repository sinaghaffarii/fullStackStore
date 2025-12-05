import { Instagram, Youtube } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const MobileNewsletterSection: React.FC = () => (
  <div className="space-y-4 lg:hidden">
    <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
      <Input
        className="flex-1"
        placeholder="ایمیل یا شماره تماس خود را وارد کنید..."
      />
      <Button className="bg-blue-600 text-white hover:bg-blue-700">
        ارسال
      </Button>
    </form>

    <div className="flex justify-center gap-2">
      <Button
        size="sm"
        className="bg-gray-800 text-white hover:bg-gray-700"
        variant="outline"
      >
        <Instagram className="size-4" />
      </Button>
      <Button
        size="sm"
        className="bg-gray-800 text-white hover:bg-gray-700"
        variant="outline"
      >
        <Youtube className="size-4" />
      </Button>
      <Button
        size="sm"
        className="bg-gray-800 text-white hover:bg-gray-700"
        variant="outline"
      >
        <span className="text-xs">آپارات</span>
      </Button>
    </div>
  </div>
);

export default MobileNewsletterSection;
