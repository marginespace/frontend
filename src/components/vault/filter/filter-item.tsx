'use client';

import { InfoCircle } from '@/components/ui/icons';
import { Switch, SwitchThumb } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {
  checked: boolean;
  title: string;
  name: string;
  tooltip?: string;
  handleChange: (name: string, val: boolean) => void;
};

export const FilterItem = ({
  title,
  checked,
  name,
  tooltip,
  handleChange,
}: Props) => {
  return (
    <div className="mb-[4px] flex justify-between py-[8px]">
      <div className="flex items-center">
        <label
          htmlFor={name}
          className="mr-[4px] text-[14px] font-medium text-[#0B0B0B]"
        >
          {title}
        </label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex h-[14px] w-[14px] cursor-pointer items-center justify-center">
                  <InfoCircle />
                </div>
              </TooltipTrigger>
              <TooltipContent className="border-0 bg-[#0B0B0B] text-white">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <Switch
        checked={checked}
        onCheckedChange={(val) => handleChange(name, val)}
        id={name}
      >
        <SwitchThumb />
      </Switch>
    </div>
  );
};
