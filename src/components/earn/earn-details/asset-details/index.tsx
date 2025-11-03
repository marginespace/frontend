import Image from 'next/image';
import { Fragment, useState } from 'react';
import * as chains from 'viem/chains';

import { type CubeWithApyAndTvl } from '@/actions/get-all-cubes';
import { AssetDetailsItem } from '@/components/asset-details/asset-details-item';
import {
  AccordionButton,
  Divider,
} from '@/components/earn/earn-details/common/Divider';
import { getTokenAssetUrl } from '@/constants/assets';
import { getAssetDetails } from '@/constants/assetsMap';
import { chainImages } from '@/constants/vaults';
import { capitalize } from '@/helpers/capitalize';
import { getRowsFromLps } from '@/lib/get-rows-from-lps';

export type AssetDetailsProps = {
  cube: CubeWithApyAndTvl;
};

const chainsTyped = chains as Record<string, chains.Chain>;

export const AssetDetails = ({ cube }: AssetDetailsProps) => {
  const [opened, setOpened] = useState(false);
  const tokens = cube.vaults
    .flatMap((vault) => getRowsFromLps(vault).map((row) => row.name))
    .filter((value, index, self) => self.indexOf(value) === index);

  return (
    <div className="flex flex-col gap-[8px] rounded-[12px] p-4 pt-8">
      <div className="flex flex-col gap-[12px]">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <div className="flex items-center gap-[4px]">
              {tokens.map((token) => (
                <Image
                  key={token}
                  width={24}
                  height={24}
                  src={getTokenAssetUrl(token)}
                  alt={token}
                />
              ))}
            </div>
            <div className="text-[16px] font-semibold text-white">
              {cube.stable}
            </div>
          </div>
          <div className="flex w-fit items-center gap-[6px] rounded-[4px] bg-white px-[3px] py-[2px] font-medium">
            <div className="scale-[0.67] [&>div]:h-[24px] [&>div]:w-[24px] [&>div]:bg-transparent">
              {chainImages[cube.network] ?? null}
            </div>
            <div className="text-[12px] font-[500] text-text">
              {capitalize(cube.network)}
            </div>
          </div>
        </div>
        <div className="text-[14px] font-[500] leading-[20px] text-text-grey">
          {cube.description || 'No cube description provided.'}
        </div>
        <AccordionButton
          opened={opened}
          onClick={() => setOpened((prev) => !prev)}
        />
      </div>
      {opened && (
        <div className="flex flex-col gap-[12px] pt-[12px]">
          {cube.vaults.map((vault) => {
            const chainName =
              vault.chain === 'ethereum' ? 'mainnet' : vault.chain;

            return (
              <AssetDetailsItem
                key={vault.id}
                icons={vault.assets.slice(0, 2) as [string, string]}
                title={vault.name}
                platform={vault.platformId}
                description={`The vault puts the user's ${
                  vault.name
                } into a ${vault.platformId.toUpperCase()} farm to earn the platform's governance token. The earned token is then exchanged for more of the original assets to get more of the same liquidity token. To keep the cycle going, the new ${
                  vault.name
                } is added to the farm for the next earning event. The transaction cost for all this is shared among the vault's users.`}
                strategyUrl={`${chainsTyped[chainName]?.blockExplorers?.default.url}/address/${vault.strategy}`}
                vaultUrl={`${chainsTyped[chainName]?.blockExplorers?.default.url}/address/${vault.earnContractAddress}`}
              />
            );
          })}
        </div>
      )}
      <div className="pt-[12px]">
        <Divider />
      </div>
      <div className="flex flex-col gap-[24px] pt-[12px]">
        {tokens.map((asset, index) => {
          const assetDetails = getAssetDetails(asset);
          return (
            <Fragment key={asset}>
              <AssetDetailsItem
                withoutBG
                icons={[asset]}
                key={asset}
                title={asset}
                chain={cube.vaults[0].chain}
                description={
                  assetDetails?.description || 'Description is not provided'
                }
                websiteUrl={assetDetails?.website}
                contractUrl={assetDetails?.chains[cube.vaults[0].chain]}
                docsUrl={assetDetails?.docs}
              />
              {index !== tokens.length - 1 && <Divider />}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
