'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import type { ICategory } from '@/types/category';

interface TreeNodeProps {
  category: ICategory;
  level?: number;
}

function TreeNode({ category, level = 0 }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = category.children && category.children.length > 0;

  return (
    <div>
      <div
        className="flex items-center gap-2 rounded-sm px-2 py-1 transition-colors"
        style={{ paddingRight: `${level * 1.5}rem` }}
      >
        {hasChildren ? (
          <button
            className="rounded-sm bg-accent p-0.5 transition-colors hover:bg-accent/80"
            type="button"
            onClick={() => setExpanded(!expanded)}
          >
            <motion.div
              animate={{ rotate: expanded ? 0 : -90 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="size-4" />
            </motion.div>
          </button>
        ) : (
          <span className="size-5" />
        )}
        <span className="text-sm">{category.name}</span>
        <span className="text-xs text-muted-foreground">({category.slug})</span>
      </div>

      <AnimatePresence initial={false}>
        {expanded && hasChildren && (
          <motion.div
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {category.children!.map((child) => (
              <TreeNode key={child.id} level={level + 1} category={child} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface Props {
  categories: ICategory[];
}

export function CategoryTreePreview({ categories }: Props) {
  if (categories.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center text-muted-foreground">
        هنوز دسته‌بندی‌ای ایجاد نشده است
      </div>
    );
  }

  return (
    <div className="mt-3 min-h-48 space-y-1 rounded-lg border p-2">
      {categories.map((cat) => (
        <TreeNode key={cat.id} category={cat} />
      ))}
    </div>
  );
}
