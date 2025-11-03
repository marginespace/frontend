export const EarnFactoryAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_earnBeacon',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'earn',
        type: 'address',
      },
    ],
    name: 'EarnDeployed',
    type: 'event',
  },
  {
    inputs: [
      {
        components: [
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
        internalType: 'struct EarnFactory.EarnParams',
        name: 'earnParams',
        type: 'tuple',
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
    ],
    name: 'deploy',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
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
    name: 'deployed',
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
    name: 'deployedCount',
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
    name: 'earnBeacon',
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
];
