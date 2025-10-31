# Netlify Environment Variables Setup

This document describes the environment variables that need to be configured in Netlify for the application to work correctly.

## RPC Endpoints (Infura)

Configure these environment variables in your Netlify dashboard under **Site settings > Environment variables**:

### Blockchain RPC Endpoints

```bash
NEXT_PUBLIC_RPC_BSC=https://bsc-mainnet.infura.io/v3/80792385aff54a83afe1368e2d719ec0
NEXT_PUBLIC_RPC_ARBITRUM=https://arbitrum-mainnet.infura.io/v3/80792385aff54a83afe1368e2d719ec0
NEXT_PUBLIC_RPC_OPTIMISM=https://optimism-mainnet.infura.io/v3/80792385aff54a83afe1368e2d719ec0
NEXT_PUBLIC_RPC_AVALANCHE=https://avalanche-mainnet.infura.io/v3/80792385aff54a83afe1368e2d719ec0
NEXT_PUBLIC_RPC_BASE=https://base-mainnet.infura.io/v3/80792385aff54a83afe1368e2d719ec0
```

### Other Environment Variables

```bash
# API URLs (update with your actual URLs)
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_ADMIN_API_URL=your_admin_api_url

# Admin Message
NEXT_PUBLIC_ADMIN_MESSAGE=uniswap.org

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id

# Optional: Polygon RPC (if needed)
NEXT_PUBLIC_RPC_POLYGON=https://polygon-mainnet.infura.io/v3/294b02c6ce6a4c4c92ff7e3e95beeb29

# Optional: Ethereum RPC (if needed)
NEXT_PUBLIC_RPC_ETHEREUM=https://mainnet.infura.io/v3/294b02c6ce6a4c4c92ff7e3e95beeb29
```

## How to Set Environment Variables in Netlify

1. Go to your Netlify dashboard
2. Select your site
3. Navigate to **Site settings > Environment variables**
4. Click **Add a variable** for each variable above
5. Enter the variable name and value
6. Save and redeploy your site

## Notes

- All variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Make sure to set these variables in Netlify before building/deploying
- The RPC endpoints use Infura with API key `80792385aff54a83afe1368e2d719ec0`
- You can override these default values if you have custom RPC endpoints

