'use client';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { CheckIcon } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      'data-[state=checked]:border-primary data-[state=checked]:bg-primary h-[20px] w-[20px] appearance-none rounded-[6px] border border-light-grey bg-transparent  outline-destructive  transition-all',
      className,
    )}
    {...props}
  >
    {children}
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = 'Checkbox';

const CheckboxIndicator = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Indicator ref={ref} className={className} {...props}>
    <CheckIcon className="h-4 w-4" />
  </CheckboxPrimitive.Indicator>
));
CheckboxIndicator.displayName = 'CheckboxIndicator';

export { Checkbox, CheckboxIndicator };
