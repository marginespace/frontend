import { type WalletClient } from 'wagmi';

import { BACKEND_API_URL } from '@/constants/backend_api';
import { signAuthMessage } from '@/lib/sign-auth-message';

const HIDDEN_VAULTS_URL = BACKEND_API_URL + '/api/hide-vaults';

export const deleteHiddenVault = async (
  id: string,
  walletClient: WalletClient,
): Promise<Response | null> => {
  const token = await signAuthMessage(walletClient);

  try {
    const response = await fetch(HIDDEN_VAULTS_URL, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        cache: 'no-cache',
      },
      body: JSON.stringify({ id }),
    });

    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};
