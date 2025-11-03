'use client';
import { useRouter } from 'next/navigation';

import { Button, type ButtonProps } from '@/components/ui/button';
import { ArrowBack } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export type BackButtonProps = ButtonProps;

export const BackButton = ({ className, ...props }: BackButtonProps) => {
  const router = useRouter();
  const onClick = () => router.back();

  return (
    <Button
      onClick={onClick}
      variant="outlined"
      className={cn('text-[12px]', className)}
      {...props}
    >
      <ArrowBack className="mr-2 h-[20px] w-[20px]" /> Back
    </Button>
  );
};
