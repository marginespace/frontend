import { type FC, type ReactNode, useEffect, useRef, useState } from 'react';
import type * as React from 'react';

import { CheckOff } from '@/components/earn/dialogs/new-cube/ui/icons/check-off';
import { CheckOn } from '@/components/earn/dialogs/new-cube/ui/icons/check-on';
import { RadioOff } from '@/components/earn/dialogs/new-cube/ui/icons/radio-off';
import { RadioOn } from '@/components/earn/dialogs/new-cube/ui/icons/radio-on';
import { Input } from '@/components/earn/dialogs/new-cube/ui/input';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  isMulti?: boolean;
  options: Array<{
    name: string;
    value: string;
    icon: ReactNode;
    description?: string;
  }>;
}

type OnChanges = (val: string) => void;

export const Select: FC<InputProps> = ({
  onChange,
  options,
  isMulti = false,
  ...props
}) => {
  const inputReference = useRef<HTMLInputElement>(null);
  const [isShowMenu, setShowMenu] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<Array<number>>([]);

  const currentNames = selectedIndex.map((e) => options[e].name).join(',');
  const currentValues = selectedIndex.map((e) => options[e].value).join(',');

  const onChanges = onChange as unknown as OnChanges;

  useEffect(() => {
    onChanges(currentValues);
  }, [currentValues, onChanges, selectedIndex]);

  useEffect(() => {
    if (inputReference.current) {
      inputReference.current.focus();
    }
  }, [isShowMenu]);

  return (
    <div className="relative flex w-full flex-col">
      <div
        ref={inputReference}
        onBlur={() => setShowMenu(false)}
        tabIndex={0}
        className={cn(
          'absolute z-10 mt-[43px] flex w-full flex-col gap-[16px] rounded-[10px] bg-[#3E3C4B] p-[16px] shadow-2xl',
          !isShowMenu && 'hidden',
        )}
      >
        {options.map(({ name, icon, description }, index) => {
          const onClick = () => {
            if (isMulti) {
              if (selectedIndex.includes(index)) {
                setSelectedIndex((e) => e.filter((e) => e !== index));
                return;
              }
              setSelectedIndex((e) => [...e, index]);
              return;
            }
            setSelectedIndex([index]);
            setShowMenu(false);
          };

          const radio = selectedIndex.includes(index) ? (
            <RadioOn />
          ) : (
            <RadioOff />
          );
          const check = selectedIndex.includes(index) ? (
            <CheckOn />
          ) : (
            <CheckOff />
          );

          return (
            <div
              key={index}
              onClick={onClick}
              className="flex cursor-pointer flex-row items-center justify-between"
            >
              <div className="flex flex-row items-center gap-[8px]">
                {icon}
                {name}
              </div>
              <div className="flex flex-row items-center gap-[24px]">
                {description}
                {isMulti ? check : radio}
              </div>
            </div>
          );
        })}
      </div>
      <Input
        {...props}
        value={currentNames}
        readOnly
        onClick={() => setShowMenu(true)}
        autoFocus={false}
      />
    </div>
  );
};
