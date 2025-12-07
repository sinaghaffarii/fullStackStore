/* eslint-disable max-lines */
// components/ui/Sidebar.tsx
'use client';

import type { VariantProps } from 'class-variance-authority';

import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { PanelLeftIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Separator } from '@/components/ui/Separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/Sheet';
import { Skeleton } from '@/components/ui/Skeleton';
import { useMobile } from '@/hooks/useMobile';
import { cn } from '@/lib/utils';

import {
  TooltipContent,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from './Tooltip';

// ============================================================================
// Constants
// ============================================================================

const SIDEBAR_COOKIE_NAME = 'sidebar_state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3.5rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

// ============================================================================
// Context
// ============================================================================

interface SidebarContextProps {
  state: 'collapsed' | 'expanded';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null);
SidebarContext.displayName = 'SidebarContext';

function useSidebar() {
  const context = React.use(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }
  return context;
}

// ============================================================================
// Provider
// ============================================================================

interface SidebarProviderProps extends React.ComponentProps<'div'> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: SidebarProviderProps) {
  const isMobile = useMobile();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);

  const open = openProp ?? internalOpen;

  const setOpen = React.useCallback(
    (value: ((prev: boolean) => boolean) | boolean) => {
      const newState = typeof value === 'function' ? value(open) : value;

      if (setOpenProp) {
        setOpenProp(newState);
      } else {
        setInternalOpen(newState);
      }

      document.cookie = `${SIDEBAR_COOKIE_NAME}=${newState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open],
  );

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((prev) => !prev);
    } else {
      setOpen((prev) => !prev);
    }
  }, [isMobile, setOpen]);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSidebar]);

  const state = open ? 'expanded' : 'collapsed';

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
  );

  return (
    <SidebarContext value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-state={state}
          data-slot="sidebar-wrapper"
          className={cn(
            'group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar',
            className,
          )}
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
              '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext>
  );
}

// ============================================================================
// Sidebar Sub-Components (برای کاهش complexity)
// ============================================================================

function SidebarStatic({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar"
      className={cn(
        'flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface SidebarMobileProps extends React.ComponentProps<typeof Sheet> {
  side: 'left' | 'right';
  children: React.ReactNode;
}

function SidebarMobile({ side, children, ...props }: SidebarMobileProps) {
  const { openMobile, setOpenMobile } = useSidebar();

  return (
    <Sheet onOpenChange={setOpenMobile} open={openMobile} {...props}>
      <SheetContent
        className="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
        side={side}
        data-mobile="true"
        data-slot="sidebar"
        style={
          { '--sidebar-width': SIDEBAR_WIDTH_MOBILE } as React.CSSProperties
        }
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Sidebar</SheetTitle>
          <SheetDescription>Navigation sidebar</SheetDescription>
        </SheetHeader>
        <div className="flex size-full flex-col">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

interface SidebarDesktopProps extends React.ComponentProps<'div'> {
  side: 'left' | 'right';
  variant: 'floating' | 'inset' | 'sidebar';
  state: 'collapsed' | 'expanded';
  collapsible: 'icon' | 'offcanvas';
  children: React.ReactNode;
}

function SidebarDesktop({
  side,
  variant,
  state,
  collapsible,
  className,
  children,
  ...props
}: SidebarDesktopProps) {
  const isCollapsed = state === 'collapsed';
  const isFloating = variant === 'floating' || variant === 'inset';

  return (
    <div
      className="group peer hidden text-sidebar-foreground md:block"
      data-side={side}
      data-state={state}
      data-variant={variant}
      data-collapsible={isCollapsed ? collapsible : ''}
      data-slot="sidebar"
    >
      <div
        data-slot="sidebar-gap"
        className={cn(
          'relative bg-transparent transition-[width] duration-200 ease-linear',
          'w-(--sidebar-width)',
          'group-data-[collapsible=offcanvas]:w-0',
          'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
          isFloating &&
            'group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem)]',
        )}
      />

      <div
        data-slot="sidebar-container"
        className={cn(
          'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) md:flex',
          'transition-[left,right,width] duration-200 ease-linear',
          side === 'left' ? 'left-0' : 'right-0',
          'group-data-[collapsible=icon]:w-(--sidebar-width-icon)',
          isFloating
            ? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem)]'
            : cn(side === 'left' && 'border-r', side === 'right' && 'border-l'),
          className,
        )}
        {...props}
      >
        <div
          data-slot="sidebar-inner"
          className={cn(
            'flex size-full flex-col bg-sidebar',
            variant === 'floating' &&
              'rounded-lg border border-sidebar-border shadow-sm',
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Sidebar Main Component
// ============================================================================

interface SidebarProps extends React.ComponentProps<'div'> {
  side?: 'left' | 'right';
  variant?: 'floating' | 'inset' | 'sidebar';
  collapsible?: 'icon' | 'none' | 'offcanvas';
}

function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: SidebarProps) {
  const { isMobile, state } = useSidebar();

  if (collapsible === 'none') {
    return (
      <SidebarStatic className={className} {...props}>
        {children}
      </SidebarStatic>
    );
  }

  if (isMobile) {
    return (
      <SidebarMobile side={side} {...props}>
        {children}
      </SidebarMobile>
    );
  }

  return (
    <SidebarDesktop
      className={className}
      side={side}
      state={state}
      variant={variant}
      collapsible={collapsible === 'icon' ? 'icon' : 'offcanvas'}
      {...props}
    >
      {children}
    </SidebarDesktop>
  );
}

// ============================================================================
// Trigger & Rail
// ============================================================================

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      size="icon"
      className={cn('size-7', className)}
      variant="ghost"
      data-slot="sidebar-trigger"
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeftIcon className="size-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

function SidebarRail({ className, ...props }: React.ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      title="Toggle Sidebar"
      type="button"
      data-slot="sidebar-rail"
      onClick={toggleSidebar}
      className={cn(
        'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 sm:flex',
        'cursor-col-resize transition-all ease-linear',
        'group-data-[side=left]:-right-4 group-data-[side=right]:left-0',
        'after:absolute after:inset-y-0 after:left-1/2 after:w-0.5',
        'hover:after:bg-sidebar-border',
        className,
      )}
      {...props}
    />
  );
}

// ============================================================================
// Inset (Main Content Area)
// ============================================================================

function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        'relative flex w-full flex-1 flex-col bg-background',
        'md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:me-0',
        'md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm',
        className,
      )}
      {...props}
    />
  );
}

// ============================================================================
// Layout Components
// ============================================================================

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-2 p-2', className)}
      data-slot="sidebar-header"
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('flex flex-col gap-2 p-2', className)}
      data-slot="sidebar-footer"
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-content"
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-auto',
        'group-data-[collapsible=icon]:overflow-hidden',
        className,
      )}
      {...props}
    />
  );
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      className={cn('mx-2 w-auto bg-sidebar-border', className)}
      data-slot="sidebar-separator"
      {...props}
    />
  );
}

function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn('h-8 w-full bg-background shadow-none', className)}
      data-slot="sidebar-input"
      {...props}
    />
  );
}

// ============================================================================
// Group Components
// ============================================================================

function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-group"
      className={cn(
        'relative flex w-full min-w-0 flex-col p-2',
        'group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2',
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      data-slot="sidebar-group-label"
      className={cn(
        'flex h-8 shrink-0 items-center rounded-md px-2',
        'text-xs font-medium text-sidebar-foreground/70',
        'transition-[margin,opacity] duration-200 ease-linear',
        'group-data-[collapsible=icon]:sr-only',
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="sidebar-group-action"
      className={cn(
        'absolute end-3 top-3.5 flex size-5 items-center justify-center rounded-md',
        'text-sidebar-foreground ring-sidebar-ring outline-none',
        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        'focus-visible:ring-2',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  );
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      className={cn('w-full text-sm', className)}
      data-slot="sidebar-group-content"
      {...props}
    />
  );
}

// ============================================================================
// Menu Components
// ============================================================================

function SidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="sidebar-menu"
      className={cn(
        'flex w-full min-w-0 flex-col gap-1',
        'group-data-[collapsible=icon]:items-center',
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="sidebar-menu-item"
      className={cn(
        'group/menu-item relative w-full',
        'group-data-[collapsible=icon]:w-auto',
        className,
      )}
      {...props}
    />
  );
}

// ============================================================================
// Menu Button
// ============================================================================

const sidebarMenuButtonVariants = cva(
  cn(
    'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2',
    'text-left text-sm ring-sidebar-ring outline-none',
    'transition-[width,height,padding] duration-200',
    'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
    'focus-visible:ring-2',
    'disabled:pointer-events-none disabled:opacity-50',
    'data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground',
  ),
  {
    variants: {
      variant: {
        default: '',
        outline: 'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))]',
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface SidebarMenuButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  icon?: React.ReactNode;
}

interface SidebarMenuButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  suffix?: React.ReactNode;
}

// eslint-disable-next-line complexity
function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = 'default',
  size = 'default',
  tooltip,
  icon,
  badge,
  suffix,
  className,
  children,
  ...props
}: SidebarMenuButtonProps) {
  const { isMobile, state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const buttonClasses = cn(
    sidebarMenuButtonVariants({ variant, size }),
    'group-data-[collapsible=icon]:size-8',
    'group-data-[collapsible=icon]:justify-center',
    'group-data-[collapsible=icon]:p-0',
    className,
  );

  const buttonProps = {
    'data-slot': 'sidebar-menu-button',
    'data-active': isActive,
    'data-size': size,
    className: buttonClasses,
    ...props,
  };

  const content = (
    <>
      {icon && <span className="size-4 shrink-0 [&>svg]:size-4">{icon}</span>}
      {children && (
        <span className="flex-1 truncate group-data-[collapsible=icon]:hidden">
          {children}
        </span>
      )}
      {badge && !isCollapsed && <span className="shrink-0">{badge}</span>}
      {suffix && !isCollapsed && <span className="shrink-0">{suffix}</span>}
    </>
  );

  const button = asChild ? (
    <Slot {...buttonProps}>{children}</Slot>
  ) : (
    <button type="button" {...buttonProps}>
      {content}
    </button>
  );

  if (!tooltip) return button;

  const tooltipProps =
    typeof tooltip === 'string' ? { children: tooltip } : tooltip;

  return (
    <TooltipRoot>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        align="center"
        hidden={!isCollapsed || isMobile}
        side="right"
        {...tooltipProps}
      />
    </TooltipRoot>
  );
}

// ============================================================================
// Menu Action & Badge
// ============================================================================

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean;
  showOnHover?: boolean;
}) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="sidebar-menu-action"
      className={cn(
        'absolute end-1 top-1.5 flex size-5 items-center justify-center rounded-md',
        'text-sidebar-foreground ring-sidebar-ring outline-none',
        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        'focus-visible:ring-2',
        'group-data-[collapsible=icon]:hidden',
        showOnHover && 'opacity-0 group-hover/menu-item:opacity-100',
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      className={cn(
        'pointer-events-none absolute end-2 top-1.5',
        'flex h-5 min-w-5 items-center justify-center rounded-md px-1',
        'text-xs font-medium tabular-nums select-none',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  );
}

// ============================================================================
// Menu Skeleton
// ============================================================================

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  skeletonWidth = '70%',
  ...props
}: React.ComponentProps<'div'> & {
  showIcon?: boolean;
  skeletonWidth?: string;
}) {
  return (
    <div
      className={cn('flex h-8 items-center gap-2 rounded-md px-2', className)}
      data-slot="sidebar-menu-skeleton"
      {...props}
    >
      {showIcon && <Skeleton className="size-4 rounded-md" />}
      <Skeleton className="h-4 flex-1" style={{ maxWidth: skeletonWidth }} />
    </div>
  );
}

// ============================================================================
// Sub Menu Components
// ============================================================================

function SidebarMenuSub({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      className={cn(
        'mx-3.5 flex min-w-0 flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5',
        'group-data-[collapsible=icon]:hidden',
        className,
      )}
      {...props}
    />
  );
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<'li'>) {
  return (
    <li
      className={cn('relative', className)}
      data-slot="sidebar-menu-sub-item"
      {...props}
    />
  );
}

function SidebarMenuSubButton({
  asChild = false,
  size = 'md',
  isActive = false,
  className,
  ...props
}: React.ComponentProps<'a'> & {
  asChild?: boolean;
  size?: 'md' | 'sm';
  isActive?: boolean;
}) {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      data-size={size}
      data-active={isActive}
      data-slot="sidebar-menu-sub-button"
      className={cn(
        'flex h-7 min-w-0 items-center gap-2 overflow-hidden rounded-md px-2',
        'text-sidebar-foreground ring-sidebar-ring outline-none',
        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        'focus-visible:ring-2',
        'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
        '[&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        className,
      )}
      {...props}
    />
  );
}

// ============================================================================
// Exports
// ============================================================================

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
