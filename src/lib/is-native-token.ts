import { zeroAddress } from 'viem';

import { type Token } from '@/actions/get-all-tokens';

export const isNativeToken = (token: Token | undefined | null) => {
  return (
    token?.isNative ||
    token?.address === zeroAddress ||
    token?.address === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' ||
    token?.address === '0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000' ||
    token?.address === 'native'
  );
};
