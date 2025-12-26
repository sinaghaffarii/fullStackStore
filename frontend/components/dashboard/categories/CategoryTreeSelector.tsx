'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Folder, Search, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

import type { ICategory } from '@/types/category';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';

interface TreeNodeStateParams {
  category: ICategory;
  searchTerm: string;
  excludeId?: string;
  selectedId?: string | null;
}

function useTreeNodeState(params: TreeNodeStateParams) {
  const { category, searchTerm, excludeId, selectedId } = params;

  const hasChildren = Boolean(category.children?.length);
  const isExcluded = excludeId === category.id;
  const isSelected = category.id === selectedId;

  const matchesSearch = useMemo(() => {
    if (!searchTerm) return true;
    return category.name.toLowerCase().includes(searchTerm.toLowerCase());
  }, [category.name, searchTerm]);

  const hasMatchingChildren = useMemo(() => {
    if (!searchTerm || !hasChildren) return false;

    const checkChildren = (cats: ICategory[]): boolean =>
      cats.some(
        (cat) =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (cat.children && checkChildren(cat.children)),
      );

    return checkChildren(category.children!);
  }, [category.children, searchTerm, hasChildren]);

  const shouldExpand = Boolean(searchTerm && hasMatchingChildren);
  const shouldRender = matchesSearch || hasMatchingChildren;

  return {
    hasChildren,
    isExcluded,
    isSelected,
    matchesSearch,
    shouldExpand,
    shouldRender,
  };
}

function useCategoryPath(categories: ICategory[], value: string | null) {
  return useMemo(() => {
    const findPath = (
      cats: ICategory[],
      targetId: string | null,
      path: string[] = [],
    ): string[] | null => {
      if (!targetId) return null;

      for (const cat of cats) {
        if (cat.id === targetId) return [...path, cat.name];
        if (cat.children) {
          const found = findPath(cat.children, targetId, [...path, cat.name]);
          if (found) return found;
        }
      }
      return null;
    };

    return findPath(categories, value);
  }, [categories, value]);
}

interface ExpandButtonProps {
  expanded: boolean;
  onToggle: () => void;
}

function ExpandButton({ expanded, onToggle }: ExpandButtonProps) {
  return (
    <button
      className="shrink-0 rounded-sm p-0.5 hover:bg-accent"
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
    >
      <motion.div
        animate={{ rotate: expanded ? 0 : -90 }}
        transition={{ duration: 0.15 }}
      >
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </motion.div>
    </button>
  );
}

interface NodeLabelProps {
  name: string;
  childrenCount: number;
  isHighlighted: boolean;
  isDisabled: boolean;
  onSelect: () => void;
}

function NodeLabel({
  name,
  childrenCount,
  isHighlighted,
  isDisabled,
  onSelect,
}: NodeLabelProps) {
  return (
    <button
      className="flex flex-1 items-center gap-2 text-right text-sm"
      disabled={isDisabled}
      type="button"
      onClick={onSelect}
    >
      <Folder className="size-3.5 text-muted-foreground" />
      <span className={isHighlighted ? 'font-medium' : ''}>{name}</span>
      {childrenCount > 0 && (
        <span className="text-xs text-muted-foreground">({childrenCount})</span>
      )}
    </button>
  );
}

interface TreeNodeChildrenProps {
  children: ICategory[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  excludeId?: string;
  level: number;
  searchTerm: string;
}

function TreeNodeChildren({
  children,
  selectedId,
  onSelect,
  excludeId,
  level,
  searchTerm,
}: TreeNodeChildrenProps) {
  return (
    <>
      {children.map((child) => (
        <TreeNode
          excludeId={excludeId}
          key={child.id}
          level={level + 1}
          searchTerm={searchTerm}
          selectedId={selectedId}
          category={child}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}

interface TreeNodeProps {
  category: ICategory;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  excludeId?: string;
  level?: number;
  searchTerm?: string;
}

function getNodeClassName(isSelected: boolean, isExcluded: boolean): string {
  const base =
    'group flex items-center gap-2 rounded-md px-2 py-1.5 transition-colors';

  if (isSelected) return `${base} bg-primary/10 font-medium`;
  if (isExcluded) return `${base} cursor-not-allowed opacity-40`;

  return `${base} cursor-pointer hover:bg-accent`;
}

function TreeNode({
  category,
  selectedId,
  onSelect,
  excludeId,
  level = 0,
  searchTerm = '',
}: TreeNodeProps) {
  const state = useTreeNodeState({
    category,
    searchTerm,
    excludeId,
    selectedId,
  });

  const [manualExpanded, setManualExpanded] = useState(false);
  const expanded = state.shouldExpand || manualExpanded;

  if (!state.shouldRender) return null;

  const handleSelect = () => {
    if (!state.isExcluded) onSelect(category.id);
  };

  return (
    <div>
      <div
        className={getNodeClassName(state.isSelected, state.isExcluded)}
        style={{ paddingRight: `${level * 1.5 + 0.5}rem` }}
      >
        {state.hasChildren ? (
          <ExpandButton
            expanded={expanded}
            onToggle={() => setManualExpanded((prev) => !prev)}
          />
        ) : (
          <span className="size-4" />
        )}

        <NodeLabel
          isDisabled={state.isExcluded}
          isHighlighted={Boolean(state.matchesSearch && searchTerm)}
          name={category.name}
          childrenCount={category.children?.length ?? 0}
          onSelect={handleSelect}
        />
      </div>

      <AnimatePresence initial={false}>
        {expanded && state.hasChildren && (
          <motion.div
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden' }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <TreeNodeChildren
              children={category.children!}
              excludeId={excludeId}
              level={level}
              searchTerm={searchTerm}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

function SearchInput({ value, onChange, inputRef }: SearchInputProps) {
  return (
    <div className="sticky top-0 z-10 border-b bg-background p-3">
      <div className="relative">
        <Search className="absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pr-10"
          ref={inputRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="جستجوی دسته‌بندی..."
        />
        {value && (
          <button
            className="absolute top-1/2 left-3 -translate-y-1/2 rounded-sm p-1 hover:bg-accent"
            type="button"
            onClick={() => onChange('')}
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

interface Props {
  categories: ICategory[];
  value: string | null;
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
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedCategoryPath = useCategoryPath(categories, value);

  const displayLabel = selectedCategoryPath
    ? selectedCategoryPath.join(' > ')
    : 'بدون والد (سطح اول)';

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);

    if (isOpen) {
      void setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchTerm('');
    }
  };

  const handleSelect = (id: string | null) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <Popover onOpenChange={handleOpenChange} open={open}>
        <PopoverTrigger asChild>
          <Button
            className="h-auto min-h-10 w-full justify-between text-right whitespace-normal"
            variant="outline"
          >
            <span className="flex-1 truncate">{displayLabel}</span>
            <ChevronDown className="mr-2 size-4 shrink-0" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-96 p-0" sideOffset={5}>
          <SearchInput
            inputRef={searchInputRef}
            value={searchTerm}
            onChange={setSearchTerm}
          />

          <div className="max-h-80 overflow-y-auto p-2">
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className={`mb-1 w-full rounded-md px-2 py-1.5 text-right text-sm transition-colors ${
                value === null ? 'bg-primary/10 font-medium' : 'hover:bg-accent'
              }`}
            >
              <span className="flex items-center gap-2">
                <Folder className="size-3.5 text-muted-foreground" />
                بدون والد (سطح اول)
              </span>
            </button>

            {categories.length > 0 ? (
              categories.map((cat) => (
                <TreeNode
                  excludeId={excludeId}
                  key={cat.id}
                  searchTerm={searchTerm}
                  selectedId={value}
                  category={cat}
                  onSelect={handleSelect}
                />
              ))
            ) : (
              <div className="py-8 text-center text-sm text-muted-foreground">
                دسته‌بندی‌ای یافت نشد
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
