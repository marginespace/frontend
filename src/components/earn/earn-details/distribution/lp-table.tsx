import Image from 'next/image';
import { type FC, Fragment, type ReactNode } from 'react';

import { Divider } from '@/components/earn/earn-details/common/Divider';
import { getTokenAssetUrl } from '@/constants/assets';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Progress } from '@/ui/progress';

const LpRow: FC<{ values: [ReactNode, ReactNode, ReactNode] }> = ({
  values,
}) => {
  return (
    <>
      {values.map((item, index) => (
        <div
          key={index}
          className={`flex w-full justify-${index === 0 ? 'start' : 'end'}`}
        >
          {item}
        </div>
      ))}
    </>
  );
};

export interface IDataLpTable {
  name: string;
  percent: number;
  amount: string;
  value: string;
}

interface ILpTable {
  data: IDataLpTable[];
  needLight?: boolean;
}

export const LpTable: FC<ILpTable> = ({ data, needLight }) => {
  const isMobile = useMediaQuery('(max-width: 576px)');
  return (
    <div
      className={`grid-cols-1 md:grid-cols-lp ${
        needLight ? 'bg-transparent-bg' : 'bg-transparent-bg-darkest'
      } grid grid-rows-1 gap-[16px] rounded-[8px] px-4 py-3 md:gap-2`}
    >
      {!isMobile && (
        <LpRow
          values={[
            <div
              key="asset-label"
              className="text-[12px] font-[500] leading-[18px] text-light-grey"
            >
              Asset
            </div>,
            <div
              key="amount-label"
              className="text-[12px] font-[500] leading-[18px] text-light-grey"
            >
              Token Amount
            </div>,
            <div
              key="value-label"
              className="text-[12px] font-[500] leading-[18px] text-light-grey"
            >
              Value
            </div>,
          ]}
        />
      )}
      {data.map((item, index) => (
        <Fragment key={`${index}-${item.name}`}>
          <LpRow
            key={`${index}-${item.name}-${item.value}-${
              needLight ? 'true' : 'false'
            }`}
            values={[
              <div
                key={`asset-${index}-${item.name}-${item.value}`}
                className="flex w-full items-center justify-between"
              >
                <div className="flex items-center gap-[8px]">
                  <Image
                    width={16}
                    height={16}
                    src={getTokenAssetUrl(item.name)}
                    alt={item.name}
                  />
                  <div
                    className={`${
                      needLight ? 'text-text-grey' : 'text-white'
                    } text-[14px] font-semibold leading-[20px]`}
                  >
                    {item.name}
                  </div>
                </div>
                <div className="flex items-center gap-[8px]">
                  <div
                    className={`${
                      needLight ? 'text-text-contrast' : 'text-white'
                    } text-[14px] font-[500] leading-[20px]`}
                  >
                    {item.percent.toFixed(2)}%
                  </div>
                  <Progress
                    value={item.percent}
                    className={`h-[20px] w-[100px] bg-transparent-bg ${
                      needLight
                        ? '[&>div]:bg-text-contrast'
                        : '[&>div]:bg-light-purple'
                    }`}
                  />
                </div>
              </div>,
              <div
                key={`amount-${index}-${item.name}-${item.value}`}
                className="flex w-full items-center justify-between md:justify-end"
              >
                {isMobile && (
                  <div
                    className={`text-[12px] font-[500] leading-[18px] text-light-grey`}
                  >
                    Token Amount
                  </div>
                )}
                <div
                  className={`text-${
                    needLight ? 'text-grey' : 'white'
                  } text-[14px] font-semibold leading-[20px] underline md:no-underline`}
                >
                  {item.amount}
                </div>
              </div>,
              <div
                key={`value-${index}-${item.name}-${item.value}`}
                className="flex w-full items-center justify-between md:justify-end"
              >
                {isMobile && (
                  <div
                    className={`text-[12px] font-[500] leading-[18px] text-light-grey`}
                  >
                    Value
                  </div>
                )}
                <div
                  className={`text-${
                    needLight ? 'text-grey' : 'white'
                  } text-[14px] font-semibold leading-[20px] underline md:no-underline`}
                >
                  ${item.value}
                </div>
              </div>,
            ]}
          />
          {isMobile && index < data.length - 1 && <Divider />}
        </Fragment>
      ))}
    </div>
  );
};
