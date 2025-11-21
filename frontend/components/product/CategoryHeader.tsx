'use client';

import { Filter, Grid3X3, Sparkles } from 'lucide-react';

import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

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
    <div className="relative mb-8 overflow-hidden rounded-2xl border border-slate-700 bg-linear-to-r from-slate-900 to-indigo-900 p-6 shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 size-64 translate-x-32 -translate-y-32 rounded-full bg-linear-to-br from-purple-500 to-pink-500"></div>
        <div className="absolute bottom-0 left-0 size-48 -translate-x-24 translate-y-24 rounded-full bg-linear-to-tr from-cyan-500 to-blue-500"></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-indigo-500/20 p-2">
                <Grid3X3 className="size-5 text-indigo-300" />
              </div>
              <h1 className="flex items-center gap-2 text-2xl font-bold text-white md:text-3xl">
                {title}
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/30 px-2.5 py-0.5 text-sm font-medium text-indigo-100">
                  <Sparkles className="size-3" />
                  {productCount} محصول
                </span>
              </h1>
            </div>

            <p className="max-w-2xl text-base leading-relaxed text-slate-300">
              {description}
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-slate-800/50 px-3 py-1.5 text-sm text-slate-300">
                <Filter className="size-4" />
                <span>فیلترهای فعال: ۲</span>
              </div>
              <Button className="rounded-lg bg-cyan-900/30 px-3 py-1.5 text-sm text-cyan-300 transition-colors hover:bg-cyan-900/50 hover:text-cyan-200">
                حذف همه فیلترها
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center gap-2">
              <Select>
                <SelectTrigger className="w-full border-slate-600 bg-white/10 text-white transition-colors hover:bg-white/15 sm:w-[200px]">
                  <SelectValue placeholder="مرتب سازی" />
                </SelectTrigger>
                <SelectContent className="border-slate-600 bg-slate-800 text-white">
                  <SelectGroup>
                    <SelectItem
                      className="focus:bg-slate-700 focus:text-white"
                      value="0"
                    >
                      پیش‌فرض
                    </SelectItem>
                    <SelectItem
                      className="focus:bg-slate-700 focus:text-white"
                      value="1"
                    >
                      ارزان‌ترین
                    </SelectItem>
                    <SelectItem
                      className="focus:bg-slate-700 focus:text-white"
                      value="2"
                    >
                      گران‌ترین
                    </SelectItem>
                    <SelectItem
                      className="focus:bg-slate-700 focus:text-white"
                      value="3"
                    >
                      پرفروش‌ترین
                    </SelectItem>
                    <SelectItem
                      className="focus:bg-slate-700 focus:text-white"
                      value="4"
                    >
                      محبوب‌ترین
                    </SelectItem>
                    <SelectItem
                      className="focus:bg-slate-700 focus:text-white"
                      value="5"
                    >
                      جدیدترین
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <Button className="flex items-center justify-center gap-2 rounded-lg bg-linear-to-r from-indigo-500 to-purple-600 px-4 py-2 font-medium text-white shadow-lg transition-all duration-300 hover:from-indigo-600 hover:to-purple-700 hover:shadow-indigo-500/25">
              <Filter className="size-4" />
              فیلترها
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
