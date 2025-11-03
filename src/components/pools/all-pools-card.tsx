'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  type MouseEvent,
  memo,
  useCallback,
  useMemo,
  type CSSProperties,
  type PointerEvent,
} from 'react';
import { getAddress, zeroAddress } from 'viem';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWalletClient,
} from 'wagmi';

import { VaultInfoBlock } from './vault-info-block';

import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { DocumentCloudSvg } from '../ui/icons/document-cloud';
import { MoreSquareSvg } from '../ui/icons/more-square';
import { PauseCircleSvg } from '../ui/icons/pause-circle';
import { useToast } from '../ui/use-toast';
import { type selectedRowValue } from '../vault/pool';

import { strategyAuraMainnetAbi } from '@/abi/StrategyAuraMainnet';
import { addHiddenVault } from '@/actions/add-hidden-vault';
import { archiveVault } from '@/actions/archive-vault';
import { deleteHiddenVault } from '@/actions/delete-hidden-vault';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { getTokenAssetUrl } from '@/constants/assets';
import { chainImages } from '@/constants/vaults';
import { apiChainToWagmi } from '@/lib/api-chain-to-wagmi';
import { apyFormatter } from '@/lib/apy-formatter';
import { tvlFormatter } from '@/lib/tvl-formatter';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/ui/accordion';
import { InfoCircle, VaultArrow } from '@/ui/icons';

type PoolProps = {
  vault: VaultWithApyAndTvl;
  style?: CSSProperties;
  rowIndex: number;
  columnIndex: number;
  open: selectedRowValue;
  onClick: (
    rowIndex: number,
    columnIndex: number,
    value?: 'open' | 'boost',
  ) => void;
  isAdmin: boolean;
};

export const AllPoolCard = memo(
  ({
    vault,
    style,
    onClick,
    rowIndex,
    columnIndex,
    open,
    isAdmin,
  }: PoolProps) => {
    const router = useRouter();

    const { toast } = useToast();

    const { data: walletClient } = useWalletClient();

    const tvlFormatted = useMemo(() => tvlFormatter(vault.tvl, 2), [vault.tvl]);

    const handleClick = useCallback(
      () => router.push(`/vault/${vault.id}`),
      [router, vault.id],
    );

    const handleEditClick = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        router.push(`/vault/edit/${vault.id}`);
      },
      [router, vault.id],
    );

    const handleOpen = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        onClick(rowIndex, columnIndex, vault.boost ? 'boost' : 'open');
      },
      [rowIndex, columnIndex, onClick, vault.boost],
    );

    const chainId = apiChainToWagmi(vault.chain).id;

    const { address } = useAccount();

    const { data: isPaused } = useContractRead({
      abi: strategyAuraMainnetAbi,
      address: getAddress(vault.strategy ?? zeroAddress),
      chainId,
      functionName: 'paused',
      watch: true,
      enabled: Boolean(vault),
    });

    const { write: pause } = useContractWrite({
      abi: strategyAuraMainnetAbi,
      address: getAddress(vault.strategy ?? zeroAddress),
      chainId: chainId,
      functionName: 'pause',
    });

    const { write: unpause } = useContractWrite({
      abi: strategyAuraMainnetAbi,
      address: getAddress(vault.strategy ?? zeroAddress),
      chainId: chainId,
      functionName: 'unpause',
    });

    const pauseVault = useCallback(
      async (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        isPaused ? unpause?.() : pause?.();
      },
      [isPaused, pause, unpause],
    );

    const onVaultHide = useCallback(
      async (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();

        if (walletClient) {
          const res = vault.isHidden
            ? await deleteHiddenVault(vault.id, walletClient)
            : await addHiddenVault(vault.id, walletClient);

          if (res && res.status === 201) {
            toast({
              variant: 'default',
              title: 'Success.',
              description: 'Vault hidden.',
            });
          } else if (res && res.status === 200) {
            toast({
              variant: 'default',
              title: 'Success.',
              description: 'Vault shown.',
            });
          } else {
            toast({
              variant: 'destructive',
              title: 'Error.',
              description: 'Try again.',
            });
          }
        }
      },
      [vault.id, vault.isHidden, walletClient, toast],
    );

    const archive = useCallback(
      async (e: MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (walletClient && address) {
          const res = await archiveVault({ id: vault.id, walletClient });
          if (res && res.status === 201) {
            toast({
              variant: 'default',
              title: 'Archived.',
              description: 'Vault is archived successfully.',
            });
          } else {
            toast({
              variant: 'default',
              title: 'Error.',
              description: 'Vault is not archived.',
            });
          }
        }
      },
      [address, toast, vault.id, walletClient],
    );

    if (!vault) return null;

    return (
      <div
        className="group/card h-fit cursor-pointer transition-all animate-stagger"
        style={{ ...style, animationDelay: `${rowIndex * 0.05}s` }}
      >
        <AccordionItem
          onClick={handleClick}
          value={`item-${vault.id}`}
          className="block rounded-[16px] border-2 border-[rgba(255,255,255,0.05)] bg-linear-black p-[16px] pb-0 backdrop-blur-[16px] transition-all duration-300 hover:border-primary hover:shadow-card-elevated hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(212,107,48,0.4)]"
        >
          <div className="mb-[12px] flex gap-[2px]">
            {vault.assets.map((asset) => (
              <Image
                key={asset}
                width={24}
                height={24}
                src={getTokenAssetUrl(asset)}
                alt={asset}
              />
            ))}
          </div>
          <div className="mb-[12px] flex items-center rounded-[8px] bg-[#0B0B0B] px-[12px] py-[10px] text-[16px] font-semibold text-[#D46B30]">
            {vault.name}
          </div>
          <div className="flex justify-between border-b-2 border-dashed border-additional-grey pb-[12px]">
            <div>
              <h3 className="text-[14px] font-semibold leading-[20px] text-light-grey">
                APY
              </h3>
              <div className="flex gap-2">
                <h4 className="text-[20px] font-semibold leading-[30px] text-primary">
                  {apyFormatter(vault.apy.totalApy)}
                </h4>
                {vault.boost && (
                  <div className="bg-primary flex items-center gap-1 rounded-lg px-2 py-[2px] text-xs text-white animate-pulse-orange">
                    Boost <InfoCircle light />
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-right text-[14px] font-semibold leading-[20px] text-light-grey">
                TVL
              </h3>
              <h4 className="text-[20px] font-semibold leading-[30px] text-primary">
                ${tvlFormatted}
              </h4>
            </div>
          </div>
          <div className="relative flex justify-between pb-[16px] pt-[8px]">
            <div>
              <h3 className="text-[14px] font-semibold leading-[20px] text-light-grey">
                Platform
              </h3>
              <h4 className="text-[14px] font-semibold leading-[20px] text-primary">
                {vault.platformId}
              </h4>
            </div>
            <div>
              <h3 className="text-right text-[14px] font-semibold leading-[20px] text-light-grey">
                Chain
              </h3>
              {chainImages[vault.chain] ?? <div>{vault.chain}</div>}
            </div>
            <span className="absolute  bottom-0 w-[40%] border-b-2 border-dashed border-additional-grey"></span>
            <span className="absolute  bottom-0 right-0 w-[40%] border-b-2 border-dashed border-additional-grey"></span>
          </div>
          <div className="relative flex -translate-y-[10px] justify-center overflow-hidden">
            <div className=" flex  w-[56px] justify-center bg-inherit">
              <AccordionTrigger
                className="p-0"
                chevronHidden
                onClick={handleOpen}
              >
                <div
                  className={`group transition-all ${open ? 'rotate-180' : ''}`}
                >
                  <VaultArrow />
                </div>
              </AccordionTrigger>
            </div>
          </div>

          <AccordionContent>
            <VaultInfoBlock vault={vault} />
            {vault.deposited ? (
              <div className="flex gap-[4px]">
                <div className="flex w-full justify-between rounded-[6px] bg-[#0B0B0B] p-[8px]">
                  <h4 className="text-[12px] font-medium leading-[18px] text-[#D46B30]">
                    Deposited
                  </h4>
                  <h5 className="text-[14px] font-semibold leading-[20px] text-white">
                    ${vault.deposited.toFixed(2)}
                  </h5>
                </div>
              </div>
            ) : null}
            {vault.boost && (
              <div>
                <h1 className="text-primary text-center text-sm font-semibold">
                  Active BOOST:
                </h1>
                <div className="mb-[4px] flex gap-[4px]">
                  <div className="w-full rounded-[6px] bg-[#0B0B0B] p-[8px]">
                    <h4 className="text-[12px] font-medium leading-[18px] text-[#D46B30]">
                      Rewards
                    </h4>
                    <h5 className="text-[14px] font-semibold leading-[20px] text-white">
                      0 WKAVA
                    </h5>
                  </div>
                  <div className="w-full rounded-[6px] bg-[#0B0B0B] p-[8px]">
                    <h4 className="text-[12px] font-medium leading-[18px] text-[#D46B30]">
                      Ends
                    </h4>
                    <h5 className="text-[14px] font-semibold leading-[20px] text-white">
                      11d 03h 58m
                    </h5>
                  </div>
                </div>
              </div>
            )}
            {isAdmin && (
              <div className="mt-4 flex items-center justify-between">
                <Button
                  variant="outlined"
                  className="hover:bg-[rgba(0,0,0,.3)]"
                  onClick={handleEditClick}
                >
                  Edit vault
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <MoreSquareSvg />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    side="bottom"
                    className="rounded-[10px] bg-primary p-[16px]"
                  >
                    <Button
                      onClick={pauseVault}
                      className=" flex w-full items-center justify-between p-0 text-sm font-medium text-text"
                    >
                      {isPaused ? 'Unpause' : 'Pause'} vault{' '}
                      <PauseCircleSvg className="ml-1" />
                    </Button>
                    <Button
                      onClick={archive}
                      className="flex w-full items-center justify-between p-0 text-sm font-medium text-text"
                    >
                      Archive vault <DocumentCloudSvg className="ml-1" />
                    </Button>
                    <Button
                      onClick={onVaultHide}
                      className="flex w-full items-center justify-between p-0 text-sm font-medium text-text"
                    >
                      {vault.isHidden ? 'Show vault' : 'Hide vault'}
                      <DocumentCloudSvg className="ml-1" />
                    </Button>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </div>
    );
  },
);

AllPoolCard.displayName = 'AllPoolCard';
