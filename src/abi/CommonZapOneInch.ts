export const commonZapOneInchAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_oneInchRouter',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_WETH',
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
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'TokenReturned',
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
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenIn',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountIn',
        type: 'uint256',
      },
    ],
    name: 'ZapIn',
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
      {
        indexed: false,
        internalType: 'address',
        name: 'desiredToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'mooTokenIn',
        type: 'uint256',
      },
    ],
    name: 'ZapOut',
    type: 'event',
  },
  {
    inputs: [],
    name: 'WETH',
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
        name: '_vault',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_inputToken',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_tokenInAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: '_type',
        type: 'uint8',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'beefIn',
    outputs: [
      {
        internalType: 'uint256',
        name: 'wantDeposited',
        type: 'uint256',
      },
    ],
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
      {
        internalType: 'uint8',
        name: '_type',
        type: 'uint8',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'beefInETH',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_vault',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_withdrawAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: '_want',
        type: 'uint8',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'beefOut',
    outputs: [
      {
        internalType: 'address[]',
        name: 'returnTokens',
        type: 'address[]',
      },
    ],
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
      {
        internalType: 'uint256',
        name: '_withdrawAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: '_type',
        type: 'uint8',
      },
      {
        internalType: 'address',
        name: '_desiredToken',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'beefOutAndSwap',
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
      {
        internalType: 'uint256',
        name: '_withdrawAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint8',
        name: '_want',
        type: 'uint8',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'beefOutBalances',
    outputs: [
      {
        internalType: 'address[]',
        name: 'returnTokens',
        type: 'address[]',
      },
      {
        internalType: 'uint256[]',
        name: 'amounts',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'minimumAmount',
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
    inputs: [
      {
        internalType: 'bool',
        name: 'success',
        type: 'bool',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
      {
        internalType: 'string',
        name: 'errorMessage',
        type: 'string',
      },
    ],
    name: 'propagateError',
    outputs: [],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    stateMutability: 'payable',
    type: 'receive',
  },
] as const;
