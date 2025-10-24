import { type WalletClient } from 'wagmi';
import Web3Token from 'web3-token';

import { ADMIN_MESSAGE } from '@/constants/admin_message';

export const signAuthMessage = async (walletClient: WalletClient) => {
  const token = await Web3Token.sign(
    async (msg: string) => await walletClient.signMessage({ message: msg }),
    {
      domain: ADMIN_MESSAGE.toString(),
    },
  );

  return token;
};
