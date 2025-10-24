import { Globe } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import { File } from '@/components/ui/icons';
import { getTokenAssetUrl } from '@/constants/assets';
import { chainImages } from '@/constants/vaults';
import { capitalize } from '@/helpers/capitalize';

export type AssetDetailsItemProps = {
  icons?: string[];
  title: string;
  description: string;
  platform?: string;
  chain?: string;
  websiteUrl?: string | null;
  contractUrl?: string | null;
  docsUrl?: string | null;
  vaultUrl?: string | null;
  strategyUrl?: string | null;
  withoutBG?: boolean;
};

export const AssetDetailsItem = ({
  icons,
  title,
  platform,
  chain,
  description,
  websiteUrl,
  contractUrl,
  docsUrl,
  strategyUrl,
  vaultUrl,
  withoutBG,
}: AssetDetailsItemProps) => {
  return (
    <div
      className={`${
        withoutBG ? '' : 'bg-transparent-bg-80'
      } mb-4 flex flex-col gap-[12px] rounded-[8px] ${
        withoutBG ? '' : 'px-[8px] py-[10px]'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[8px]">
          {icons && icons.length > 0 && (
            <div className="flex items-center gap-[4px]">
              {icons.map((icon) =>
                icon ? (
                  <Image
                    key={icon}
                    src={getTokenAssetUrl(icon)}
                    alt={icon}
                    width={16}
                    height={16}
                  />
                ) : null,
              )}
            </div>
          )}
          <div className="text-[14px] font-semibold text-white">{title}</div>
        </div>
        {platform && (
          <div className="flex items-center gap-[8px]">
            <div className="text-[12px] font-[500] text-text-purple">
              Platform
            </div>
            <div className="text-[12px] font-[500] text-white">{platform}</div>
          </div>
        )}
        {chain && (
          <div className="flex w-fit items-center gap-[6px] rounded-[4px] bg-white px-[3px] py-[2px] font-medium">
            <div className="scale-[0.67] [&>div]:h-[24px] [&>div]:w-[24px] [&>div]:bg-transparent">
              {chainImages[chain] ?? null}
            </div>
            <div className="text-[12px] font-[500] text-text">
              {capitalize(chain)}
            </div>
          </div>
        )}
      </div>
      <div className="text-sm font-medium">{description}</div>
      <div className="flex items-center gap-[16px]">
        {websiteUrl && (
          <Link
            href={websiteUrl}
            className={buttonVariants({ variant: 'link', className: '!p-0' })}
          >
            <Globe className="mr-2 h-[20px] w-[20px]" />
            Website
          </Link>
        )}
        {contractUrl && (
          <Link
            href={contractUrl}
            className={buttonVariants({ variant: 'link', className: '!p-0' })}
          >
            <Globe className="mr-2 h-[20px] w-[20px]" />
            Contract
          </Link>
        )}
        {docsUrl && (
          <Link
            href={docsUrl}
            className={buttonVariants({ variant: 'link', className: '!p-0' })}
          >
            <File className="mr-2 h-[20px] w-[20px] fill-white" />
            Docs
          </Link>
        )}
        {strategyUrl && (
          <Link
            href={strategyUrl}
            className={buttonVariants({ variant: 'link', className: '!p-0' })}
          >
            <Globe className="mr-2 h-[20px] w-[20px]" />
            Strategy
          </Link>
        )}
        {vaultUrl && (
          <Link
            href={vaultUrl}
            className={buttonVariants({ variant: 'link', className: '!p-0' })}
          >
            <Globe className="mr-2 h-[20px] w-[20px]" />
            Vault
          </Link>
        )}
      </div>
    </div>
  );
};
