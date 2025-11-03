'use client';

import { type ReactNode } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type VaultTooltipProps = {
  children?: ReactNode;
  tooltipComponent: ReactNode;
  className?: string;
};

export const TooltipItemExtended = ({
  children,
  tooltipComponent,
  className,
}: VaultTooltipProps) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          className={cn(
            'border-none bg-white p-3 text-base font-medium text-text-light',
            className,
          )}
        >
          {tooltipComponent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
