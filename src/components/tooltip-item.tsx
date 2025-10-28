'use client';

import { type ReactNode } from 'react';

import { Info } from './ui/icons';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type VaultTooltipProps = {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
};

export const TooltipItem = ({
  children,
  className,
  contentClassName,
}: VaultTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <span className={cn('inline-flex', className)}>
            <Info className="fill-light-purple inline-block h-[16px] w-[16px] cursor-pointer" />
          </span>
        </TooltipTrigger>
        <TooltipContent
          className={cn(
            'border-none bg-white p-3 text-base font-medium text-text-light',
            contentClassName,
          )}
        >
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
