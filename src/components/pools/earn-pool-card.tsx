'use client';

import { useRouter } from 'next/navigation';
import {
  type CSSProperties,
  type MouseEvent,
  memo,
  useCallback,
  useRef,
} from 'react';

import { EarnInfoBlock } from './earn-info-block';

import { type selectedRowValue } from '../earn/pool';

import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { chainImages } from '@/constants/vaults';
import { apyFormatter } from '@/lib/apy-formatter';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/ui/accordion';
import { VaultArrow } from '@/ui/icons';

type PoolProps = {
  cube: CubeWithApyAndTvl;
  style?: CSSProperties;
  rowIndex: number;
  columnIndex: number;
  open: selectedRowValue;
  onClick: (
    rowIndex: number,
    columnIndex: number,
    value?: 'open' | 'boost',
  ) => void;
};
export const EarnPoolCard = memo(
  ({ cube, style, onClick, rowIndex, columnIndex, open }: PoolProps) => {
    const router = useRouter();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const openRef = useRef();
    const handleClick = useCallback(
      () => router.push(`/earn/${cube.id}`),

      [router, cube.id],
    );
    const handleOpen = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onClick(rowIndex, columnIndex, 'open');
      },
      [rowIndex, columnIndex, onClick],
    );

    return (
      <div className="group/card h-fit  transition-all" style={style}>
        <AccordionItem
          onClick={handleClick}
          value={`item-${cube.id}`}
          style={{
            boxShadow: '14px 14px 36px 0px rgba(113, 103, 185, 0.20)',
          }}
          className="border-primary block cursor-pointer rounded-[16px] border-2 bg-linear-black p-[16px] pb-0 transition-all backdrop-blur-[16px]"
        >
          <div className="mb-[12px] truncate">{cube.name || cube.id}</div>
          <div className="mb-[12px] flex items-center rounded-[8px] bg-gradient-to-r from-primary px-[12px] py-[10px] text-[16px] font-semibold text-black">
            {cube.stable}
          </div>
          <div className="relative flex justify-between  pb-[16px]">
            <div>
              <h3 className="text-[14px] font-semibold leading-[20px] text-light-grey">
                APY
              </h3>
              <div className="flex gap-2">
                <h4 className="text-[20px] font-semibold leading-[30px] text-primary">
                  {apyFormatter(cube.avgAPY)}
                </h4>
                {/* {vault.boost && (
                <div className="flex items-center gap-1 rounded-lg bg-light-purple px-2 py-[2px] text-xs text-primary">
                  Boost <InfoCircle light />
                </div>
              )} */}
              </div>
            </div>
            <div className="flex flex-col items-end justify-between">
              <h3 className="text-right text-[14px] font-semibold leading-[20px] text-light-grey">
                Chain
              </h3>
              {chainImages[cube.network] ? (
                chainImages[cube.network]
              ) : (
                <div>{cube.network}</div>
              )}
            </div>
            <span className="absolute  bottom-0 w-[40%] border-b-2 border-dashed border-additional-grey"></span>
            <span className="absolute  bottom-0 right-0 w-[40%] border-b-2 border-dashed border-additional-grey"></span>
          </div>
          <div className="relative flex -translate-y-[10px] justify-center overflow-hidden">
            <div className=" flex  w-[56px] justify-center bg-inherit">
              <AccordionTrigger
                className="p-0"
                chevronHidden
                onClick={handleOpen}
              >
                <div
                  className={`group transition-all ${open ? 'rotate-180' : ''}`}
                >
                  <VaultArrow />
                </div>
              </AccordionTrigger>
            </div>
          </div>

          <AccordionContent>
            <EarnInfoBlock cube={cube} />
          </AccordionContent>
        </AccordionItem>
      </div>
    );
  },
);

EarnPoolCard.displayName = 'EarnPoolCard';
