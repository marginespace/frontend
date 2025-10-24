export const earnAbi = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountStable',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'feeTaken',
        type: 'uint256',
      },
    ],
    name: 'CloseByStopLoss',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountStable',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalSize',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'stopLossUsd',
        type: 'uint256',
      },
    ],
    name: 'Deposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'timestamp',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountStable',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalSize',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'stopLossUsd',
        type: 'uint256',
      },
    ],
    name: 'Withdraw',
    type: 'event',
  },
  {
    inputs: [],
    name: 'MAX_DEPOSIT_FEE',
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
    inputs: [],
    name: 'MAX_WITHDRAWAL_FEE',
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
    inputs: [],
    name: 'automate',
    outputs: [
      {
        internalType: 'contract IAutomate',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'user',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'minStableOut',
            type: 'uint256',
          },
        ],
        internalType: 'struct EarnPool.CloseParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'closeByStopLoss',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'dedicatedMsgSender',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'amountTokenIn',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stopLossCost',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'tokenIn',
            type: 'address',
          },
          {
            internalType: 'bytes',
            name: 'oneInchSwapData',
            type: 'bytes',
          },
          {
            internalType: 'uint256',
            name: 'stopLossPercent',
            type: 'uint256',
          },
        ],
        internalType: 'struct EarnPool.DepositParams',
        name: 'params',
        type: 'tuple',
      },
      {
        internalType: 'uint256[][]',
        name: 'minAmountsOut',
        type: 'uint256[][]',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'stopLossCost',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'oneInchSwapData',
            type: 'bytes',
          },
          {
            internalType: 'uint256',
            name: 'stopLossPercent',
            type: 'uint256',
          },
        ],
        internalType: 'struct EarnPool.DepositETHParams',
        name: 'params',
        type: 'tuple',
      },
      {
        internalType: 'uint256[][]',
        name: 'minAmountsOut',
        type: 'uint256[][]',
      },
    ],
    name: 'depositETH',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'earnConfiguration',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'fees',
    outputs: [
      {
        internalType: 'uint256',
        name: 'depositFee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'withdrawalFee',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'fundsOwner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getPositionCost',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
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
      {
        internalType: 'uint256',
        name: 'stopLossCost',
        type: 'uint256',
      },
    ],
    name: 'getPositionCost',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getStrategist',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getVaultConfigs',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'vault',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'poolPart',
            type: 'uint256',
          },
        ],
        internalType: 'struct VaultConfig[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_ac',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_earnConfiguration',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_oneInchRouter',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_wETH',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_automate',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_resolver',
        type: 'address',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'vault',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'poolPart',
            type: 'uint256',
          },
        ],
        internalType: 'struct VaultConfig[]',
        name: '_vaultConfigs',
        type: 'tuple[]',
      },
      {
        components: [
          {
            internalType: 'uint256',
            name: 'depositFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'withdrawalFee',
            type: 'uint256',
          },
        ],
        internalType: 'struct EarnPool.Fees',
        name: '_fees',
        type: 'tuple',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'oneInchRouter',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'positions',
    outputs: [
      {
        internalType: 'bytes32',
        name: 'automationTaskId',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'reservedForAutomation',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'size',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'stopLossCost',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'stopLossPercent',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'resolver',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'depositFee',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'withdrawalFee',
            type: 'uint256',
          },
        ],
        internalType: 'struct EarnPool.Fees',
        name: '_fees',
        type: 'tuple',
      },
    ],
    name: 'setFees',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stable',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'taskTreasury',
    outputs: [
      {
        internalType: 'contract ITaskTreasuryUpgradable',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'role',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'userHasRole',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'userStopLossCost',
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
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'vaultConfigs',
    outputs: [
      {
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'poolPart',
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
        name: 'user',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
    ],
    name: 'vaultDeposited',
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
    inputs: [],
    name: 'wETH',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'withdrawalToken',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'unwrapNative',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'withdrawCost',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'stopLossCost',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'minStableOut',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'oneInchSwapData',
            type: 'bytes',
          },
        ],
        internalType: 'struct EarnPool.WithdrawParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'withdraw',
    outputs: [
      {
        internalType: 'uint256',
        name: 'stableReceived',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_token',
        type: 'address',
      },
    ],
    name: 'withdrawFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
] as const;
