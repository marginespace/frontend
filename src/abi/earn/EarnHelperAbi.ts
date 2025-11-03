export const earnHelperAbi = [
  {
    inputs: [],
    name: 'PERCENTS_100',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'earn',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'stableAmount',
        type: 'uint256',
      },
    ],
    name: 'estimateAmountsOutDeposit',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'tokenSwapTo',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'tokenSwapFrom',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'swapPath',
            type: 'bytes',
          },
          {
            internalType: 'uint256',
            name: 'amountFrom',
            type: 'uint256',
          },
        ],
        internalType: 'struct EarnHelper.DepositAmountsOut[][]',
        name: 'amountsOut',
        type: 'tuple[][]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'earn',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'withdrawCost',
        type: 'uint256',
      },
    ],
    name: 'estimateAmountsOutWithdraw',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'tokenSwapTo',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'tokenSwapFrom',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'swapPath',
            type: 'bytes',
          },
          {
            internalType: 'uint256',
            name: 'amountFrom',
            type: 'uint256',
          },
        ],
        internalType: 'struct EarnHelper.WithdrawAmountsOut[][]',
        name: 'amountsOut',
        type: 'tuple[][]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
