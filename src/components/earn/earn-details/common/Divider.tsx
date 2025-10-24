import { type FC } from 'react';

import { cn } from '@/lib/utils';
import { VaultArrow } from '@/ui/icons';

interface IAccordionButton {
  opened: boolean;
  onClick: () => void;
}

export const AccordionButton: FC<IAccordionButton> = ({ opened, onClick }) => (
  <div className="flex w-full items-center gap-[26px]">
    <div className="border-in h-[1px] w-full border-[1px] border-dashed border-light-purple" />
    <div
      className={cn(
        opened ? 'rotate-180' : '',
        'transition-all',
        'cursor-pointer',
      )}
      onClick={onClick}
    >
      <VaultArrow />
    </div>
    <div className="border-in h-[1px] w-full border-[1px] border-dashed border-light-purple" />
  </div>
);

export const Divider: FC<{ color?: string }> = ({ color }) => (
  <div
    className={`border-in h-[1px] w-full border-[1px] border-dashed ${
      color ? `border-[${color}]` : 'border-light-grey'
    }`}
  />
);
