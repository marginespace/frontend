'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useState } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type TNavbarItem } from '@/constants/navbarItems';

interface DropdownItemProps {
  item: TNavbarItem;
}

export const DropdownItem = ({ item }: DropdownItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="link"
          className={clsx('group', buttonVariants({ variant: 'link' }))}
        >
          <item.icon className="h-[18px] w-[18px] fill-white group-hover:fill-current" />
          {item.label ? <span className="ml-2">{item.label}</span> : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex w-[240px] flex-col gap-2 rounded-lg border-none bg-white bg-opacity-10 p-4 shadow-md backdrop-blur-lg">
        {item.nestedItems?.map((nestedItem) => (
          <DropdownMenuItem
            key={nestedItem.id}
            className="cursor-pointer px-3 py-2 text-base font-semibold text-white hover:!bg-light-purple"
          >
            {nestedItem.icon ? (
              <nestedItem.icon className="mr-2 h-[18px] w-[18px] fill-white group-hover:fill-current" />
            ) : null}
            <Link href={nestedItem.link}>{nestedItem.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
