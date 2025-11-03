import { type Dispatch, type SetStateAction } from 'react';

import { Button } from '@/components/ui/button';
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowDown } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

type DropdownTradeButtonProps = {
  zapsSupported: boolean;
  selectedToken: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const DropdownTradeButton = ({
  zapsSupported,
  selectedToken,
  open,
  setOpen,
}: DropdownTradeButtonProps) => {
  const handleClick = () => {
    setOpen((open) => !open);
  };

  const btnElement = (
    <Button onClick={handleClick} variant="link">
      {selectedToken}{' '}
      <ArrowDown
        className={cn(open ? '-rotate-180' : '', 'transition-transform')}
      />
    </Button>
  );

  return zapsSupported ? (
    <CollapsibleTrigger asChild className="h-[26px] text-[12px]">
      {btnElement}
    </CollapsibleTrigger>
  ) : (
    btnElement
  );
};
