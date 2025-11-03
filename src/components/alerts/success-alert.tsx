'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { type FC, type PropsWithChildren } from 'react';

import { TickCircle } from '@/ui/icons/tick-circle';

interface ISuccessAlert {
  open: boolean;
}

export const SuccessAlert: FC<ISuccessAlert & PropsWithChildren> = ({
  open,
  children,
}) => {
  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 animate-success bg-[#29305666]" />
        <Dialog.Content className="fixed inset-0 flex animate-success flex-col items-center justify-center">
          <div className="flex w-[311px] flex-col items-center justify-center gap-[16px] rounded-[24px] bg-[#272536] p-[24px]">
            <TickCircle />
            <div className="text-center text-[24px] font-semibold text-[#ffffff]">
              Success!
            </div>
            <div className="text-center text-[14px] font-medium text-[#F1F3F8]">
              {children}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
