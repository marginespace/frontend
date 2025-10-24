import { type FC, type ReactNode } from 'react';

interface IFaqList {
  title: string;
  items: ReactNode[];
}

export const FaqList: FC<IFaqList> = ({ title, items }) => {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="text-[18px] font-semibold leading-[28px] text-text-grey">
        {title}
      </div>
      <div className="flex w-full flex-col">{items}</div>
    </div>
  );
};
