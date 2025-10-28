'use client';

import * as SwitchMenu from '@radix-ui/react-switch';
import * as React from 'react';

import { cn } from '@/lib/utils';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchMenu.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchMenu.Root>
>(({ className, children, ...props }, ref) => (
  <SwitchMenu.Root
    ref={ref}
    className={cn(
      'data-[state=checked]:bg-primary relative block h-[20px] w-[36px] rounded-full bg-light-grey transition-all',
      className,
    )}
    {...props}
  >
    {children}
  </SwitchMenu.Root>
));
Switch.displayName = 'Switch';

const SwitchThumb = React.forwardRef<
  React.ElementRef<typeof SwitchMenu.SwitchThumb>,
  React.ComponentPropsWithoutRef<typeof SwitchMenu.SwitchThumb>
>(({ className, ...props }, ref) => (
  <SwitchMenu.SwitchThumb
    ref={ref}
    className={cn(
      'block h-[16px] w-[16px] translate-x-[2px] rounded-full bg-primary transition-all data-[state=checked]:translate-x-[18px]',
      className,
    )}
    {...props}
  />
));
SwitchThumb.displayName = 'SwitchThumb';

export { Switch, SwitchThumb };
