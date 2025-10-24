import { type WalletClient } from 'wagmi';

import { ARCHIVED_VAULT_URL } from '@/actions/get-archived-vaults';
import { signAuthMessage } from '@/lib/sign-auth-message';

export const archiveVault = async ({
  id,
  walletClient,
}: {
  id: string;
  walletClient: WalletClient;
}) => {
  const token = await signAuthMessage(walletClient);

  try {
    return await fetch(ARCHIVED_VAULT_URL + '/archive', {
      method: 'Post',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
  } catch (e) {
    console.error(e);
    return null;
  }
};
