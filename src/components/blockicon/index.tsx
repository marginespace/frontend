'use client';

import { renderIcon } from '@download/blockies';
import { useIsMounted } from '@redduck/helpers-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface BlockiconProps {
  address: string;
}

export const Blockicon = ({ address }: BlockiconProps) => {
  const isMounted = useIsMounted();
  const [dataUrl, setDataUrl] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef && address && isMounted) {
      const canvas = canvasRef.current;
      renderIcon({ seed: address.toLowerCase() }, canvas);
      if (canvas) {
        const updatedDataUrl = canvas.toDataURL();
        if (updatedDataUrl !== dataUrl) {
          setDataUrl(updatedDataUrl);
        }
      }
    }
  }, [dataUrl, address, isMounted]);

  return isMounted && address ? (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {dataUrl && (
        <Image
          src={dataUrl}
          alt={address}
          width={40}
          height={40}
          className="rounded-full"
          unoptimized
        />
      )}
    </>
  ) : (
    <div className="h-[20px] w-[20px] rounded-full bg-neutral-500" />
  );
};
