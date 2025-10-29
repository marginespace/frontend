'use client';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useState } from 'react';

export const EarnTitleInfo = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const handleClick = useCallback(() => {
    setIsClicked(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClicked(false);
    }, 150);
  }, []);

  return (
    <div
      className={`flex transition-all ${isClicked && 'opacity-0'} ${
        isOpen ? 'block' : 'hidden'
      } items-center justify-between rounded-[16px] bg-[rgba(255,255,255,0.11)] px-4 py-2 md:justify-normal`}
    >
      <h2 className="mr-3 text-base text-primary">
        All vaults posted here use our platform{' '}
        <Link
          className="text-white underline underline-offset-[3px]"
          href={'/'}
        >
          Margin Space
        </Link>
      </h2>
      <div className="text-primary" onClick={handleClick}>
        <X width={18} height={18} cursor={'pointer'} />
      </div>
    </div>
  );
};
