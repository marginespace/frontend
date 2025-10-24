'use client';

import { type HTMLAttributes } from 'react';

import { Input } from '@/components/ui/input';
import { SearchIcon } from '@/components/vault/search/search-icon';
import { cn } from '@/lib/utils';

export type SearchInput = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  value: string;
};

export const SearchInput = ({
  value,
  onChange,
  className,
  ...props
}: SearchInput) => {
  return (
    <div
      className={cn(
        'relative !m-0 flex w-full flex-1 justify-end self-center',
        className,
      )}
      {...props}
    >
      <Input
        className="w-[340px] rounded-[9px] border-none bg-white/20 py-[10px] pl-[16px] pr-[32px]"
        placeholder="Search address or domain..."
        value={value}
        onChange={onChange}
      />
      <SearchIcon className="absolute right-[16px] top-[12px]" />
    </div>
  );
};
