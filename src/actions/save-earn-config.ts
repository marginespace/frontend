import { type WalletClient } from 'wagmi';

import { BACKEND_API_URL } from '@/constants/backend_api';
import { signAuthMessage } from '@/lib/sign-auth-message';

const BLOB_URL = BACKEND_API_URL + '/api/blob-config';

type Vault = {
  vaultId: string;
  part: number;
};

export interface EarnConfig {
  id: string;
  name: string;
  description?: string;
  earn: string;
  vaults: Vault[];
  network: string;
  configuration: string;
  stableAddress: string;
  stableDecimals: number;
  stable: string;
  priceAggregator: string;
  gelatoChecker: string;
  reservedForAutomation: number;
  earnConfiguration: string;
  earnHelper: string;
  risks: string[];
  stopLosses: number[];
  createdAt: number;
  autoswapFee: number;
}

export const saveEarnConfig = async (
  config: EarnConfig,
  walletClient: WalletClient,
): Promise<Response | null> => {
  const token = await signAuthMessage(walletClient);

  try {
    const response = await fetch(BLOB_URL, {
      method: 'Post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(config),
    });

    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};
