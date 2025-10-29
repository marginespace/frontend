'use client';

import { Checkbox, CheckboxIndicator } from '@/components/ui/checkbox';

type Props = {
  title: string;
  name: string;
  checked: boolean;
  handleChange: (name: string, val: boolean) => void;
};

export const FilterPlatform = ({
  title,
  name,
  handleChange,
  checked,
}: Props) => {
  return (
    <div className="group flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-primary/10">
      <label 
        htmlFor={name} 
        className="cursor-pointer text-[14px] font-medium text-[#374151] transition-colors group-hover:text-[#111827]"
      >
        {title}
      </label>
      <Checkbox
        checked={checked}
        onCheckedChange={(val) => handleChange(name, Boolean(val))}
        id={name}
        className="flex items-center justify-center border-primary data-[state=checked]:bg-primary"
      >
        <CheckboxIndicator />
      </Checkbox>
    </div>
  );
};
