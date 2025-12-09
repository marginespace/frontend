import { gql } from '@apollo/client';
import groupBy from 'lodash.groupby';
import { type Address, formatUnits, parseAbiItem } from 'viem';

import { earnAbi } from '@/abi/earn/EarnAbi';
import { earnPoolCheckerAbi } from '@/abi/earn/EarnPoolChecker';
import { priceAggregatorAbi } from '@/abi/earn/PriceAggregatorAbi';
import { type Cube } from '@/actions/get-all-cubes';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { createApolloClient } from '@/apollo/client';
import { getTransactionUrl } from '@/helpers/getTransactionUrl';
import { apiChainToPublicClient } from '@/lib/api-chain-to-wagmi';

type CubeDepositLog = {
  amountStable: string;
  blockNumber: string;
  blockTimestamp: string;
  earn: string;
  id: string;
  stopLossUsd: string;
  timestamp: string;
  totalSize: string;
  transactionHash: string;
  user: string;
};

type CubeWithdrawLog = {
  amountStable: string;
  blockNumber: string;
  blockTimestamp: string;
  earn: string;
  id: string;
  stopLossUsd: string;
  timestamp: string;
  totalSize: string;
  transactionHash: string;
  user: string;
};

export type CubeVaultActionInfo = {
  type: 'Deposit' | 'Withdraw';
  amount: number;
  balance: number;
  timestamp: number;
  etherscanLink: string;
};
export type CubeVaultDashboardInfo = {
  atDeposit: number;
  now: number;
  pnl: number;
  actions: CubeVaultActionInfo[];
};
export type CubeDashboardInfoTuple = [
  Address,
  {
    atDeposit: number;
    now: number;
    pnl: number;
    stopLoss: number;
    stopLossPercent: number;
    balance?: string;
    vaultsMap: Record<string, CubeVaultDashboardInfo>;
  },
];
export type CubesDashboardInfo = Record<
  CubeDashboardInfoTuple[0],
  CubeDashboardInfoTuple[1]
>;
export type CubesDashboardInfoByNetwork = Record<string, CubesDashboardInfo>;

export const getCubesDashboardInfo = async (
  cubes: Cube[],
  vaults: Record<string, VaultWithApyAndTvl>,
  address?: Address,
): Promise<CubesDashboardInfoByNetwork> => {
  if (!address) {
    return {};
  }

  const cubesByChain = groupBy(cubes, (cube) => cube.network);

  const settled = await Promise.allSettled(
    Object.entries(cubesByChain).map(async ([chain, cubes]) => {
      const publicClient = apiChainToPublicClient(chain);
      
      let nows: any[] = [];
      let positions: any[] = [];
      
      try {
        nows = await publicClient.multicall({
          contracts: cubes.map((cube) => ({
            abi: earnPoolCheckerAbi,
            address: cube.gelatoChecker as Address,
            functionName: 'stableReceivedStopLoss',
            args: [cube.earn as Address, address],
          })),
        });
        positions = await publicClient.multicall({
          contracts: cubes.map((cube) => ({
            abi: earnAbi,
            address: cube.earn as Address,
            functionName: 'positions',
            args: [address],
          })),
        });
      } catch (error) {
        console.error(`[getCubesDashboardInfo] Multicall error for ${chain}:`, error);
        // Return empty arrays - will result in balance = undefined
        nows = cubes.map(() => ({ result: [BigInt(0)] }));
        positions = cubes.map(() => ({ result: [BigInt(0), BigInt(0), BigInt(0), BigInt(0), BigInt(0)] }));
      }

      // For dashboard, use recent blocks instead of earliestBlocks to avoid RPC range errors
      // Start with 50000 blocks (approximately 1-2 weeks) instead of very old blocks
      const currentBlock = await publicClient.getBlockNumber();
      const dashboardStartBlock = currentBlock - BigInt(50000);
      const fromBlock = dashboardStartBlock > BigInt(0) ? dashboardStartBlock : BigInt(0);

      const client = createApolloClient(chain);

      let earnpoolDeposits: any[] = [];
      let earnpoolWithdraws: any[] = [];
      
      try {
        const logs = await client.query({
          query: gql`
            query MyQuery {
              earnpoolDeposits(where: {user: "${address}"})  {
                amountStable
                blockNumber
                blockTimestamp
                earn
                id
                stopLossUsd
                timestamp
                totalSize
                transactionHash
                user
              }
              earnpoolWithdraws(where: {user: "${address}"})  {
                user
                transactionHash
                totalSize
                timestamp
                stopLossUsd
                id
                blockTimestamp
                earn
                blockNumber
                amountStable
              }
            }
          `,
        });
        const data = logs.data as any;
        earnpoolDeposits = data?.earnpoolDeposits ?? [];
        earnpoolWithdraws = data?.earnpoolWithdraws ?? [];
      } catch (error) {
        console.error(`[getCubesDashboardInfo] The Graph query error for ${chain}:`, error);
        // Continue with empty arrays - we'll use on-chain data from positions
      }

      return [
        chain,
        Object.fromEntries(
          await Promise.all(
            cubes.map(async (cube, index) => {            
              const depositLogs: CubeDepositLog[] = earnpoolDeposits.filter(
                (deposit: CubeDepositLog) =>
                  deposit.earn === cube.earn.toLowerCase(),
              );

              const withdrawLogs: CubeWithdrawLog[] = earnpoolWithdraws.filter(
                (withdraw: CubeWithdrawLog) =>
                  withdraw.earn === cube.earn.toLowerCase(),
              );

              const deposits = await Promise.all(
                depositLogs.map(
                  async ({
                    totalSize,
                    amountStable,
                    timestamp,
                    blockNumber,
                    transactionHash,
                  }) => {
                    let price: bigint;
                    try {
                      price = await publicClient.readContract({
                        abi: priceAggregatorAbi,
                        address: cube.priceAggregator as Address,
                        functionName: 'getPrice',
                        args: [cube.stableAddress as Address],
                        blockNumber: BigInt(blockNumber) ?? undefined,
                      });
                    } catch (error) {
                      // If historical state is not available, use current block
                      console.warn(`[getCubesDashboardInfo] Historical price not available for block ${blockNumber}, using current block`);
                      price = await publicClient.readContract({
                        abi: priceAggregatorAbi,
                        address: cube.priceAggregator as Address,
                        functionName: 'getPrice',
                        args: [cube.stableAddress as Address],
                      });
                    }
                    const totalSizeNumber = +formatUnits(
                      BigInt(totalSize),
                      cube.stableDecimals,
                    );
                    const amountStableNumber = +formatUnits(
                      BigInt(amountStable),
                      cube.stableDecimals,
                    );
                    const priceNumber = +formatUnits(price, 18);

                    const part =
                      totalSizeNumber === 0
                        ? amountStableNumber / totalSizeNumber
                        : 1;

                    let vaultsDeposits: bigint[];
                    try {
                      vaultsDeposits = await publicClient.multicall({
                        contracts: cube.vaults.map((vault) => ({
                          abi: earnAbi,
                          address: cube.earn as Address,
                          functionName: 'vaultDeposited',
                          args: [
                            address,
                            vaults[vault.vaultId].earnContractAddress as Address,
                          ],
                        })),
                        allowFailure: false,
                        blockNumber: BigInt(blockNumber) ?? undefined,
                      });
                    } catch (error) {
                      // If historical state is not available, use current block
                      console.warn(`[getCubesDashboardInfo] Historical vault deposits not available for block ${blockNumber}, using current block`);
                      vaultsDeposits = await publicClient.multicall({
                        contracts: cube.vaults.map((vault) => ({
                          abi: earnAbi,
                          address: cube.earn as Address,
                          functionName: 'vaultDeposited',
                          args: [
                            address,
                            vaults[vault.vaultId].earnContractAddress as Address,
                          ],
                        })),
                        allowFailure: false,
                      });
                    }

                    const actionsMap = cube.vaults.reduce(
                      (acc, vault, index) => {
                        const vaultDeposit = +formatUnits(
                          vaultsDeposits[index] ?? BigInt(0),
                          vaults[vault.vaultId].tokenDecimals ?? 18,
                        );
                        const lpPrice = vaults[vault.vaultId].lps?.price ?? 0;

                        acc[vault.vaultId] = {
                          type: 'Deposit',
                          amount: vaultDeposit * part * lpPrice,
                          balance: vaultDeposit * lpPrice,
                          timestamp: +timestamp.toString() * 1000,
                          etherscanLink: getTransactionUrl(
                            publicClient.chain?.blockExplorers?.default.url ??
                              'https://etherscan.io',
                            transactionHash ?? '',
                          ),
                        };
                        return acc;
                      },
                      {} as Record<string, CubeVaultActionInfo>,
                    );

                    return {
                      deposit: amountStableNumber * priceNumber,
                      actionsMap,
                    };
                  },
                ),
              );
              const withdrawals = await Promise.all(
                withdrawLogs.map(
                  async ({
                    totalSize,
                    amountStable,
                    timestamp,
                    blockNumber,
                    transactionHash,
                  }) => {
                    let price: bigint;
                    try {
                      price = await publicClient.readContract({
                        abi: priceAggregatorAbi,
                        address: cube.priceAggregator as Address,
                        functionName: 'getPrice',
                        args: [cube.stableAddress as Address],
                        blockNumber: BigInt(blockNumber) ?? undefined,
                      });
                    } catch (error) {
                      // If historical state is not available, use current block
                      console.warn(`[getCubesDashboardInfo] Historical price not available for block ${blockNumber}, using current block`);
                      price = await publicClient.readContract({
                        abi: priceAggregatorAbi,
                        address: cube.priceAggregator as Address,
                        functionName: 'getPrice',
                        args: [cube.stableAddress as Address],
                      });
                    }
                    const totalSizeNumber = +formatUnits(
                      BigInt(totalSize),
                      cube.stableDecimals,
                    );
                    const amountStableNumber = +formatUnits(
                      BigInt(amountStable),
                      cube.stableDecimals,
                    );
                    const priceNumber = +formatUnits(price, 18);
                    const part =
                      totalSizeNumber > 0
                        ? amountStableNumber / totalSizeNumber
                        : 1;

                    let vaultsDeposits: bigint[];
                    try {
                      vaultsDeposits = await publicClient.multicall({
                        contracts: cube.vaults.map((vault) => ({
                          abi: earnAbi,
                          address: cube.earn as Address,
                          functionName: 'vaultDeposited',
                          args: [
                            address,
                            vaults[vault.vaultId].earnContractAddress as Address,
                          ],
                        })),
                        allowFailure: false,
                        blockNumber: BigInt(blockNumber) ?? undefined,
                      });
                    } catch (error) {
                      // If historical state is not available, use current block
                      console.warn(`[getCubesDashboardInfo] Historical vault deposits not available for block ${blockNumber}, using current block`);
                      vaultsDeposits = await publicClient.multicall({
                        contracts: cube.vaults.map((vault) => ({
                          abi: earnAbi,
                          address: cube.earn as Address,
                          functionName: 'vaultDeposited',
                          args: [
                            address,
                            vaults[vault.vaultId].earnContractAddress as Address,
                          ],
                        })),
                        allowFailure: false,
                      });
                    }

                    const actionsMap = cube.vaults.reduce(
                      (acc, vault, index) => {
                        const vaultDeposit = +formatUnits(
                          vaultsDeposits[index] ?? BigInt(0),
                          vaults[vault.vaultId].tokenDecimals ?? 18,
                        );
                        const lpPrice = vaults[vault.vaultId].lps?.price ?? 0;

                        acc[vault.vaultId] = {
                          type: 'Withdraw',
                          amount: vaultDeposit * part * lpPrice,
                          balance: vaultDeposit * lpPrice,
                          timestamp: +timestamp.toString() * 1000,
                          etherscanLink: getTransactionUrl(
                            publicClient.chain?.blockExplorers?.default.url ??
                              'https://etherscan.io',
                            transactionHash ?? '',
                          ),
                        };
                        return acc;
                      },
                      {} as Record<string, CubeVaultActionInfo>,
                    );

                    return {
                      withdrawal: amountStableNumber * priceNumber,
                      actionsMap,
                    };
                  },
                ),
              );
              const atDeposit =
                deposits.reduce((acc, deposit) => acc + deposit.deposit, 0) -
                withdrawals.reduce(
                  (acc, withdrawal) => acc + withdrawal.withdrawal,
                  0,
                );
              const now = +formatUnits(
                nows[index].result?.[0] ?? BigInt(0),
                18,
              );

              return [
                cube.earn as Address,
                {
                  atDeposit,
                  now,
                  pnl: now - atDeposit,
                  balance:
                    nows[index].result?.[0] &&
                    nows[index].result?.[0] !== BigInt(0)
                      ? nows[index].result?.[0]?.toString()
                      : undefined,
                  stopLoss: +formatUnits(
                    positions[index]?.result?.[3] ?? BigInt(0),
                    18,
                  ),
                  stopLossPercent:
                    100 -
                    +formatUnits(
                      positions[index]?.result?.[4] ?? BigInt(0),
                      18,
                    ),
                  vaultsMap: cube.vaults.reduce(
                    (acc, cubeVault) => {
                      const vaultId = cubeVault.vaultId;
                      const vaultDeposits = deposits.map(
                        (deposit) => deposit.actionsMap[vaultId],
                      );
                      const vaultWithdrawals = withdrawals.map(
                        (withdrawal) => withdrawal.actionsMap[vaultId],
                      );
                      const allActions = vaultDeposits
                        .concat(vaultWithdrawals)
                        .sort((a, b) => +a.timestamp - +b.timestamp);
                      const atDepositVault = (atDeposit * cubeVault.part) / 100;
                      const nowVault = (now * cubeVault.part) / 100;
                      acc[vaultId] = {
                        atDeposit: atDepositVault,
                        pnl: nowVault - atDepositVault,
                        now: nowVault,
                        actions: allActions,
                      };

                      return acc;
                    },
                    {} as Record<string, CubeVaultDashboardInfo>,
                  ),
                },
              ] as CubeDashboardInfoTuple;
            }),
          ),
        ),
      ] as const;
    }),
  );

  const mapped = settled
    .map((promise) => {
      if (promise.status === 'fulfilled') {
        return promise.value;
      } else {
        console.error('[getCubesDashboardInfo] Error for chain:', promise.reason);
        return null;
      }
    })
    .filter((value) => value !== null) as (readonly [
    string,
    { [p: string]: CubeDashboardInfoTuple[1] },
  ])[];

  return Object.fromEntries(mapped);
};
