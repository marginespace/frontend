'use client';
import { useQueryClient } from '@tanstack/react-query';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { type Address, parseUnits } from 'viem';
import { usePublicClient, useWalletClient } from 'wagmi';

import { Interaction } from './interaction';
import { VaultEditDetails } from './vault-edit-details';

import { VaultMetrics } from '../metrics';
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTrigger,
} from '../vault-accordion';
import { VaultHeaderBadge } from '../vault-header-badge';

import { type TokensByName } from '@/actions/get-all-tokens';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { TooltipItem } from '@/components/tooltip-item';
import { Button } from '@/components/ui/button';
import { getTokenAssetUrl } from '@/constants/assets';
import { getVaultFeesKey } from '@/hooks/useVaultFees';
import { apiChainToWagmi } from '@/lib/api-chain-to-wagmi';
import { apyFormatter } from '@/lib/apy-formatter';
import { editVault } from '@/lib/editVaultRequest';

export type EditVaultFormValues = {
  tokens: string[];
  depositFee: string | undefined;
  withdrawFee: string | undefined;
};

type Props = {
  vault: VaultWithApyAndTvl;
  tokens: TokensByName;
  multicallManagerAddress: Address;
};

export const EditVaultForm = ({
  vault,
  tokens,
  multicallManagerAddress,
}: Props) => {
  const router = useRouter();
  const methods = useForm<EditVaultFormValues>({
    defaultValues: {
      depositFee: '',
      withdrawFee: '',
    },
  });
  const queryClient = useQueryClient();

  const { data: walletClient } = useWalletClient();
  const chainId = apiChainToWagmi(vault.network || '').id;
  const publicClient = usePublicClient({ chainId });
  const vaultAddress = vault.earnContractAddress as `0x${string}`;

  const onSubmit = useCallback(
    async (data: EditVaultFormValues) => {
      if (!walletClient) return;

      const { depositFee, withdrawFee } = data;

      await editVault({
        vaultAddress,
        multicallManagerAddress,
        publicClient,
        walletClient,
        depositFee: depositFee
          ? parseUnits(String(parseFloat(depositFee)), 2)
          : null,
        withdrawFee: withdrawFee
          ? parseUnits(String(parseFloat(withdrawFee)), 2)
          : null,
      });

      queryClient.invalidateQueries({ queryKey: [getVaultFeesKey(vault.id)] });
    },
    [
      multicallManagerAddress,
      publicClient,
      queryClient,
      vault.id,
      vaultAddress,
      walletClient,
    ],
  );

  const handleCancel = () => {
    router.push('/');
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="mx-auto flex min-w-[455px] max-w-[45%] flex-col gap-[24px]"
      >
        <Interaction vault={vault} tokens={tokens} />
        <VaultMetrics vault={vault} />
        <AccordionRoot
          collapsible
          className="rounded-[12px] bg-white bg-opacity-[0.11] p-[16px] backdrop-blur-[20px]"
          type="single"
        >
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
                tooltipText="Daily"
              >
                {apyFormatter(
                  vault.apy.totalApy ? vault.apy.totalApy / 365 : 0,
                )}
              </VaultHeaderBadge>
              <VaultHeaderBadge
                className="w-full flex-1"
                label="Native APY"
                tooltipText="Native APY"
              >
                {apyFormatter(vault.apy.totalApy)}
              </VaultHeaderBadge>
              <VaultHeaderBadge
                className="w-full flex-1"
                label="Native Daily"
                tooltipText="Native Daily"
              >
                {apyFormatter(
                  vault.apy.totalApy ? vault.apy.totalApy / 365 : 0,
                )}
              </VaultHeaderBadge>
            </AccordionContent>
          </AccordionItem>
        </AccordionRoot>
        <AccordionRoot collapsible type="single">
          <AccordionItem value="0">
            <AccordionTrigger className="rounded-[12px] bg-white bg-opacity-[0.11] p-[16px] backdrop-blur-[20px]">
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
              <VaultEditDetails vault={vault} />
            </AccordionContent>
          </AccordionItem>
        </AccordionRoot>
        <div className="flex justify-center gap-2">
          <Button type="button" className="" variant="transparent">
            Retire This Cube
          </Button>
          <Button
            type="button"
            className="border-[#F35A53] text-[#F35A53]"
            variant="transparent"
          >
            Pause This Cube
          </Button>
        </div>
        <div className="flex gap-6">
          <Button
            onClick={handleCancel}
            type="button"
            className="flex-1"
            variant="transparent"
          >
            Cancel
          </Button>
          <Button type="submit" className="flex-1" variant="contained">
            Save
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
