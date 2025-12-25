'use client';

import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import type { ICategory } from '@/types/category';

import { Button } from '@/components/ui/Button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';

interface TreeNodeProps {
  category: ICategory;
  onSelect: (id: string) => void;
  selectedId?: string | null;
  excludeId?: string;
  level?: number;
}

function TreeNode({
  category,
  onSelect,
  selectedId,
  excludeId,
  level = 0,
}: TreeNodeProps) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  const isDisabled = category.id === excludeId;
  const isSelected = category.id === selectedId;

  return (
    <div>
      <button
        disabled={isDisabled}
        style={{ paddingRight: `${level * 1.5}rem` }}
        type="button"
        onClick={() => !isDisabled && onSelect(category.id)}
        className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent ${
          isSelected ? 'bg-accent font-medium' : ''
        } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        {hasChildren && (
          <button
            className="rounded-sm p-0.5 hover:bg-muted"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </button>
        )}
        <span className={!hasChildren ? 'mr-6' : ''}>{category.name}</span>
      </button>

      {expanded &&
        hasChildren &&
        category.children!.map((child) => (
          <TreeNode
            excludeId={excludeId}
            key={child.id}
            level={level + 1}
            selectedId={selectedId}
            category={child}
            onSelect={onSelect}
          />
        ))}
    </div>
  );
}

interface Props {
  categories: ICategory[];
  value?: string | null;
  onChange: (id: string | null) => void;
  label?: string;
  excludeId?: string;
}

export function CategoryTreeSelector({
  categories,
  value,
  onChange,
  label = 'دسته والد',
  excludeId,
}: Props) {
  const [open, setOpen] = useState(false);

  const selectedCategory = (function findById(
    cats: ICategory[],
  ): ICategory | undefined {
    for (const cat of cats) {
      if (cat.id === value) return cat;
      if (cat.children) {
        const found = findById(cat.children);
        if (found) return found;
      }
    }
  })(categories);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button className="w-full justify-between" variant="outline">
            {selectedCategory ? selectedCategory.name : 'بدون والد (سطح اول)'}
            <ChevronDown className="mr-2 size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-2">
          <div className="max-h-64 overflow-y-auto">
            <button
              className="w-full rounded-sm px-2 py-1.5 text-right text-sm hover:bg-accent"
              type="button"
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
            >
              بدون والد (سطح اول)
            </button>
            {categories.map((cat) => (
              <TreeNode
                excludeId={excludeId}
                key={cat.id}
                selectedId={value}
                category={cat}
                onSelect={(id) => {
                  onChange(id);
                  setOpen(false);
                }}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
