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
    <div className="mb-[4px] flex justify-between py-[8px]">
      <div className="flex items-center">
        <label htmlFor={name} className="text-[14px] font-medium text-[#0B0B0B]">
          {title}
        </label>
      </div>
      <Checkbox
        checked={checked}
        onCheckedChange={(val) => handleChange(name, Boolean(val))}
        id={name}
        className="flex items-center justify-center"
      >
        <CheckboxIndicator />
      </Checkbox>
    </div>
  );
};
