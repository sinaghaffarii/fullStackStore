'use client';

import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Sparkles, Filter, Grid3X3 } from 'lucide-react';

interface CategoryHeaderProps {
  title: string;
  description: string;
  productCount: number;
}

export function CategoryHeader({
  title,
  description,
  productCount,
}: CategoryHeaderProps) {
  return (
    <div className="bg-linear-to-r from-slate-900 to-indigo-900 rounded-2xl shadow-2xl p-6 mb-8 border border-slate-700 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-purple-500 to-pink-500 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-linear-to-tr from-cyan-500 to-blue-500 rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <Grid3X3 className="w-5 h-5 text-indigo-300" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                {title}
                <span className="inline-flex items-center gap-1 text-sm font-medium bg-indigo-500/30 text-indigo-100 px-2.5 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" />
                  {productCount} محصول
                </span>
              </h1>
            </div>

            <p className="text-slate-300 text-base max-w-2xl leading-relaxed">
              {description}
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
              <div className="flex items-center gap-2 text-slate-300 text-sm bg-slate-800/50 px-3 py-1.5 rounded-lg">
                <Filter className="w-4 h-4" />
                <span>فیلترهای فعال: ۲</span>
              </div>
              <button className="text-sm text-cyan-300 hover:text-cyan-200 transition-colors bg-cyan-900/30 hover:bg-cyan-900/50 px-3 py-1.5 rounded-lg">
                حذف همه فیلترها
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2">
              <Select>
                <SelectTrigger className="w-full sm:w-[200px] bg-white/10 border-slate-600 text-white hover:bg-white/15 transition-colors">
                  <SelectValue placeholder="مرتب سازی" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600 text-white">
                  <SelectGroup>
                    <SelectItem
                      value="0"
                      className="focus:bg-slate-700 focus:text-white"
                    >
                      پیش‌فرض
                    </SelectItem>
                    <SelectItem
                      value="1"
                      className="focus:bg-slate-700 focus:text-white"
                    >
                      ارزان‌ترین
                    </SelectItem>
                    <SelectItem
                      value="2"
                      className="focus:bg-slate-700 focus:text-white"
                    >
                      گران‌ترین
                    </SelectItem>
                    <SelectItem
                      value="3"
                      className="focus:bg-slate-700 focus:text-white"
                    >
                      پرفروش‌ترین
                    </SelectItem>
                    <SelectItem
                      value="4"
                      className="focus:bg-slate-700 focus:text-white"
                    >
                      محبوب‌ترین
                    </SelectItem>
                    <SelectItem
                      value="5"
                      className="focus:bg-slate-700 focus:text-white"
                    >
                      جدیدترین
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button className="px-4 py-2 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-indigo-500/25 flex items-center justify-center gap-2">
              <Filter className="w-4 h-4" />
              فیلترها
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
