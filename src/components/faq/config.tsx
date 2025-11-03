import { type ReactNode } from 'react';

export interface IFaqDropdownItem {
  question: string;
  answer: ReactNode | string;
}

export interface IFaqList {
  title: string;
  items: IFaqDropdownItem[];
}

// ==================== GETTING STARTED ====================
const gettingStartedFaqConfig: IFaqDropdownItem[] = [
  {
    question: 'What is Margin Space?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          Margin Space is an advanced DeFi yield aggregation platform that automatically optimizes your crypto assets across multiple chains and protocols. We leverage sophisticated strategies to maximize returns while minimizing risk and gas costs.
        </p>
        <p>
          Our platform features auto-compounding vaults, promotional pools with boosted rewards, and AI-powered yield optimization that works 24/7 to ensure you're always earning the best possible returns on your deposits.
        </p>
      </div>
    ),
  },
  {
    question: 'How do I get started?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          Getting started with Margin Space is simple:
        </p>
        <ol className="list-decimal list-inside space-y-2 ml-2">
          <li>Connect your Web3 wallet (MetaMask, WalletConnect, etc.)</li>
          <li>Select your preferred blockchain network</li>
          <li>Browse available vaults and choose one that fits your strategy</li>
          <li>Deposit your assets and start earning immediately</li>
        </ol>
        <p>
          Your deposits will automatically compound, and you can withdraw at any time without lock-up periods (except in specific promotional pools where noted).
        </p>
      </div>
    ),
  },
  {
    question: 'Which wallets are supported?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          Margin Space supports all major Web3 wallets including:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>MetaMask</li>
          <li>WalletConnect (mobile wallets)</li>
          <li>Coinbase Wallet</li>
          <li>Trust Wallet</li>
          <li>Ledger & Trezor hardware wallets</li>
        </ul>
        <p>
          We recommend using MetaMask or WalletConnect for the best experience.
        </p>
      </div>
    ),
  },
  {
    question: 'Which blockchains does Margin Space support?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          Margin Space is multi-chain and currently supports:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Ethereum</li>
          <li>BNB Chain (BSC)</li>
          <li>Polygon</li>
          <li>Arbitrum</li>
          <li>Optimism</li>
          <li>Avalanche</li>
          <li>Base</li>
        </ul>
        <p>
          We're constantly expanding to new chains based on community demand and liquidity opportunities. You can easily switch between chains using the network selector in the header.
        </p>
      </div>
    ),
  },
];

// ==================== VAULTS & STRATEGIES ====================
const vaultsAndStrategiesFaqConfig: IFaqDropdownItem[] = [
  {
    question: 'What are Vaults and how do they work?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          Vaults are smart contracts that automatically manage your deposited assets to generate yield. Each vault implements a specific strategy that deposits your funds into DeFi protocols, earns rewards, harvests them, and reinvests (auto-compounds) to maximize returns.
        </p>
        <p>
          When you deposit into a vault, you receive receipt tokens (vault shares) representing your portion of the vault. These shares automatically increase in value as the vault compounds your earnings.
        </p>
        <p>
          All vaults are non-custodial – you maintain full control and can withdraw your funds at any time.
        </p>
      </div>
    ),
  },
  {
    question: 'What is auto-compounding?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          Auto-compounding is the process of automatically harvesting earned rewards and reinvesting them back into the strategy to generate compound interest.
        </p>
        <p>
          Instead of you manually claiming rewards, paying gas fees, and reinvesting, our vaults do this automatically multiple times per day. This significantly increases your effective APY compared to manual compounding.
        </p>
        <p>
          The compounding frequency is optimized based on gas costs, TVL, and reward rates to ensure maximum efficiency.
        </p>
      </div>
    ),
  },
  {
    question: 'What are the different vault types?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          Margin Space offers several types of vaults:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li><strong>Single Asset Vaults:</strong> Deposit one token to earn yield (e.g., USDC, ETH)</li>
          <li><strong>LP Token Vaults:</strong> Deposit liquidity pool tokens from DEXs like Uniswap, SushiSwap, etc.</li>
          <li><strong>Stable Vaults:</strong> Low-risk vaults focused on stablecoin strategies</li>
          <li><strong>Leveraged Vaults:</strong> Advanced strategies using leverage to amplify returns (higher risk)</li>
          <li><strong>Multi-Strategy Vaults:</strong> Diversified across multiple protocols for balanced risk/reward</li>
        </ul>
      </div>
    ),
  },
  {
    question: 'How do I choose the right vault?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          Consider these factors when selecting a vault:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li><strong>APY:</strong> Higher APY often means higher risk</li>
          <li><strong>TVL (Total Value Locked):</strong> Higher TVL generally indicates more trust and stability</li>
          <li><strong>Risk Level:</strong> Check the strategy details and underlying protocols</li>
          <li><strong>Asset Type:</strong> Single asset vs LP tokens, stablecoins vs volatile assets</li>
          <li><strong>Platform Reputation:</strong> Established protocols (Aave, Curve) vs newer platforms</li>
        </ul>
        <p>
          Use our filters to narrow down vaults by asset type, platform, chain, and risk level. Always start with smaller deposits to test a strategy.
        </p>
      </div>
    ),
  },
  {
    question: 'Can I withdraw anytime?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          Yes! Standard vaults have no lock-up periods – you can deposit and withdraw at any time.
        </p>
        <p>
          However, please note:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Some promotional pools may have temporary lock-up periods for boosted rewards</li>
          <li>Gas fees apply for deposits and withdrawals</li>
          <li>Large withdrawals may experience slight slippage depending on the strategy</li>
        </ul>
      </div>
    ),
  },
];

// ==================== EARN & PROMOTIONAL POOLS ====================
const earnAndPoolsFaqConfig: IFaqDropdownItem[] = [
  {
    question: 'What are Promotional Pools?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          Promotional Pools are special time-limited opportunities where you can earn <strong>boosted rewards</strong> by depositing specific assets. These pools often feature:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Higher APY than standard vaults</li>
          <li>Additional token rewards (platform tokens, partner tokens)</li>
          <li>Early access to new strategies</li>
          <li>Special incentives for community members</li>
        </ul>
        <p>
          Check the "Earn" page regularly for new promotional opportunities.
        </p>
      </div>
    ),
  },
  {
    question: 'What is BOOST and how do I get it?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          BOOST is a multiplier mechanism that increases your rewards in certain vaults and promotional pools.
        </p>
        <p>
          You can activate BOOST by:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Staking platform governance tokens</li>
          <li>Holding specific NFTs or badges</li>
          <li>Participating in loyalty programs</li>
          <li>Early depositing in new pools</li>
        </ul>
        <p>
          Vaults with active BOOST are marked with an orange "BOOST" badge and typically offer 1.5x - 3x higher APY.
        </p>
      </div>
    ),
  },
  {
    question: 'How are rewards distributed?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          Rewards are distributed in two ways:
        </p>
        <p>
          <strong>1. Auto-compounded rewards:</strong> These are automatically harvested and reinvested into your position, increasing your vault share value. You realize these gains when you withdraw.
        </p>
        <p>
          <strong>2. Claimable rewards:</strong> In promotional pools, additional rewards (like bonus tokens) may accumulate separately and need to be claimed manually from your Dashboard.
        </p>
        <p>
          Check your Dashboard regularly to see your total earnings and any claimable rewards.
        </p>
      </div>
    ),
  },
];

// ==================== FEES & APY ====================
const feesAndApyFaqConfig: IFaqDropdownItem[] = [
  {
    question: "What's the difference between APR and APY?",
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          <strong>APR (Annual Percentage Rate)</strong> is the simple yearly return without compounding. It shows what you'd earn if rewards were paid out once per year.
        </p>
        <p>
          <strong>APY (Annual Percentage Yield)</strong> includes the effect of compounding. Since our vaults auto-compound multiple times per day, the effective APY is significantly higher than APR.
        </p>
        <p>
          <strong>Example:</strong> A vault with 100% APR compounded daily results in approximately 171% APY.
        </p>
        <p>
          All rates displayed on Margin Space are <strong>APY</strong> (already including compounding effects), showing you the real expected annual return.
        </p>
      </div>
    ),
  },
  {
    question: 'What fees does Margin Space charge?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          Margin Space has a transparent fee structure:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li><strong>Performance Fee:</strong> % of earned profits (only charged on gains)</li>
          <li><strong>Withdrawal Fee:</strong> % varies by vault, typically waived after 72 hours</li>
          <li><strong>No deposit or management fees at the moment</strong></li>
          <li><strong>The protocol reserves the right to introduce adaptive fees in specific scenarios, such as:</strong> <ul>
            <li> - covering cross-chain transaction costs</li>  
            <li> - maintaining infrastructure sustainability</li>
            <li> - implementing third-party protocol integrations (e.g., Axelar, LayerZero)</li>
          </ul></li>  
        </ul>
        <p>
          All displayed APYs are <strong>net of fees</strong> – what you see is what you get.
        </p>
        <p>
          Gas fees for blockchain transactions are separate and paid directly to network validators, not to Margin Space.
        </p>
      </div>
    ),
  },
  {
    question: 'Why do APY rates change?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          APY rates are dynamic and change based on several factors:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Changes in underlying protocol reward rates</li>
          <li>Total deposits in the vault (higher TVL can dilute rewards)</li>
          <li>Market conditions and trading volumes</li>
          <li>Token price fluctuations</li>
          <li>Network congestion affecting gas optimization</li>
        </ul>
        <p>
          We update APY calculations in real-time to reflect current rates. Historical APY data is available on each vault's detail page.
        </p>
      </div>
    ),
  },
  {
    question: 'Are there any hidden fees?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          No. Margin Space believes in complete transparency. All fees are clearly displayed:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Performance fees are shown in vault details</li>
          <li>Withdrawal fees are displayed before confirming transactions</li>
          <li>Gas estimates are shown for all transactions</li>
        </ul>
        <p>
          The APY you see already accounts for all platform fees. There are no hidden charges.
        </p>
      </div>
    ),
  },
];

// ==================== SECURITY & RISKS ====================
const securityAndRisksFaqConfig: IFaqDropdownItem[] = [
  {
    question: 'Is my money safe in Margin Space vaults?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          Margin Space takes security extremely seriously:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li><strong>Audited Smart Contracts:</strong> All vault contracts are audited by leading security firms</li>
          <li><strong>Non-Custodial:</strong> You maintain full control of your funds at all times</li>
          <li><strong>Battle-Tested Code:</strong> Our contracts are based on proven, time-tested protocols</li>
          <li><strong>Multi-sig Admin:</strong> Critical operations require multiple signatures</li>
          <li><strong>Bug Bounty Program:</strong> We reward security researchers for finding vulnerabilities</li>
        </ul>
        <p>
          However, DeFi carries inherent risks. Please read our security documentation and only invest what you can afford to lose.
        </p>
      </div>
    ),
  },
  {
    question: 'What are the risks?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          All DeFi investments carry risks. Common risks include:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li><strong>Smart Contract Risk:</strong> Bugs or exploits in vault or underlying protocol contracts</li>
          <li><strong>Impermanent Loss:</strong> For LP vaults, price divergence can reduce value</li>
          <li><strong>Market Risk:</strong> Asset price volatility affects vault value</li>
          <li><strong>Protocol Risk:</strong> Issues with underlying protocols (Aave, Curve, etc.)</li>
          <li><strong>Liquidation Risk:</strong> In leveraged strategies, extreme market moves can trigger liquidations</li>
          <li><strong>Regulatory Risk:</strong> Changes in crypto regulations</li>
        </ul>
        <p>
          Each vault displays a risk rating. Always DYOR (Do Your Own Research) and start with small amounts.
        </p>
      </div>
    ),
  },
  {
    question: 'Have Margin Space contracts been audited?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          Yes. Margin Space smart contracts have been audited by multiple independent security firms including:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>CertiK</li>
          <li>Quantstamp</li>
          <li>PeckShield</li>
        </ul>
        <p>
          Audit reports are publicly available on our documentation site. However, audits do not guarantee 100% security – always exercise caution and proper risk management.
        </p>
      </div>
    ),
  },
  {
    question: 'What is Impermanent Loss?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          Impermanent Loss (IL) occurs in liquidity pool (LP) vaults when the price ratio of paired assets changes compared to when you deposited.
        </p>
        <p>
          <strong>Example:</strong> You deposit ETH/USDC LP tokens when ETH = $2,000. If ETH rises to $3,000, the LP automatically rebalances, selling some ETH for USDC. You end up with less ETH than if you had simply held it.
        </p>
        <p>
          <strong>Mitigation:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Choose stablecoin pairs (USDC/USDT) to minimize IL</li>
          <li>Use single-asset vaults to avoid IL entirely</li>
          <li>High APY can offset impermanent loss over time</li>
        </ul>
        <p>
          IL is called "impermanent" because it only becomes permanent when you withdraw. If prices return to original ratios, the loss disappears.
        </p>
      </div>
    ),
  },
  {
    question: 'What happens if a vault strategy fails?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          Margin Space implements multiple safeguards:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li><strong>Emergency Pause:</strong> Admin multisig can pause deposits if issues detected</li>
          <li><strong>Automated Monitoring:</strong> 24/7 monitoring alerts team to anomalies</li>
          <li><strong>Diversified Strategies:</strong> Multiple protocols reduce single-point-of-failure risk</li>
          <li><strong>Insurance Fund:</strong> Reserved funds to cover potential losses in certain scenarios</li>
        </ul>
        <p>
          In case of a critical issue, the team will communicate immediately via Discord, Twitter, and the platform dashboard with recovery steps.
        </p>
      </div>
    ),
  },
];

// ==================== TECHNICAL & ADVANCED ====================
const technicalFaqConfig: IFaqDropdownItem[] = [
  {
    question: 'How do I add a custom token to my wallet?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          After depositing into a vault, you'll receive vault share tokens (e.g., marginSpaceETH, marginSpaceUSDC). To see them in your wallet:
        </p>
        <ol className="list-decimal list-inside space-y-1 ml-2">
          <li>Copy the vault token contract address (shown in vault details)</li>
          <li>Open your wallet (MetaMask, etc.)</li>
          <li>Click "Import Tokens" or "Add Custom Token"</li>
          <li>Paste the contract address</li>
          <li>Token symbol and decimals should auto-populate</li>
          <li>Click "Add Token"</li>
        </ol>
        <p>
          Your vault balance will now be visible in your wallet. The value automatically increases as rewards compound.
        </p>
      </div>
    ),
  },
  {
    question: 'What are vault share tokens?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          When you deposit assets into a vault, you receive vault share tokens (receipt tokens) that represent your portion of the vault's total holdings.
        </p>
        <p>
          As the vault earns and compounds rewards, the exchange rate of shares to underlying assets increases. When you withdraw, you burn your shares and receive back more of the underlying asset than you deposited.
        </p>
        <p>
          <strong>Example:</strong> Deposit 100 USDC, receive 95 marginSpaceUSDC shares. Over time, 95 marginSpaceUSDC might be worth 105 USDC due to compounded earnings.
        </p>
      </div>
    ),
  },
  {
    question: 'Can I transfer my vault tokens to another wallet?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          Yes! Vault share tokens are standard ERC-20 tokens and can be transferred like any other token.
        </p>
        <p>
          However, keep in mind:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Transferring shares transfers the underlying position and all accrued earnings</li>
          <li>This may have tax implications</li>
          <li>The receiving wallet will need to add the vault token to see the balance</li>
          <li>Some boosted positions may not transfer with the tokens</li>
        </ul>
      </div>
    ),
  },
  {
    question: 'What is TVL and why does it matter?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          <strong>TVL (Total Value Locked)</strong> is the total dollar value of all assets deposited in a vault or protocol.
        </p>
        <p>
          TVL matters because:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>Trust Indicator:</strong> Higher TVL suggests more users trust the vault</li>
          <li><strong>Liquidity:</strong> Larger vaults can handle bigger deposits/withdrawals smoothly</li>
          <li><strong>Reward Dilution:</strong> Sometimes very high TVL can reduce APY as rewards are shared among more users</li>
          <li><strong>Efficiency:</strong> Larger vaults can optimize gas costs better</li>
        </ul>
        <p>
          Generally, vaults with TVL between $1M - $50M offer a good balance of trust and reward rates.
        </p>
      </div>
    ),
  },
  {
    question: 'How often are rewards harvested and compounded?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          Harvest frequency varies by vault and is dynamically optimized based on:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Accumulated rewards (must exceed gas costs)</li>
          <li>Current gas prices (we wait for lower gas)</li>
          <li>Vault size (larger vaults compound more frequently)</li>
        </ul>
        <p>
          Typically, vaults are harvested <strong>1-4 times per day</strong>. You can see the last harvest time on each vault's detail page.
        </p>
        <p>
          Our keeper bots continuously monitor conditions and trigger harvests at optimal moments to maximize net returns.
        </p>
      </div>
    ),
  },
  {
    question: 'What happens during high gas fees?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          During high network congestion, Margin Space automatically adjusts:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li><strong>Harvest Delays:</strong> Waits for gas to drop before harvesting (avoids wasting profits on gas)</li>
          <li><strong>Batch Operations:</strong> Combines multiple actions in single transactions</li>
          <li><strong>Alternative Routes:</strong> Uses Layer 2 or alternative chains when possible</li>
        </ul>
        <p>
          For users, we recommend:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Use Layer 2 chains (Arbitrum, Optimism) for lower fees</li>
          <li>Deposit larger amounts to amortize gas costs</li>
          <li>Avoid transactions during peak hours (check gas trackers)</li>
        </ul>
      </div>
    ),
  },
];

// ==================== SUPPORT & COMMUNITY ====================
const supportFaqConfig: IFaqDropdownItem[] = [
  {
    question: 'How do I contact support?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          You can reach the Margin Space team through:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li><strong>Telegram:</strong> Official announcement channel and support group</li>
          <li><strong>Twitter:</strong> for updates and quick questions</li>
          <li><strong>Email:</strong> support@marginspace.io for detailed inquiries</li>
          <li><strong>Contact Form:</strong> Fill out the form on our Support page</li>
        </ul>
        <p>
          Community moderators and team members typically respond within a few hours. For urgent security issues, use our priority security email.
        </p>
      </div>
    ),
  },
  {
    question: 'Is there a mobile app?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          Currently, Margin Space is a web-based platform optimized for both desktop and mobile browsers.
        </p>
        <p>
          To use Margin Space on mobile:
        </p>
        <ol className="list-decimal list-inside space-y-1 ml-2">
          <li>Open your mobile Web3 wallet app (MetaMask, Trust Wallet, etc.)</li>
          <li>Navigate to the built-in browser</li>
          <li>Go to app.marginspace.com</li>
          <li>Connect your wallet and start using Margin Space</li>
        </ol>
        <p>
          A native mobile app is on our roadmap for 2025.
        </p>
      </div>
    ),
  },
  {
    question: 'Where can I see my transaction history?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          Your complete transaction history is available in your <strong>Dashboard</strong>:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>All deposits, withdrawals, and claims</li>
          <li>Timestamp and transaction hash</li>
          <li>Current and historical positions</li>
          <li>Total earnings across all vaults</li>
        </ul>
        <p>
          You can also view on-chain transaction details by clicking any transaction hash, which opens the blockchain explorer (Etherscan, etc.).
        </p>
      </div>
    ),
  },
  {
    question: 'Does Margin Space have a token?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          Information about potential governance tokens and tokenomics will be announced through official channels.
        </p>
        <p>
          <strong>⚠️ BEWARE OF SCAMS:</strong> Margin Space will never:
        </p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>DM you first on Discord or Telegram</li>
          <li>Ask for your seed phrase or private keys</li>
          <li>Ask you to send funds to "verify" your wallet</li>
          <li>Promise guaranteed returns or airdrops</li>
        </ul>
        <p>
          Always verify information on our official website and social media channels.
        </p>
      </div>
    ),
  },
  {
    question: 'How can I contribute to Margin Space?',
    answer: (
      <div className="flex w-full flex-col gap-4">
        <p>
          We welcome community contributions:
        </p>
        <ul className="list-disc list-inside space-y-2 ml-2">
          <li><strong>Strategy Proposals:</strong> Suggest new yield strategies in our governance forum</li>
          <li><strong>Bug Reports:</strong> Report bugs via GitHub or our bug bounty program</li>
          <li><strong>Documentation:</strong> Help improve our docs and tutorials</li>
          <li><strong>Community Support:</strong> Answer questions in Discord/Telegram</li>
          <li><strong>Development:</strong> Contribute code to our open-source repositories</li>
          <li><strong>Marketing:</strong> Create content, guides, and spread awareness</li>
        </ul>
        <p>
          Join our Discord to learn about current opportunities and how to get involved.
        </p>
      </div>
    ),
  },
];

export const faqConfig: IFaqList[] = [
  {
    title: 'Getting Started',
    items: gettingStartedFaqConfig,
  },
  {
    title: 'Vaults & Strategies',
    items: vaultsAndStrategiesFaqConfig,
  },
  {
    title: 'Earn & Promotional Pools',
    items: earnAndPoolsFaqConfig,
  },
  {
    title: 'Fees & APY',
    items: feesAndApyFaqConfig,
  },
  {
    title: 'Security & Risks',
    items: securityAndRisksFaqConfig,
  },
  {
    title: 'Technical & Advanced',
    items: technicalFaqConfig,
  },
  {
    title: 'Support & Community',
    items: supportFaqConfig,
  },
];
