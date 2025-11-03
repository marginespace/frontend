import { useQuery } from '@tanstack/react-query';
import { getContract } from 'viem';
import { type PublicClient } from 'wagmi';

import { vaultV7Abi } from '@/abi/VaultV7';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';

export const getVaultFeesKey = (vaultId: string) => `vault-fees-${vaultId}`;

export const useVaultFees = (
  vault: VaultWithApyAndTvl,
  publicClient: PublicClient,
) => {
  const vaultAddress = vault.earnContractAddress as `0x${string}`;

  const vaultContract = getContract({
    abi: vaultV7Abi,
    address: vaultAddress,
    publicClient,
  });

  return useQuery({
    queryKey: [getVaultFeesKey(vault.id)],
    queryFn: async () => {
      //TODO: remove hardcoded catch after contracts redeployment
      const [depositFee, withdrawFee] = await Promise.all([
        vaultContract.read.depositFee().catch(() => BigInt(0)),
        vaultContract.read.withdrawFee().catch(() => BigInt(0)),
      ]);
      return {
        depositFee: Number(depositFee) / 100,
        withdrawFee: Number(withdrawFee) / 100,
      };
    },
  });
};
