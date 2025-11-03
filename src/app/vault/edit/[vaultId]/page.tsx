import Image from 'next/image';
import { type Address } from 'viem';

import { getAllTokens } from '@/actions/get-all-tokens';
import { getChainConfig } from '@/actions/get-chain-config';
import { getVaultById } from '@/actions/get-vault-by-id';
import { BackButton } from '@/components/back-button';
import { EditVaultForm } from '@/components/vault/edit';
import { getTokenAssetUrl } from '@/constants/assets';
import { appDescription, appName } from '@/constants/metadata';

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

const EditVaultPage = async ({ params: { vaultId } }: VaultPageProps) => {
  const vault = await getVaultById(vaultId);

  const configs = await getChainConfig();

  if (!vault) {
    return <div>Not found</div>;
  }

  const multicallAddress = configs[vault.chain || 'ethereum']
    .multicallManager as Address;

  const tokens = (await getAllTokens())[vault.chain];

  return (
    <div className="container flex flex-col gap-6 py-[40px]">
      <div className="grid grid-cols-3 items-center">
        <BackButton className="col-span-1 w-20" />
        <div className="col-span-1 text-[32px] font-semibold lg:text-center">
          {vault.name}
        </div>
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
      <EditVaultForm
        multicallManagerAddress={multicallAddress}
        vault={vault}
        tokens={tokens}
      />
    </div>
  );
};

export default EditVaultPage;
