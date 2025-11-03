'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';

import { navbarItems } from '@/constants/navbarItems';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
} from '@/components/ui/dialog';
import { EthereumButton } from './ethereum-btn';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const pathname = usePathname();

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/60 backdrop-blur-sm" />
      <DialogContent className="fixed left-0 top-0 h-full w-[280px] max-w-[85vw] translate-x-0 translate-y-0 rounded-r-[20px] rounded-l-none border-r border-primary/20 bg-gradient-to-b from-[rgba(11,11,11,0.95)] via-[rgba(11,11,11,0.98)] to-[rgba(11,11,11,0.95)] p-0 shadow-[0_0_40px_rgba(212,107,48,0.3)] data-[state=open]:animate-slide-in-from-left data-[state=closed]:animate-slide-out-to-left">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-primary/20 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Menu</h2>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition-all hover:bg-primary/20 hover:text-primary"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex flex-1 flex-col gap-2 overflow-y-auto px-4 py-6">
            {navbarItems.map((item) =>
              item.nestedItems?.length ? (
                <div key={item.id} className="mb-2">
                  {item.nestedItems.map((nestedItem) => {
                    const isActive = pathname === nestedItem.pathname;
                    return (
                      <Link
                        key={nestedItem.id}
                        href={nestedItem.link || '#'}
                        onClick={handleLinkClick}
                        className={`group flex items-center gap-3 rounded-[12px] px-4 py-3 text-[15px] font-medium transition-all duration-300 ${
                          isActive
                            ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(212,107,48,0.2)]'
                            : 'text-white hover:bg-primary/10 hover:text-primary'
                        }`}
                      >
                        {nestedItem.icon && (
                          <nestedItem.icon className="h-[20px] w-[20px] fill-current transition-transform duration-300 group-hover:scale-110" />
                        )}
                        {nestedItem.label}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <Link
                  key={item.id}
                  href={item.link || '#'}
                  onClick={handleLinkClick}
                  className={`group flex items-center gap-3 rounded-[12px] px-4 py-3 text-[15px] font-medium transition-all duration-300 ${
                    pathname === item.pathname
                      ? 'bg-primary/20 text-primary shadow-[0_0_10px_rgba(212,107,48,0.2)]'
                      : 'text-white hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  <item.icon className="h-[20px] w-[20px] fill-current transition-transform duration-300 group-hover:scale-110" />
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* Footer with Ethereum Button */}
          <div className="border-t border-primary/20 p-4">
            <EthereumButton className="w-full justify-center" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

