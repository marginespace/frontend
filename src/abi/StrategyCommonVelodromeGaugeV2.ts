export const strategyCommonVelodromeGaugeV2Abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'callFees',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'batcherFees',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'strategistFees',
        type: 'uint256',
      },
    ],
    name: 'ChargedFees',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tvl',
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
        name: 'feeConfig',
        type: 'address',
      },
    ],
    name: 'SetFeeConfig',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'feeRecipient',
        type: 'address',
      },
    ],
    name: 'SetFeeRecipient',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'keeper',
        type: 'address',
      },
    ],
    name: 'SetKeeper',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'feeId',
        type: 'uint256',
      },
    ],
    name: 'SetStratFeeId',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'strategist',
        type: 'address',
      },
    ],
    name: 'SetStrategist',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'unirouter',
        type: 'address',
      },
    ],
    name: 'SetUnirouter',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'vault',
        type: 'address',
      },
    ],
    name: 'SetVault',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'harvester',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'wantHarvested',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tvl',
        type: 'uint256',
      },
    ],
    name: 'StratHarvest',
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
        indexed: false,
        internalType: 'uint256',
        name: 'tvl',
        type: 'uint256',
      },
    ],
    name: 'Withdraw',
    type: 'event',
  },
  {
    inputs: [],
    name: 'balanceOf',
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
    name: 'balanceOfPool',
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
    name: 'balanceOfWant',
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
    name: 'beforeDeposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'callReward',
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
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'factory',
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
    name: 'feeConfig',
    outputs: [
      {
        internalType: 'contract IFeeConfig',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'feeRecipient',
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
    name: 'gasprice',
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
    name: 'gauge',
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
    name: 'getAllFees',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'uint256',
                name: 'total',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'batcher',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'call',
                type: 'uint256',
              },
              {
                internalType: 'uint256',
                name: 'strategist',
                type: 'uint256',
              },
              {
                internalType: 'string',
                name: 'label',
                type: 'string',
              },
              {
                internalType: 'bool',
                name: 'active',
                type: 'bool',
              },
            ],
            internalType: 'struct IFeeConfig.FeeCategory',
            name: 'performance',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'deposit',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'withdraw',
            type: 'uint256',
          },
        ],
        internalType: 'struct IFeeConfig.AllFees',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getOutputToLp0Route',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'stable',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'factory',
            type: 'address',
          },
        ],
        internalType: 'struct ISolidlyRouter.Route[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getOutputToLp1Route',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'stable',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'factory',
            type: 'address',
          },
        ],
        internalType: 'struct ISolidlyRouter.Route[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getStratFeeId',
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
    inputs: [
      {
        internalType: 'address',
        name: 'callFeeRecipient',
        type: 'address',
      },
    ],
    name: 'harvest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'harvest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'harvestOnDeposit',
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
        name: '_want',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_gauge',
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
            internalType: 'address',
            name: 'unirouter',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'ac',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'feeRecipient',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'feeConfig',
            type: 'address',
          },
        ],
        internalType:
          'struct StratFeeManagerAccessableInitializable.CommonAddressesAccessable',
        name: '_commonAddresses',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'stable',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'factory',
            type: 'address',
          },
        ],
        internalType: 'struct ISolidlyRouter.Route[]',
        name: '_outputToNativeRoute',
        type: 'tuple[]',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'stable',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'factory',
            type: 'address',
          },
        ],
        internalType: 'struct ISolidlyRouter.Route[]',
        name: '_outputToLp0Route',
        type: 'tuple[]',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'from',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'to',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'stable',
            type: 'bool',
          },
          {
            internalType: 'address',
            name: 'factory',
            type: 'address',
          },
        ],
        internalType: 'struct ISolidlyRouter.Route[]',
        name: '_outputToLp1Route',
        type: 'tuple[]',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'keeper',
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
    name: 'lastHarvest',
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
    name: 'lpToken0',
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
    name: 'lpToken1',
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
    name: 'managerHarvest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'native',
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
    name: 'output',
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
    name: 'outputToLp0',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
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
    name: 'outputToLp0Route',
    outputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'stable',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'factory',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'outputToLp1',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
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
    name: 'outputToLp1Route',
    outputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'stable',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'factory',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'outputToNative',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
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
    name: 'outputToNativeRoute',
    outputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'stable',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'factory',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'panic',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [],
    name: 'retireStrat',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rewardsAvailable',
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
        name: '_feeConfig',
        type: 'address',
      },
    ],
    name: 'setFeeConfig',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_feeRecipient',
        type: 'address',
      },
    ],
    name: 'setFeeRecipient',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: '_harvestOnDeposit',
        type: 'bool',
      },
    ],
    name: 'setHarvestOnDeposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: '_shouldGasThrottle',
        type: 'bool',
      },
    ],
    name: 'setShouldGasThrottle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_feeId',
        type: 'uint256',
      },
    ],
    name: 'setStratFeeId',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_unirouter',
        type: 'address',
      },
    ],
    name: 'setUnirouter',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_vault',
        type: 'address',
      },
    ],
    name: 'setVault',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'shouldGasThrottle',
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
    inputs: [],
    name: 'stable',
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
    inputs: [],
    name: 'unirouter',
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
    inputs: [],
    name: 'vault',
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
    name: 'want',
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
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;
