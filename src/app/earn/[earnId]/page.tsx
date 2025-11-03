import Image from 'next/image';

import { getAllTokens } from '@/actions/get-all-tokens';
import { getCubeById } from '@/actions/get-cube-by-id';
import { BackButton } from '@/components/back-button';
import { EarnDetails } from '@/components/earn/earn-details';
import EarnInteraction from '@/components/earn/earn-details/interaction';
import { TooltipItem } from '@/components/tooltip-item';
import { DescriptionItem } from '@/components/vault/description-item';
import {
  AccordionRoot,
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
} from '@/components/vault/vault-accordion';
import { getTokenAssetUrl } from '@/constants/assets';
import { appDescription, appName } from '@/constants/metadata';
import { apyFormatter } from '@/lib/apy-formatter';
import { cn } from '@/lib/utils';

type EarnPageProps = {
  params: {
    earnId: string;
  };
  searchParams: {
    address?: string;
  };
};

export const generateMetadata = async ({
  params: { earnId },
}: EarnPageProps) => {
  const vault = await getCubeById(earnId);

  return {
    title: `${appName}: ${vault ? vault.stable : 'Not found'}`,
    description: appDescription,
  };
};

const accordionStyles = cn(
  'rounded-[12px] bg-white bg-opacity-[0.11] p-[16px] backdrop-blur-[20px]',
);

const EarnPage = async ({ params: { earnId } }: EarnPageProps) => {
  const cube = await getCubeById(earnId);

  if (!cube) {
    return <div>Not found</div>;
  }

  const tokens = (await getAllTokens())[cube.network];

  return (
    <div className="container py-[40px]">
      <BackButton className="mb-[24px] lg:absolute lg:mb-0" />
      <div className="mx-auto flex max-w-[620px] flex-col gap-[24px]">
        <div className="text-[32px] font-semibold lg:text-center">
          {cube.name} Cube
        </div>
        <div className="flex items-center gap-3 lg:justify-center">
          <Image
            width={32}
            height={32}
            src={getTokenAssetUrl(cube.stable)}
            alt={cube.stable}
          />
        </div>
        <EarnInteraction cube={cube} tokens={tokens} />
        <div className="flex flex-col justify-between gap-[20px] rounded-[16px] bg-[#0E121B] bg-opacity-[0.80] p-[16px]">
          <DescriptionItem name="APY" value={apyFormatter(cube.avgAPY)} />
          <DescriptionItem
            name="Daily"
            value={apyFormatter(cube.avgAPY / 365)}
            icon={
              <TooltipItem>
                <p className="text-sm font-medium text-text-light">
                  Daily APY showcasing your potential daily earnings and growth
                </p>
              </TooltipItem>
            }
          />

          <DescriptionItem
            name="Earned Token"
            value={
              <div className="flex items-center gap-[16px]">
                <div className="flex gap-2">
                  <Image
                    key={cube.stable}
                    width={24}
                    height={24}
                    src={getTokenAssetUrl(cube.stable)}
                    alt={cube.stable}
                  />
                  <p className="text-[16px] font-bold text-white">
                    {cube.stable}
                  </p>
                </div>
              </div>
            }
          />
          <DescriptionItem name="Chain:" value={cube.network.toUpperCase()} />
          <DescriptionItem
            name="Platform:"
            value={cube.vaults
              .map((vault) => vault.platformId)
              .filter((value, index, array) => array.indexOf(value) === index)
              .join(', ')}
          />
        </div>
        <AccordionRoot defaultValue="0" collapsible type="single">
          <AccordionItem value="0">
            <AccordionTrigger className={accordionStyles}>
              Vault details
              <TooltipItem>
                <div className="flex w-[250px] flex-col gap-1">
                  <p className="text-xs font-semibold text-text">
                    Pay Attention!
                  </p>
                  <p className="text-xs font-medium text-text-light">
                    Please remember to read carefully all the information before
                    taking decision. Also please note that all elements are
                    clickable.
                  </p>
                </div>
              </TooltipItem>
            </AccordionTrigger>
            <AccordionContent>
              <EarnDetails cube={cube} />
            </AccordionContent>
          </AccordionItem>
        </AccordionRoot>
      </div>
    </div>
  );
};

export default EarnPage;
