import { useIsMounted } from '@redduck/helpers-react';
import { formatBigIntComa } from '@redduck/helpers-viem';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useAccount, useContractRead, usePublicClient } from 'wagmi';

import { InteractionEdit } from './interaction-tabs';

import { vaultV7Abi } from '@/abi/VaultV7';
import { type TokensByName } from '@/actions/get-all-tokens';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { TooltipItem } from '@/components/tooltip-item';
import { Switch, SwitchThumb } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getNetworkTokenAddresses } from '@/constants/networkTokenAddresses';
import { apiChainToWagmi } from '@/lib/api-chain-to-wagmi';
import { getExpectedVaultSwap } from '@/lib/getExpectedVaultSwap';

type Props = {
  vault: VaultWithApyAndTvl;
  tokens: TokensByName;
};

enum EditTabs {
  EDIT = 'Edit',
}

export const Interaction = ({ vault, tokens }: Props) => {
  const [expectedSwap, setExpectedSwap] = useState<string>('0.00');
  const isMounted = useIsMounted();
  const router = useRouter();
  const { address } = useAccount();
  const chainId = apiChainToWagmi(vault.network || '').id;
  const publicClient = usePublicClient({ chainId });
  const vaultAddress = vault.earnContractAddress as `0x${string}`;
  const tokenAddresses = getNetworkTokenAddresses(vault.network);

  const { data: deposited } = useContractRead({
    abi: vaultV7Abi,
    address: vaultAddress,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: apiChainToWagmi(vault.chain).id,
    watch: true,
  });
  if (deposited !== undefined && deposited === BigInt(0) && vault.isArchived) {
    router.push('/');
  }

  const price = vault.lps?.price ?? 0;
  const showDeposited = price
    ? `$${(
        price *
        +formatUnits(
          isMounted && deposited ? deposited : BigInt(0),
          vault.tokenDecimals,
        )
      ).toFixed(2)}`
    : `${formatBigIntComa(
        isMounted && deposited ? deposited : BigInt(0),
        18,
        2,
      )} LP`;

  useEffect(() => {
    (async () => {
      try {
        const formatedDeposited =
          price *
          +formatUnits(
            isMounted && deposited ? deposited : BigInt(0),
            vault.tokenDecimals,
          );

        const nativeTokenAmount = await getExpectedVaultSwap({
          chain: vault.network,
          provider: publicClient,
          amountIn: parseUnits(
            String(formatedDeposited),
            tokenAddresses.stable.decimals,
          ),
          tokenIn: tokenAddresses.stable.address,
          tokenOut: tokenAddresses.wrappedNativeToken.address,
          nativeDecimals: tokenAddresses.wrappedNativeToken.decimals,
        });

        setExpectedSwap(nativeTokenAmount || '');
      } catch (e) {
        console.error(e);
      }
    })();
  }, [
    vault,
    deposited,
    publicClient,
    tokenAddresses.stable,
    tokenAddresses.wrappedNativeToken,
    price,
    isMounted,
  ]);

  return (
    <div className="col-span-6  rounded-[18px] p-0.5 lg:col-span-2">
      <div className="border-primary flex h-full flex-col gap-2 rounded-[16px] border-2   bg-gradient-to-b from-[rgba(255,255,255,0.28)] via-[rgba(255,255,255,0.17)] p-[16px] sm:gap-4">
        <div className="flex flex-row items-center justify-center">
          <div className="flex-[1] text-2xl font-medium">Interaction</div>
        </div>
        <div className=" flex flex-wrap gap-4 lg:gap-10">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium">Retire This Vault</p>
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
            </div>
            <Switch>
              <SwitchThumb />
            </Switch>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <p className="text-sm font-medium">Pause this Vault</p>
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
            </div>
            <Switch>
              <SwitchThumb />
            </Switch>
          </div>
        </div>
        <Tabs defaultValue={EditTabs.EDIT}>
          <div className="flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
            <TabsList className="h-auto gap-[8px] rounded-b-none rounded-t-[12px] bg-white bg-opacity-11 pb-0">
              <TabsTrigger
                className="w-[90px] rounded-b-[2px] rounded-t-[8px] py-2 text-sm text-white data-[state=active]:bg-indigo-350"
                value={EditTabs.EDIT}
              >
                Edit
              </TabsTrigger>
            </TabsList>
            <p className="flex flex-col px-2 text-sm font-medium text-white sm:text-[#F1F3F8]">
              Your Deposit: {showDeposited} (
              {`${expectedSwap} ${tokenAddresses.wrappedNativeToken.symbol}`})
            </p>
          </div>

          <TabsContent value={EditTabs.EDIT} className="mt-0">
            <InteractionEdit vault={vault} tokens={tokens} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
