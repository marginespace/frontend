'use client';

import { CoinbaseWalletConnector } from '@wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from '@wagmi/connectors/injected';
import { SafeConnector } from '@wagmi/connectors/safe';
import { WalletConnectConnector } from '@wagmi/connectors/walletConnect';
import { walletConnectProvider, EIP6963Connector } from '@web3modal/wagmi';
import {
  createWeb3Modal,
  type defaultWagmiConfig,
} from '@web3modal/wagmi/react';
import { type PropsWithChildren } from 'react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

import { appDescription, appName, getAppUrl } from '@/constants/metadata';
import { SUPPORTED_CHAINS } from '@/constants/supported-chains';

// Fallback значение для билда, если переменная окружения не установлена
const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'fallback_project_id_for_build';

const { chains, publicClient } = configureChains(SUPPORTED_CHAINS, [
  walletConnectProvider({ projectId }),
  publicProvider(),
]);

const metadata = {
  name: appName,
  description: appDescription,
  url: getAppUrl(),
  // используем хостed-иконку проекта, чтобы избежать 403 на api.web3modal
  icons: ['https://earn.marginspace.pw/icons/logo.svg'],
} satisfies Parameters<typeof defaultWagmiConfig>[0]['metadata'];

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new WalletConnectConnector({
      chains,
      options: { projectId, showQrModal: false, metadata },
    }),
    new EIP6963Connector({ chains }),
    new InjectedConnector({ chains, options: { shimDisconnect: true } }),
    new CoinbaseWalletConnector({
      chains,
      options: { appName: metadata.name },
    }),
    new SafeConnector({ chains, options: { shimDisconnect: true } }),
  ],
  publicClient,
});
createWeb3Modal({
  chains,
  projectId,
  wagmiConfig,
  defaultChain: SUPPORTED_CHAINS[0],
});

export const WagmiProvider = ({ children }: PropsWithChildren) => {
  return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
};
