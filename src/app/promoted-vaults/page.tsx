import { type Metadata } from 'next';

import { getAllPromotedVaultsIds } from '@/actions/get-all-promouted-vaults-ids';
import { getAllVaultsWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { BackButton } from '@/components/back-button';
import PromotedVaultsGrid from '@/components/promoted-vaults';
import { appDescription, appName } from '@/constants/metadata';

// Отключаем статическую генерацию для этой страницы
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: `${appName}: Promoted vaults}`,
  description: appDescription,
};

const PromotedVaultsPage = async () => {
  const vaults = await getAllVaultsWithApyAndTvl();
  const promotedIds = await getAllPromotedVaultsIds();

  if (!vaults) {
    return <div>Not found</div>;
  }

  return (
    <div className="mx-auto flex flex-col gap-4 px-10 py-[40px] md:px-16 lg:px-24 xl:px-40">
      <div className="flex items-center justify-start">
        <BackButton />
        <h2 className="mx-auto text-[32px] font-semibold lg:text-center">
          Promoted
        </h2>
      </div>
      <PromotedVaultsGrid
        allVaults={vaults}
        vaults={vaults
          .filter((vault) => promotedIds.includes(vault.id))
          .sort((a, b) =>
            promotedIds.indexOf(b.id) < promotedIds.indexOf(a.id) ? 1 : -1,
          )}
      />
    </div>
  );
};

export default PromotedVaultsPage;
