import { type HTMLAttributes } from 'react';

import { TooltipItem } from '../tooltip-item';

import { cn } from '@/lib/utils';

export type VaultHeaderBadgeProps = {
  label: string;
  tooltipText?: string;
} & HTMLAttributes<HTMLDivElement>;

export const VaultHeaderBadge = ({
  className,
  label,
  tooltipText,
  children,
  ...props
}: VaultHeaderBadgeProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-x-2 rounded-[8px] bg-white bg-opacity-11 px-[16px] py-[8px] font-semibold backdrop-blur-2lg',
        className,
      )}
      {...props}
    >
      <div className="radix-popper-parent flex items-center gap-1">
        <div className="text-sm text-gray-350">{label}</div>
        {tooltipText && (
          <TooltipItem contentClassName="max-w-[250px] text-xs">
            {tooltipText}
          </TooltipItem>
        )}
      </div>
      <div className="text-base">{children}</div>
    </div>
  );
};
