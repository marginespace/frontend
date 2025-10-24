import { type Address, encodePacked, keccak256, maxUint256 } from 'viem';

export const getStateDiffForMockedBalance = ({
  user,
  tokenAddresses,
  balanceOfMappingSlot = 9,
}: {
  tokenAddresses: Address[];
  balanceOfMappingSlot?: number;
  user: Address;
}) => {
  const index = keccak256(
    encodePacked(
      //Todo maybe set to uint256 uint256
      ['address', 'uint256'],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [user as any, BigInt(balanceOfMappingSlot)],
    ),
  );

  return Object.fromEntries(
    tokenAddresses.map((t) => [
      t,
      {
        stateDiff: {
          [index]: '0x' + maxUint256.toString(16),
        },
      },
    ]),
  );
};
