import { AssetDetailsItem } from './asset-details-item';

import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { getAssetDetails } from '@/constants/assetsMap';

export type AssetDetailsProps = {
  vault: VaultWithApyAndTvl;
};

export const AssetDetails = ({ vault }: AssetDetailsProps) => (
  <div className="flex flex-col divide-y divide-dashed divide-white rounded-[12px] p-4 last:pb-0">
    <div />
    {vault.assets.map((asset) => {
      const assetDetails = getAssetDetails(asset);
      return (
        <AssetDetailsItem
          icons={[asset]}
          key={asset}
          title={asset}
          chain={vault.chain}
          description={
            assetDetails?.description || 'Description is not provided'
          }
          websiteUrl={assetDetails?.website}
          contractUrl={assetDetails?.chains[vault.chain]}
          docsUrl={assetDetails?.docs}
        />
      );
    })}
  </div>
);
