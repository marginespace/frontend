interface Asset {
  description: string;
  website: string;
  docs: string | null;
  chains: { [chainId: string]: string | null };
}

const assetDetails: { [id: string]: Asset } = {
  rETH: {
    description:
      "rETH is Rocket Pool's token for liquid staking. It represents the ETH you stake, earning rewards in Ethereum's Proof-of-Stake.",
    website: 'https://rocketpool.net',
    docs: 'https://docs.rocketpool.net/guides/',
    chains: {
      ethereum:
        'https://etherscan.io/token/0xae78736Cd615f374D3085123A210448E74Fc6393',
      arbitrum:
        'https://arbiscan.io/token/0xEC70Dcb4A1EFa46b8F2D97C310C9c4790ba5ffA8',
    },
  },
  ETH: {
    description:
      'Ether or ETH is the native currency built on the Ethereum blockchain.',
    website: 'https://ethereum.org',
    docs: 'https://ethereum.org/en/developers/docs',
    chains: {
      ethereum: null,
      polygon:
        'https://polygonscan.com/token/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      bsc: 'https://bscscan.com/token/0x2170Ed0880ac9A755fd29B2688956BD959F933F8',
      arbitrum: null,
    },
  },
  wstETH: {
    description:
      "Lido DAO is a decentralized autonomous organization (DAO) that offers staking infrastructure for various blockchain networks. Specifically, it provides a liquid staking solution for Ethereum, enabling users to stake their ETH and get stETH (Lido staked ETH) tokens in return. These tokens represent both the user's staked ETH and the associated staking rewards.",
    website: 'https://lido.fi',
    docs: 'https://docs.lido.fi',
    chains: {
      ethereum:
        'https://etherscan.io/token/0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
      arbitrum:
        'https://arbiscan.io/token/0x5979D7b546E38E414F7E9822514be443A4800529',
    },
  },
  sfrxETH: {
    description:
      'sfrxETH is an ERC-4626 vault created to accumulate the staking yield from Frax ETH validators. Users can exchange frxETH for sfrxETH by depositing it into the sfrxETH vault, enabling them to earn staking yield on their frxETH. As validators generate staking yield over time, a corresponding amount of frxETH is minted and added to the vault. This allows users to redeem their sfrxETH for a larger amount of frxETH than they initially deposited.',
    website: 'https://app.frax.finance/frxeth/mint',
    docs: 'https://docs.frax.finance/frax-ether/frxeth-and-sfrxeth',
    chains: {
      ethereum:
        'https://etherscan.io/token/0xac3E018457B222d93114458476f3E3416Abbe38F',
    },
  },
  AURA: {
    description:
      "Aura Finance is a protocol that utilizes the Balancer system to offer attractive incentives for Balancer liquidity providers and BAL stakers through combining BAL deposits and Aura's own token. For BAL stakers, Aura simplifies the veBAL onboarding process by introducing a tokenized wrapper called auraBAL. This token represents the 80/20 BPT locked up for the longest period in VotingEscrow. By staking auraBAL, users can earn existing rewards from Balancer, along with Aura system revenue in the form of BAL and additional AURA.",
    website: 'https://aura.finance',
    docs: 'https://docs.aura.finance',
    chains: {
      ethereum:
        'https://etherscan.io/token/0xC0c293ce456fF0ED870ADd98a0828Dd4d2903DBF',
    },
  },
  WETH: {
    description:
      'Ether or ETH is the native currency built on the Ethereum blockchain.',
    website: 'https://ethereum.org',
    docs: 'https://ethereum.org/en/developers/docs',
    chains: {
      ethereum:
        'https://etherscan.io/token/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      polygon:
        'https://polygonscan.com/token/0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619 ',
      bsc: null,
      arbitrum:
        'https://arbiscan.io/token/0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    },
  },
  USDC: {
    description:
      'USD Coin (USDC) is a digital stablecoin pegged 1:1 to the United States dollar. It is managed by a group called Centre, founded by Circle and includes members from Coinbase and Bitmain. USDC is not a central bank digital currency (CBDC) and is issued by a private entity.',
    website: 'https://www.circle.com/en/usdc',
    docs: 'https://developers.circle.com/circle-mint/docs',
    chains: {
      ethereum:
        'https://etherscan.io/token/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      polygon:
        'https://polygonscan.com/token/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      bsc: 'https://bscscan.com/token/0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      arbitrum:
        'https://arbiscan.io/token/0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
    },
  },
  WBTC: {
    description:
      "Wrapped Bitcoin (WBTC) is an Ethereum token that is intended to represent Bitcoin (BTC) on the Ethereum blockchain. It is not Bitcoin, but rather a separate ERC-20 token that's designed to track Bitcoin's value.",
    website: 'https://wbtc.network',
    docs: null,
    chains: {
      ethereum:
        'https://etherscan.io/token/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    },
  },
  USDT: {
    description:
      'USDT, or Tether, is a type of digital stablecoin that is pegged to the value of the US dollar. It provides a stable and secure way to transact in the cryptocurrency market, with each USDT token representing one US dollar.',
    website: 'https://tether.to/',
    docs: 'https://tether.to/en/how-it-works/',
    chains: {
      ethereum:
        'https://etherscan.io/token/0xdAC17F958D2ee523a2206206994597C13D831ec7',
      bsc: 'https://bscscan.com/token/0x55d398326f99059fF775485246999027B3197955',
      polygon:
        'https://polygonscan.com/token/0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      arbitrum:
        'https://arbiscan.io/token/0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    },
  },
  USDD: {
    description:
      "USDD is a stablecoin issued by the TRON DAO Reserve, tied to the US dollar's value. Its goal is to offer a dependable, decentralized cryptocurrency for blockchain transactions.",
    website: 'https://usdd.io/#/',
    docs: 'https://usdd.io/USDD-en.pdf',
    chains: {
      ethereum:
        'https://etherscan.io/token/0x0C10bF8FcB7Bf5412187A595ab97a3609160b5c6',
    },
  },
  DAI: {
    description:
      'DAI is a crypto-backed stablecoin, meaning its value is pegged to the value of one US dollar, providing a reliable digital currency with a value equivalent to traditional currencies.',
    website: 'https://makerdao.com/en/',
    docs: 'https://docs.makerdao.com/smart-contract-modules/dai-module/dai-detailed-documentation',
    chains: {
      ethereum:
        'https://etherscan.io/token/0x6B175474E89094C44Da98b954EedeAC495271d0F',
      polygon:
        'https://polygonscan.com/token/0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      arbitrum:
        'https://arbiscan.io/token/0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
    },
  },
  'TUSD (Retired)': {
    description:
      'TrueUSD is the first USD-pegged stablecoin to deploy real-time attestations for its underlying reserves by independent third-party institutions.',
    website: 'https://tusd.io',
    docs: null,
    chains: {
      ethereum:
        'https://etherscan.io/token/0x0000000000085d4780B73119b644AE5ecd22b376',
    },
  },
  MIM: {
    description:
      'MIM is a stablecoin that is soft-pegged to the US Dollar and minted by the Abracadabra. money decentralized lending platform. Abracadabra uses crypto assets with interest to make MIM, which you can exchange for other stablecoins.',
    website: 'https://abracadabra.money',
    docs: 'https://docs.abracadabra.money',
    chains: {
      ethereum:
        'https://etherscan.io/token/0x99D8a9C45b2ecA8864373A26D1459e3Dff1e17F3',
    },
  },
  CVX: {
    description:
      'Convex enables Curve.fi liquidity providers to earn trading fees and claim enhanced CRV rewards without needing to lock CRV themselves. It offers an easy way for liquidity providers to receive boosted CRV and liquidity mining rewards with minimal effort.',
    website: 'https://www.convexfinance.com',
    docs: 'https://docs.convexfinance.com',
    chains: {
      ethereum:
        'https://etherscan.io/token/0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B',
    },
  },
  LDO: {
    description:
      'Lido is a liquid staking solution for ETH 2.0 backed by industry-leading staking providers.',
    website: 'https://stake.lido.fi',
    docs: 'https://docs.lido.fi',
    chains: {
      ethereum:
        'https://etherscan.io/token/0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32',
    },
  },
  cvxCRV: {
    description:
      'Convex enables Curve.fi liquidity providers to earn trading fees and claim enhanced CRV rewards without needing to lock CRV themselves. It offers an easy way for liquidity providers to receive boosted CRV and liquidity mining rewards with minimal effort.',
    website: 'https://www.convexfinance.com',
    docs: 'https://docs.convexfinance.com/convexfinance/',
    chains: {
      ethereum:
        'https://etherscan.io/token/0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7',
    },
  },
  CRV: {
    description:
      'Curve is an Ethereum-based exchange liquidity pool tailored for highly efficient stablecoin trading. It offers low-risk opportunities for liquidity providers to earn additional fees without incurring opportunity costs.',
    website: 'https://curve.fi/#/ethereum/swap',
    docs: 'https://curve.readthedocs.io',
    chains: {
      ethereum:
        'https://etherscan.io/token/0xD533a949740bb3306d119CC777fa900bA034cd52',
    },
  },
  MATIC: {
    description:
      'Polygon is a Layer 2 scaling solution for Ethereum, aiming to improve its scalability and reduce transaction fees. It operates as a sidechain and enhances the overall performance of the Ethereum network. The native token of Polygon is MATIC, which is used for transactions, governance, and securing the network through staking.',
    website: 'https://polygon.technology',
    docs: 'https://wiki.polygon.technology',
    chains: { polygon: null },
  },
  CAKE: {
    description:
      'PancakeSwap is a decentralized exchange and yield farming platform that provides users with a wide range of opportunities for cryptocurrency trading and farming within the Binance Smart Chain ecosystem.',
    website: 'https://pancakeswap.finance',
    docs: 'https://docs.pancakeswap.finance',
    chains: {
      bsc: 'https://bscscan.com/token/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
    },
  },
  BNB: {
    description:
      'BNB is a cryptocurrency that supports the Binance Chain ecosystem. bsc is one of the most popular utility tokens globally. You can not only trade BNB, like any other cryptocurrency, but also use BNB for a wide range of additional benefits.',
    website: 'https://www.bnbchain.org/en',
    docs: 'https://docs.bnbchain.org/docs/overview',
    chains: { bsc: null },
  },
  BUSD: {
    description:
      'Binance USD (BUSD) is an Ethereum-based stablecoin. In the case of stablecoins like BUSD, the protocol operator is responsible for maintaining reserves that fully back each token. The companies behind BUSD, Binance and Paxos, claim that each BUSD token is backed by funds held in traditional bank accounts and is equivalent to one US dollar.',
    website: 'https://paxos.com/busd/',
    docs: 'https://paxos.com/busd-transparency/',
    chains: {
      bsc: 'https://bscscan.com/token/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
    },
  },
  cbETH: {
    description:
      "cbETH is an ERC-20 utility token introduced by Coinbase to symbolize Ethereum 2.0 (ETH2) within its platform. Initially, cbETH and ETH share identical values. Nevertheless, Coinbase anticipates cbETH's price to diverge from standard ETH over time. Each token signifies one cbETH along with any accumulated staking value.",
    website: 'https://coinbase.com/',
    docs: 'https://help.coinbase.com/en/coinbase/coinbase-staking/staking/cbeth-intro',
    chains: {
      arbitrum:
        'https://arbiscan.io/token/0x1DEBd73E752bEaF79865Fd6446b0c970EaE7732f',
    },
  },
  'USDC.e': {
    description:
      'USDC.e is a version of USDC that operates on the Ethereum network and is connected through the official arbitrum Bridge.',
    website: 'https://www.circle.com/en/usdc-multichain/arbitrum',
    docs: 'https://developers.circle.com/circle-mint/docs',
    chains: {
      arbitrum:
        'https://arbiscan.io/token/0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
    },
  },
  AuraBAL: {
    description:
      "auraBAL represents Aura's staked BAL tokens, which are locked in a liquid staking arrangement with an 80:20 ratio of BAL to ETH in the form of BPT (Balancer Pool Tokens).",
    website: 'https://aura.finance',
    docs: 'https://docs.aura.finance/aura/what-is-aura/for-usdbal-stakers',
    chains: {
      arbitrum:
        'https://arbiscan.io/token/0x223738a747383d6F9f827d95964e4d8E8AC754cE',
    },
  },
  ARB: {
    description:
      "Arbitrum (ARB) is a game-changing Layer 2 scaling solution created to boost Ethereum's capabilities, the top-tier Layer 1 blockchain. Made by Offchain Labs, Arbitrum aims to give developers and users a platform for building and using decentralized applications (dApps) faster and with lower transaction costs. It does this while upholding Ethereum's security standards.",
    website: 'https://arbitrum.foundation',
    docs: 'https://docs.arbitrum.foundation/gentle-intro-dao-governance',
    chains: {
      arbitrum:
        'https://arbiscan.io/token/0x912CE59144191C1204E64559FE8253a0e49E6548',
    },
  },
};

export const getAssetDetails = (asset: string): Asset | null => {
  return assetDetails[asset] ?? null;
};
