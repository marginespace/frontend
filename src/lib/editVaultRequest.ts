import { encodeFunctionData, type Address } from 'viem';
import { type PublicClient, type WalletClient } from 'wagmi';

import { multicallManagerAbi } from '@/abi/MulticallManager';
import { vaultV7Abi } from '@/abi/VaultV7';

type EditVault = {
  publicClient: PublicClient;
  depositFee: bigint | null;
  withdrawFee: bigint | null;
  walletClient: WalletClient;
  vaultAddress: Address;
  multicallManagerAddress: Address;
};

export const editVault = async ({
  publicClient,
  depositFee,
  withdrawFee,
  walletClient,
  vaultAddress,
  multicallManagerAddress,
}: EditVault) => {
  const multicallArgs = [];

  if (depositFee) {
    const depositData = encodeFunctionData({
      abi: vaultV7Abi,
      functionName: 'setDepositFee',
      args: [depositFee],
    });

    multicallArgs.push({ target: vaultAddress, callData: depositData });
  }

  if (withdrawFee) {
    const withdrawData = encodeFunctionData({
      abi: vaultV7Abi,
      functionName: 'setWithdrawalFee',
      args: [withdrawFee],
    });

    multicallArgs.push({ target: vaultAddress, callData: withdrawData });
  }

  const { request } = await publicClient.simulateContract({
    account: walletClient.account,
    address: multicallManagerAddress,
    abi: multicallManagerAbi,
    functionName: 'aggregate',
    args: [multicallArgs],
  });

  const tx = await walletClient.writeContract(request);
  await publicClient.waitForTransactionReceipt({ hash: tx });
};
