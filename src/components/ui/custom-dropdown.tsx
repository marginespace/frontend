'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CustomDropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'start' | 'end' | 'center';
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CustomDropdown = ({
  trigger,
  children,
  align = 'start',
  className,
  open: controlledOpen,
  onOpenChange,
}: CustomDropdownProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = onOpenChange || setInternalOpen;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen && mounted) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen, mounted]);

  const alignmentClass = {
    start: 'left-0',
    end: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  }[align];

  if (!mounted) {
    return (
      <div className="relative inline-block w-full md:w-auto">
        <div>{trigger}</div>
      </div>
    );
  }

  return (
    <div ref={dropdownRef} className="relative inline-block w-full md:w-auto">
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div
          ref={contentRef}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'absolute z-50 mt-[10px] animate-in fade-in-0 zoom-in-95 cursor-auto',
            alignmentClass,
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
};

