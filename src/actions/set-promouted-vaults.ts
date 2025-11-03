import { type WalletClient } from 'wagmi';

import { BACKEND_API_URL } from '@/constants/backend_api';
import { signAuthMessage } from '@/lib/sign-auth-message';

const PROMOTIONAL_URL = BACKEND_API_URL + '/api/promotional-pool';

export const setPromotedVaults = async (
  ids: string[],
  walletClient: WalletClient,
): Promise<Response | null> => {
  const token = await signAuthMessage(walletClient);

  try {
    const response = await fetch(PROMOTIONAL_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-cache',
      body: JSON.stringify({ ids }),
    });

    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};
