'use client';
import { type FC, useState } from 'react';

import { type IFaqDropdownItem } from '@/components/faq/config';
import { cn } from '@/lib/utils';

export const FaqDropdownItem: FC<IFaqDropdownItem> = ({ question, answer }) => {
  const [opened, setOpened] = useState(false);
  return (
    <div className="flex w-full flex-col">
      <div
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-[10px] px-4 py-2 transition-all hover:bg-primary/10 cursor-pointer',
          opened ? 'bg-primary/20' : 'bg-transparent',
        )}
        onClick={() => setOpened((prev) => !prev)}
      >
        <div
          className={cn(
            'max-w-[90%] text-[14px] font-[500] md:text-[16px]',
            opened ? 'text-white' : 'text-text-grey',
          )}
        >
          {question}
        </div>
        <div
          className={cn(
            'relative h-[24px] w-[24px] rounded-full transition-all flex items-center justify-center',
            opened ? 'bg-white' : 'bg-primary',
          )}
        >
          <div className="text-[18px] font-semibold leading-[24px] text-[#0B0B0B]">
            {opened ? '-' : '+'}
          </div>
        </div>
      </div>
      {opened && (
        <div className="white-scrollbar max-h-[550px] overflow-y-auto rounded-[10px] bg-transparent-bg-dark p-4 text-[14px] leading-[20px] text-light-grey md:bg-transparent">
          {answer}
        </div>
      )}
    </div>
  );
};
