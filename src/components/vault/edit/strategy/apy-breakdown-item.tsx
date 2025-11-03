import { type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

export type ApyBreakdownItemProps = {
  label: string;
} & HTMLAttributes<HTMLDivElement>;

export const ApyBreakdownItem = ({
  label,
  children,
  className,
  ...props
}: ApyBreakdownItemProps) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-[2px] rounded-[8px] px-3 py-2',
        className,
      )}
      {...props}
    >
      <p className="text-sm font-semibold text-text-purple">{label}</p>
      <p className="text-xl font-semibold leading-[30px]">{children}</p>
    </div>
  );
};
