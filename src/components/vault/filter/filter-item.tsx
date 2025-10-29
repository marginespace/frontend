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
    <div className="group flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors hover:bg-primary/10">
      <div className="flex items-center gap-2">
        <label
          htmlFor={name}
          className="cursor-pointer text-[14px] font-medium text-[#374151] transition-colors group-hover:text-[#111827]"
        >
          {title}
        </label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex h-4 w-4 cursor-pointer items-center justify-center opacity-60 transition-opacity hover:opacity-100">
                  <InfoCircle />
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[250px] border-0 bg-[#0B0B0B] text-white">
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
        className="data-[state=checked]:bg-primary"
      >
        <SwitchThumb />
      </Switch>
    </div>
  );
};
