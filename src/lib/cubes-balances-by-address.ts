import groupBy from 'lodash.groupby';
import { type Address } from 'viem';

import { earnPoolCheckerAbi } from '@/abi/earn/EarnPoolChecker';
import { type Cube } from '@/actions/get-all-cubes';
import { apiChainToPublicClient } from '@/lib/api-chain-to-wagmi';

type CubeBalanceWithAddressTuple = [
  Address,
  {
    balance: string;
  },
];
type CubesBalancesByAddress = Record<string, CubeBalanceWithAddressTuple[1]>;
export type GetCubesBalancesByAddressReturn = Record<
  string,
  CubesBalancesByAddress
>;

export const getCubesBalancesByAddress = async (
  cubes: Cube[],
  address?: string,
): Promise<GetCubesBalancesByAddressReturn> => {
  if (!address) {
    return {};
  }

  const cubesByChain = groupBy(cubes, (cube) => cube.network);

  return Object.fromEntries(
    (
      await Promise.allSettled(
        Object.entries(cubesByChain).map(async ([chain, cubes]) => {
          const publicClient = apiChainToPublicClient(chain);
          const earnContractAddresses = cubes.map((cube) => ({
            pool: cube.earn as Address,
            checker: cube.gelatoChecker as Address,
          }));

          const contractStableRecieved = earnContractAddresses.map(
            (contract) =>
              ({
                abi: earnPoolCheckerAbi,
                address: contract.checker,
                functionName: 'stableReceivedStopLoss',
                args: [contract.pool, address as Address],
              }) as const,
          );

          const stablesRecieved = await publicClient.multicall({
            contracts: contractStableRecieved,
          });

          const record = Object.fromEntries(
            (
              await Promise.all(
                earnContractAddresses.map(async (contractAddress, index) => {
                  const stableRecieved = stablesRecieved[index];
                  return stableRecieved.status === 'success' &&
                    stableRecieved.result[0] > BigInt(0)
                    ? ([
                        contractAddress.pool,
                        {
                          balance: stableRecieved.result[0].toString(),
                        },
                      ] as CubeBalanceWithAddressTuple)
                    : undefined;
                }),
              )
            ).filter((result) => !!result) as CubeBalanceWithAddressTuple[],
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
