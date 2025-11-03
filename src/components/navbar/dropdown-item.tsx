'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="link" className="group">
          <item.icon className="h-[18px] w-[18px] fill-white group-hover:fill-current" />
          {item.label ? <span className="ml-2">{item.label}</span> : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px] rounded-lg bg-white bg-opacity-10 p-2 shadow-lg backdrop-blur-lg">
        {item.nestedItems?.map((nestedItem) => (
          <DropdownMenuItem key={nestedItem.id} asChild>
            <Link
              href={nestedItem.link}
              className="flex cursor-pointer items-center rounded-sm px-3 py-2 text-sm font-medium text-white hover:bg-white hover:bg-opacity-20"
            >
              {nestedItem.icon ? (
                <nestedItem.icon className="mr-2 h-[18px] w-[18px] fill-white" />
              ) : null}
              {nestedItem.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
