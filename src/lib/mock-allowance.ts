import { type Address, encodePacked, keccak256, maxUint256 } from 'viem';

export const getStateDiffForMockedAllowance = ({
  owner,
  spender,
  tokenAddress,
  allowanceMappingSlot = 52,
}: {
  tokenAddress: Address;
  allowanceMappingSlot?: number;
  spender: Address;
  owner: Address;
}) => {
  const temp = keccak256(
    encodePacked(
      ['uint256', 'uint256'],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [owner as any, BigInt(allowanceMappingSlot)],
    ),
  );

  const index = keccak256(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    encodePacked(['uint256', 'bytes32'], [spender as any, temp]),
  );

  return {
    [tokenAddress]: {
      stateDiff: {
        [index]: '0x' + maxUint256.toString(16),
      },
    },
  };
};
