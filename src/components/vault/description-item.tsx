import { type FC, type ReactElement } from 'react';

export const DescriptionItem: FC<{
  name: string;
  value?: string | ReactElement;
  icon?: ReactElement;
}> = ({ name, value, icon }) => {
  return (
    <div className="flex flex-row gap-[16px] font-semibold">
      <div className="flex flex-row items-center justify-center gap-[4px] text-[14px] text-[#C6C6CC]">
        {name} {icon && icon}
      </div>
      {typeof value === 'string' || typeof value === 'undefined' ? (
        <div className="text-[16px] text-white">{value || ''}</div>
      ) : (
        value
      )}
    </div>
  );
};
