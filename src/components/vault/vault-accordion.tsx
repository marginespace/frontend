'use client';

import * as Accordion from '@radix-ui/react-accordion';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { SecondArrow } from '@/ui/icons';

export const AccordionRoot = React.forwardRef<
  React.ElementRef<typeof Accordion.Root>,
  React.ComponentPropsWithoutRef<typeof Accordion.Root>
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Root className={cn(className)} {...props} ref={forwardedRef}>
    <div>{children}</div>
  </Accordion.Root>
));

AccordionRoot.displayName = 'AccordionRoot';

export const AccordionItem = Accordion.Item;

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof Accordion.Trigger>,
  React.ComponentPropsWithoutRef<typeof Accordion.Trigger>
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Header className="flex flex-row">
    <Accordion.Trigger
      className={cn(
        'flex flex-1 flex-row items-center justify-center [&[data-state=open]>svg]:rotate-180',
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <div className="flex grow flex-row items-center gap-[4px] text-start text-[22px] font-semibold">
        {children}
      </div>
      <SecondArrow className="transition-all" />
    </Accordion.Trigger>
  </Accordion.Header>
));

AccordionTrigger.displayName = 'AccordionTrigger';

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof Accordion.Content>,
  React.ComponentPropsWithoutRef<typeof Accordion.Content>
>(({ children, className, ...props }, forwardedRef) => (
  <Accordion.Content
    className={cn(
      'overflow-hidden transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      className,
    )}
    {...props}
    ref={forwardedRef}
  >
    <div className="flex flex-col gap-[8px] pb-[8px] pt-[24px]">{children}</div>
  </Accordion.Content>
));

AccordionContent.displayName = 'AccordionContent';
