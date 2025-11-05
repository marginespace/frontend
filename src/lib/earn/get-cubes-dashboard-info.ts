import groupBy from 'lodash.groupby';
import { type Address, formatUnits, parseAbiItem } from 'viem';

import { earnAbi } from '@/abi/earn/EarnAbi';
import { earnPoolCheckerAbi } from '@/abi/earn/EarnPoolChecker';
import { priceAggregatorAbi } from '@/abi/earn/PriceAggregatorAbi';
import { type Cube } from '@/actions/get-all-cubes';
import { type VaultWithApyAndTvl } from '@/actions/get-all-vaults-with-apy-and-tvl';
import { earliestBlocks } from '@/constants/supported-chains';
import { getTransactionUrl } from '@/helpers/getTransactionUrl';
import { apiChainToPublicClient } from '@/lib/api-chain-to-wagmi';

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
      const nows = await publicClient.multicall({
        contracts: cubes.map((cube) => ({
          abi: earnPoolCheckerAbi,
          address: cube.gelatoChecker as Address,
          functionName: 'stableReceivedStopLoss',
          args: [cube.earn as Address, address],
        })),
      });
      const positions = await publicClient.multicall({
        contracts: cubes.map((cube) => ({
          abi: earnAbi,
          address: cube.earn as Address,
          functionName: 'positions',
          args: [address],
        })),
      });

      // For dashboard, use recent blocks instead of earliestBlocks to avoid RPC range errors
      // Start with 50000 blocks (approximately 1-2 weeks) instead of very old blocks
      const currentBlock = await publicClient.getBlockNumber();
      const dashboardStartBlock = currentBlock - BigInt(50000);
      const fromBlock = dashboardStartBlock > BigInt(0) ? dashboardStartBlock : BigInt(0);

      return [
        chain,
        Object.fromEntries(
          await Promise.all(
            cubes.map(async (cube, index) => {
              let depositLogs: any[] = [];
              let withdrawLogs: any[] = [];
              
              // Try to fetch logs with error handling and automatic range reduction
              try {
                [depositLogs, withdrawLogs] = await Promise.all([
                  publicClient.getLogs({
                    address: cube.earn as Address,
                    event: parseAbiItem(
                      'event Deposit(address indexed user, uint256 indexed timestamp, uint256 amountStable, uint256 totalSize, uint256 stopLossUsd)',
                    ),
                    args: { user: address },
                    fromBlock: fromBlock,
                    toBlock: 'latest',
                    strict: true,
                  }),
                  publicClient.getLogs({
                    address: cube.earn as Address,
                    event: parseAbiItem(
                      'event Withdraw(address indexed user, uint256 indexed timestamp, uint256 amountStable, uint256 totalSize, uint256 stopLossUsd)',
                    ),
                    args: { user: address },
                    fromBlock: fromBlock,
                    toBlock: 'latest',
                    strict: true,
                  }),
                ]);
              } catch (logsError: any) {
                // If error is "exceed maximum block range", try with smaller ranges
                if (logsError?.message?.includes('exceed maximum block range') || logsError?.message?.includes('50000')) {
                  console.warn(`[FRONTEND] getCubesDashboardInfo: ${chain} - cube ${cube.id} - block range too large, trying with smaller ranges`);
                  
                  // Try progressively smaller ranges: 20000, 10000, 5000
                  const ranges = [20000, 10000, 5000];
                  let success = false;
                  
                  for (const range of ranges) {
                    try {
                      const currentBlockRetry = await publicClient.getBlockNumber();
                      const fromBlockRetry = currentBlockRetry - BigInt(range);
                      const retryFromBlock = fromBlockRetry > BigInt(0) ? fromBlockRetry : BigInt(0);
                      [depositLogs, withdrawLogs] = await Promise.all([
                        publicClient.getLogs({
                          address: cube.earn as Address,
                          event: parseAbiItem(
                            'event Deposit(address indexed user, uint256 indexed timestamp, uint256 amountStable, uint256 totalSize, uint256 stopLossUsd)',
                          ),
                          args: { user: address },
                          fromBlock: retryFromBlock,
                          toBlock: 'latest',
                          strict: true,
                        }),
                        publicClient.getLogs({
                          address: cube.earn as Address,
                          event: parseAbiItem(
                            'event Withdraw(address indexed user, uint256 indexed timestamp, uint256 amountStable, uint256 totalSize, uint256 stopLossUsd)',
                          ),
                          args: { user: address },
                          fromBlock: retryFromBlock,
                          toBlock: 'latest',
                          strict: true,
                        }),
                      ]);
                      console.log(`[FRONTEND] getCubesDashboardInfo: ${chain} - cube ${cube.id} - successfully fetched logs with ${range} blocks range, found ${depositLogs.length} deposits, ${withdrawLogs.length} withdrawals`);
                      success = true;
                      break;
                    } catch (retryError: any) {
                      if (retryError?.message?.includes('exceed maximum block range')) {
                        console.warn(`[FRONTEND] getCubesDashboardInfo: ${chain} - cube ${cube.id} - ${range} blocks still too large, trying smaller range`);
                        continue;
                      } else {
                        console.error(`[FRONTEND] getCubesDashboardInfo: ${chain} - cube ${cube.id} - retry with ${range} blocks failed:`, retryError);
                        break;
                      }
                    }
                  }
                  
                  if (!success) {
                    console.error(`[FRONTEND] getCubesDashboardInfo: ${chain} - cube ${cube.id} - all retry attempts failed, using empty logs`);
                    depositLogs = [];
                    withdrawLogs = [];
                  }
                } else {
                  console.error(`[FRONTEND] getCubesDashboardInfo: ${chain} - cube ${cube.id} - getLogs error:`, logsError);
                  depositLogs = [];
                  withdrawLogs = [];
                }
              }

              const deposits = await Promise.all(
                depositLogs.map(
                  async ({
                    args: { amountStable, timestamp, totalSize },
                    blockNumber,
                    transactionHash,
                  }) => {
                    const price = await publicClient.readContract({
                      abi: priceAggregatorAbi,
                      address: cube.priceAggregator as Address,
                      functionName: 'getPrice',
                      args: [cube.stableAddress as Address],
                      blockNumber: blockNumber ?? undefined,
                    });
                    const totalSizeNumber = +formatUnits(
                      totalSize,
                      cube.stableDecimals,
                    );
                    const amountStableNumber = +formatUnits(
                      amountStable,
                      cube.stableDecimals,
                    );
                    const priceNumber = +formatUnits(price, 18);

                    const part =
                      totalSizeNumber === 0
                        ? amountStableNumber / totalSizeNumber
                        : 1;

                    const vaultsDeposits = await publicClient.multicall({
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
                      blockNumber: blockNumber ?? undefined,
                    });

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
                    args: { amountStable, timestamp, totalSize },
                    blockNumber,
                    transactionHash,
                  }) => {
                    const price = await publicClient.readContract({
                      abi: priceAggregatorAbi,
                      address: cube.priceAggregator as Address,
                      functionName: 'getPrice',
                      args: [cube.stableAddress as Address],
                      blockNumber: blockNumber ?? undefined,
                    });
                    const totalSizeNumber = +formatUnits(
                      totalSize,
                      cube.stableDecimals,
                    );
                    const amountStableNumber = +formatUnits(
                      amountStable,
                      cube.stableDecimals,
                    );
                    const priceNumber = +formatUnits(price, 18);
                    const part =
                      totalSizeNumber > 0
                        ? amountStableNumber / totalSizeNumber
                        : 1;

                    const vaultsDeposits = await publicClient.multicall({
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
                      blockNumber: blockNumber ?? undefined,
                    });

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
    .map((promise) => (promise.status === 'fulfilled' ? promise.value : null))
    .filter((value) => value !== null) as (readonly [
    string,
    { [p: string]: CubeDashboardInfoTuple[1] },
  ])[];

  return Object.fromEntries(mapped);
};
