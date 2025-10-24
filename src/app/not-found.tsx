'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/ui/button';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col justify-center bg-[#c6c6cc] bg-opacity-[0.1]">
      <div className="container flex flex-col">
        <div className="flex flex-col gap-[16px]">
          <div className="text-[16px] font-semibold uppercase text-[#C6C6CC]">
            The page not found
          </div>
          <div className="text-[64px] font-semibold text-white">404 error</div>
          <div className="text-[16px] font-semibold text-[#C6C6CC]">
            Looks like this page can&apos;t be found, maybe it got flushed?
          </div>
        </div>
        <div>
          <Button
            variant="contained"
            className="mt-[32px]"
            onClick={() => router.push('/')}
          >
            Go to Home page
          </Button>
        </div>
      </div>
    </div>
  );
}
