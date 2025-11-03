import { type WalletClient } from 'wagmi';
import Web3Token from 'web3-token';

import { ADMIN_MESSAGE } from '@/constants/admin_message';

// Extract domain from URL (remove https:// or http:// if present)
// Web3Token expects domain format like "example.com", not "https://example.com"
const extractDomain = (urlOrDomain: string): string => {
  try {
    // If it's already a domain without protocol, return as is
    if (!urlOrDomain.includes('://')) {
      return urlOrDomain;
    }
    // Extract domain from URL
    const url = new URL(urlOrDomain);
    return url.hostname;
  } catch {
    // If URL parsing fails, assume it's already a domain and remove protocol if present
    return urlOrDomain.replace(/^https?:\/\//, '');
  }
};

export const signAuthMessage = async (walletClient: WalletClient) => {
  // Web3Token expects domain format like "example.com" (not "https://example.com")
  const domain = extractDomain(ADMIN_MESSAGE.toString());
  
  const token = await Web3Token.sign(
    async (msg: string) => await walletClient.signMessage({ message: msg }),
    {
      domain,
    },
  );

  return token;
};