import groupBy from 'lodash.groupby';
import { type Address, parseAbiItem, parseUnits } from 'viem';

import { vaultV7Abi } from '@/abi/VaultV7';
import { type Vault } from '@/actions/get-all-vaults';
import { earliestBlocks } from '@/constants/supported-chains';
import { apiChainToPublicClient } from '@/lib/api-chain-to-wagmi';

type VaultBalanceWithAddressTuple = [
  Address,
  {
    balance: string;
    decimals: number;
    shares: string;
    actions: {
      action: string;
      transactionHash: string;
      amount: string;
      balance: string;
      timestamp: string;
    }[];
  },
];
type VaultsBalancesByAddress = Record<string, VaultBalanceWithAddressTuple[1]>;
export type GetVaultsBalancesByAddressReturn = Record<
  string,
  VaultsBalancesByAddress
>;

export const getVaultsBalancesByAddress = async (
  vaults: Vault[],
  address?: string,
): Promise<GetVaultsBalancesByAddressReturn> => {
  if (!address) {
    return {};
  }

  const vaultsByChain = groupBy(vaults, (vault) => vault.chain);
  return Object.fromEntries(
    (
      await Promise.allSettled(
        Object.entries(vaultsByChain).map(async ([chain, vaults]) => {
          const publicClient = apiChainToPublicClient(chain);
          const earnContractAddresses = vaults.map(
            (vault) => vault.earnContractAddress as Address,
          );

          const contractsBalances = earnContractAddresses.map(
            (contract) =>
              ({
                abi: vaultV7Abi,
                address: contract,
                functionName: 'balanceOf',
                args: [address as Address],
              }) as const,
          );

          const vaultBalances = await publicClient.multicall({
            contracts: contractsBalances,
          });

          const contractsShares = earnContractAddresses.map(
            (contract) =>
              ({
                abi: vaultV7Abi,
                address: contract,
                functionName: 'getPricePerFullShare',
              }) as const,
          );

          const vaultShares = await publicClient.multicall({
            contracts: contractsShares,
          });

          // For dashboard, use recent blocks instead of earliestBlocks to avoid RPC range errors
          // Start with 50000 blocks (approximately 1-2 weeks) instead of very old blocks
          const currentBlock = await publicClient.getBlockNumber();
          const dashboardStartBlock = currentBlock - BigInt(50000);
          const fromBlock = dashboardStartBlock > BigInt(0) ? dashboardStartBlock : BigInt(0);

          const record = Object.fromEntries(
            (
              await Promise.all(
                earnContractAddresses.map(async (contractAddress, index) => {
                  const vaultBalance = vaultBalances[index];
                  let depositLogs: any[] = [];
                  let withdrawLogs: any[] = [];
                  
                  // Try to fetch logs with error handling
                  try {
                    [depositLogs, withdrawLogs] = await Promise.all([
                      publicClient.getLogs({
                        address: contractAddress,
                        event: parseAbiItem(
                          'event Deposit(address indexed caller, address indexed user, uint256 wantDeposited, uint256 totalVaultDeposited, uint256 rate, uint256 timestamp)',
                        ),
                        args: { user: address as Address },
                        fromBlock: fromBlock,
                        toBlock: 'latest',
                        strict: true,
                      }),
                      publicClient.getLogs({
                        address: contractAddress,
                        event: parseAbiItem(
                          'event Withdraw(address indexed caller, address indexed user, uint256 wantWithdrawn, uint256 totalVaultDeposited, uint256 rate, uint256 timestamp)',
                        ),
                        args: { user: address as Address },
                        fromBlock: fromBlock,
                        toBlock: 'latest',
                        strict: true,
                      }),
                    ]);
                  } catch (logsError: any) {
                    // If error is "exceed maximum block range", try with smaller ranges
                    if (logsError?.message?.includes('exceed maximum block range') || logsError?.message?.includes('50000')) {
                      console.warn(`[FRONTEND] getVaultsBalancesByAddress: ${chain} - vault ${contractAddress} - block range too large, trying with smaller ranges`);
                      
                      // Try progressively smaller ranges
                      for (const range of [50000, 20000, 10000, 5000]) {
                        try {
                          const currentBlockRetry = await publicClient.getBlockNumber();
                          const fromBlockRetry = currentBlockRetry - BigInt(range);
                          const retryFromBlock = fromBlockRetry > BigInt(0) ? fromBlockRetry : BigInt(0);
                          [depositLogs, withdrawLogs] = await Promise.all([
                            publicClient.getLogs({
                              address: contractAddress,
                              event: parseAbiItem(
                                'event Deposit(address indexed caller, address indexed user, uint256 wantDeposited, uint256 totalVaultDeposited, uint256 rate, uint256 timestamp)',
                              ),
                              args: { user: address as Address },
                              fromBlock: retryFromBlock,
                              toBlock: 'latest',
                              strict: true,
                            }),
                            publicClient.getLogs({
                              address: contractAddress,
                              event: parseAbiItem(
                                'event Withdraw(address indexed caller, address indexed user, uint256 wantWithdrawn, uint256 totalVaultDeposited, uint256 rate, uint256 timestamp)',
                              ),
                              args: { user: address as Address },
                              fromBlock: retryFromBlock,
                              toBlock: 'latest',
                              strict: true,
                            }),
                          ]);
                          console.log(`[FRONTEND] getVaultsBalancesByAddress: ${chain} - vault ${contractAddress} - successfully fetched logs with ${range} blocks range, found ${depositLogs.length} deposits, ${withdrawLogs.length} withdrawals`);
                          break;
                        } catch (retryError: any) {
                          if (retryError?.message?.includes('exceed maximum block range')) {
                            continue; // Try smaller range
                          } else {
                            console.error(`[FRONTEND] getVaultsBalancesByAddress: ${chain} - vault ${contractAddress} - retry failed:`, retryError);
                            break;
                          }
                        }
                      }
                    } else {
                      console.error(`[FRONTEND] getVaultsBalancesByAddress: ${chain} - vault ${contractAddress} - getLogs error:`, logsError);
                    }
                  }
                  return vaultBalance.status === 'success' &&
                    vaultBalance.result > BigInt(0)
                    ? ([
                        contractAddress,
                        {
                          balance: vaultBalance.result.toString(),
                          decimals: vaults[index]?.tokenDecimals ?? 18,
                          shares: (
                            vaultShares[index]?.result ?? BigInt(0)
                          ).toString(),
                          actions: depositLogs
                            .map(({ args, transactionHash }) => ({
                              //hash
                              action: 'Deposit',
                              transactionHash,
                              amount: args.wantDeposited.toString(),
                              balance: (
                                (args.totalVaultDeposited * args.rate) /
                                parseUnits('1', 18)
                              ).toString(),
                              timestamp: args.timestamp.toString(),
                            }))
                            .concat(
                              withdrawLogs.map(({ args, transactionHash }) => ({
                                action: 'Withdraw',
                                transactionHash,
                                amount: args.wantWithdrawn.toString(),
                                balance: (
                                  (args.totalVaultDeposited * args.rate) /
                                  parseUnits('1', 18)
                                ).toString(),
                                timestamp: args.timestamp.toString(),
                              })),
                            )
                            .sort(
                              (a, b) =>
                                +a.timestamp.toString() -
                                +b.timestamp.toString(),
                            ),
                        },
                      ] as VaultBalanceWithAddressTuple)
                    : undefined;
                }),
              )
            ).filter((result) => !!result) as VaultBalanceWithAddressTuple[],
          );

          return [chain, record] as const;
        }),
      )
    )
      .filter((result) => result.status === 'fulfilled')
      .map(
        // @ts-expect-error TS2345
        (result: PromiseFulfilledResult<[string, VaultsBalancesByAddress]>) =>
          result.value,
      ),
  );
};
