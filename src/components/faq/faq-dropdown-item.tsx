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
          'flex w-full items-center justify-between gap-2 rounded-[10px] px-4 py-2 transition-all',
          opened ? 'bg-light-purple' : 'bg-transparent',
        )}
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
            'relative h-[24px] w-[24px] rounded-full transition-all',
            opened ? 'bg-white' : 'bg-light-purple',
          )}
          onClick={() => setOpened((prev) => !prev)}
        >
          <div className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2 cursor-pointer text-[22px] font-semibold leading-[24px] text-[rgb(91,69,115)]">
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
