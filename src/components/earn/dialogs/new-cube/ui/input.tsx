import { type FC } from 'react';
import type * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      {...props}
      className={cn(
        'rounded-[8px] bg-[#ffffff1c] px-[16px] py-[7px]',
        className,
      )}
    />
  );
};
