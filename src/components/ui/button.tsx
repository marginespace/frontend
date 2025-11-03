import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[#D46B30] text-white shadow-[0_1px_2px_rgba(16,24,40,0.05)] hover:bg-[#B85A26] hover:shadow-[0_0_20px_rgba(212,107,48,0.4)] hover:scale-[1.02] transition-all duration-300 active:scale-[0.98]',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-[#D46B30] underline-offset-4 hover:underline hover:text-[#B85A26]',
        transparent:
          'border-[1px] border-light-grey bg-[rgba(255,255,255,0.08)]',
        'transparent-active': 'bg-light-purple border-[1px] border-light-grey',
        outlined:
          'text-[14px] border border-[#D46B30] text-white rounded-[10px] shadow-[0_1px_2px_rgba(16,24,40,0.05)]',
        'outline-primary':
          'bg-transparent border border-primary bg-gradient-to-r from-primary/10 via-primary/5 to-transparent text-white hover:border-primary-hover hover:bg-primary/10 hover:shadow-[0_0_15px_rgba(212,107,48,0.5)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]',
        contained: 'text-[16px] bg-[#D46B30] text-white rounded-[8px] hover:bg-[#B85A26] hover:shadow-[0_0_20px_rgba(212,107,48,0.4)] hover:scale-[1.02] transition-all duration-300 active:scale-[0.98]',
      },
      size: {
        default: 'h-10 px-3 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
