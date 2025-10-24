import Image from 'next/image';

import { getAllAdmins } from '@/actions/get-all-admins';
import { getAllHiddenVaults } from '@/actions/get-all-hidden-vaults';
import { getAllTokens } from '@/actions/get-all-tokens';
import { getVaultById } from '@/actions/get-vault-by-id';
import { BackButton } from '@/components/back-button';
import { TooltipItem } from '@/components/tooltip-item';
import { VaultMetrics } from '@/components/vault/metrics';
import { Trade } from '@/components/vault/trade';
import {
  AccordionRoot,
  AccordionTrigger,
  AccordionContent,
  AccordionItem,
} from '@/components/vault/vault-accordion';
import { VaultDetails } from '@/components/vault/vault-details';
import { VaultHeaderBadge } from '@/components/vault/vault-header-badge';
import { getTokenAssetUrl } from '@/constants/assets';
import { appDescription, appName } from '@/constants/metadata';
import { apyFormatter } from '@/lib/apy-formatter';
import { cn } from '@/lib/utils';

type VaultPageProps = {
  params: {
    vaultId: string;
  };
};

export const generateMetadata = async ({
  params: { vaultId },
}: VaultPageProps) => {
  const vault = await getVaultById(vaultId);

  return {
    title: `${appName}: ${vault ? vault.name : 'Not found'}`,
    description: appDescription,
  };
};

const accordionStyles = cn(
  'rounded-[12px] bg-white bg-opacity-[0.11] p-[16px] backdrop-blur-[20px]',
);

const VaultPage = async ({ params: { vaultId } }: VaultPageProps) => {
  const [vault, hiddenIds, admins] = await Promise.all([
    getVaultById(vaultId),
    getAllHiddenVaults(),
    getAllAdmins(),
  ]);

  if (!vault) {
    return <div>Not found</div>;
  }

  const tokens = (await getAllTokens())[vault.chain];

  return (
    <div className="container py-[40px]">
      <BackButton className="mb-[24px] lg:absolute lg:mb-0" />
      <div className="mx-auto flex max-w-[455px] flex-col gap-[24px]">
        <div className="text-[32px] font-semibold lg:text-center">
          {vault.name}
        </div>
        <div className="flex items-center gap-3 lg:justify-center">
          {vault.assets.map((asset) => (
            <Image
              key={asset}
              width={32}
              height={32}
              src={getTokenAssetUrl(asset)}
              alt={asset}
            />
          ))}
        </div>
        <Trade
          vault={vault}
          hiddenIds={hiddenIds}
          tokens={tokens}
          admins={admins}
        />
        <VaultMetrics vault={vault} />
        <AccordionRoot collapsible className={accordionStyles} type="single">
          <AccordionItem value="0">
            <AccordionTrigger>Info</AccordionTrigger>
            <AccordionContent>
              <VaultHeaderBadge label="Earned Token" className="w-full">
                <div className="flex gap-2">
                  <div className="flex items-center">
                    {vault.assets.map((asset) => (
                      <Image
                        className="-ml-1"
                        key={asset}
                        width={16}
                        height={16}
                        src={getTokenAssetUrl(asset)}
                        alt={asset}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-semibold">
                    {vault.assets.join('/')}
                  </p>
                </div>
              </VaultHeaderBadge>
              <VaultHeaderBadge
                className="w-full"
                label="Daily"
                tooltipText="Daily APY showcasing your potential daily earnings and growth"
              >
                {apyFormatter(
                  vault.apy.totalApy ? vault.apy.totalApy / 365 : 0,
                )}
              </VaultHeaderBadge>
              <VaultHeaderBadge
                className="w-full flex-1"
                label="Native APY"
                tooltipText="Original APY without additional temporary bonuses"
              >
                {apyFormatter(vault.apy.totalApy)}
              </VaultHeaderBadge>
              <VaultHeaderBadge
                className="w-full flex-1"
                label="Native Daily"
                tooltipText="Original Daily APY without additional temporary bonuses"
              >
                {apyFormatter(
                  vault.apy.totalApy ? vault.apy.totalApy / 365 : 0,
                )}
              </VaultHeaderBadge>
            </AccordionContent>
          </AccordionItem>
        </AccordionRoot>
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
              <VaultDetails vault={vault} />
            </AccordionContent>
          </AccordionItem>
        </AccordionRoot>
      </div>
    </div>
  );
};

export default VaultPage;
