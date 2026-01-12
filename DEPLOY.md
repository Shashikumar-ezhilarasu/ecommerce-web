# Deploy to Shardeum EVM Testnet

## Step 1: Setup MetaMask for Shardeum

Add Shardeum EVM Testnet to MetaMask:

```
Network Name: Shardeum EVM Testnet
RPC URL: https://api-mezame.shardeum.org
Chain ID: 8119
Currency Symbol: SHM
Block Explorer: https://explorer-mezame.shardeum.org
```

## Step 2: Get Test Tokens

1. Visit the [Shardeum Faucet](https://faucet-mezame.shardeum.org/)
2. Connect your wallet
3. Request test SHM tokens
4. Wait for transaction confirmation

## Step 3: Deploy ECommerceStore Contract

### Using Remix IDE

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Create new file: `ECommerceStore.sol`
3. Paste the contract code from `contracts/ECommerceStore.sol`
4. Compile:
   - Solidity Compiler: `0.8.19`
   - Click "Compile ECommerceStore.sol"
5. Deploy:

   - Environment: **Injected Provider - MetaMask**
   - Ensure MetaMask is on **Shardeum EVM Testnet**
   - Constructor Parameters:
     - `_paymentToken`: `0x0000000000000000000000000000000000000000` (or USDT address)
     - `_platformFeePercent`: `250` (2.5% fee)
   - Click "Deploy"
   - Confirm transaction in MetaMask

6. Copy deployed contract address
7. Verify on explorer: `https://explorer-mezame.shardeum.org`

## Step 4: Configure Environment

Update `.env.local`:

```env
NEXT_PUBLIC_ECOMMERCE_CONTRACT_ADDRESS=0xYourDeployedAddress
NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS=0x...  # Optional: USDT address
NEXT_PUBLIC_AGENT_WALLET_ADDRESS=0x...   # Optional: Agent wallet
NEXT_PUBLIC_CHAIN_ID=8119
NEXT_PUBLIC_RPC_URL=https://api-mezame.shardeum.org
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

## Step 5: List Sample Products

After deployment, call `listProduct` function with sample data:

```javascript
// Product 1: Classic Denim Jacket
title: "Classic Denim Jacket";
description: "Premium denim with vintage wash";
priceInWei: 100000000000000000000; // 100 SHM
priceInTokens: 50000000000000000000; // 50 USDT
stock: 25;

// Product 2: Designer Leather Boots
title: "Designer Leather Boots";
description: "Handcrafted Italian leather";
priceInWei: 300000000000000000000; // 300 SHM
priceInTokens: 150000000000000000000; // 150 USDT
stock: 15;
```

## Step 6: Run Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Testing Payments

### Test CREDFI Payment:

1. Browse products
2. Add items to cart
3. Go to checkout
4. Select "Pay using CREDFI"
5. Click "Pay using CREDFI"
6. Confirm transaction in MetaMask
7. Check transaction on Shardeum Explorer

### Verify on Explorer:

- View contract: `https://explorer-mezame.shardeum.org/address/YOUR_CONTRACT`
- View transactions: Check OrderPlaced events
- View balances: Check SHM distribution

## Troubleshooting

**Transaction Fails:**

- Ensure sufficient SHM balance for gas
- Check product stock availability
- Verify contract address is correct

**MetaMask Not Connecting:**

- Switch network to Shardeum EVM Testnet
- Clear cache and reload page
- Ensure Chain ID is 8119

**Products Not Showing:**

- List products using `listProduct` function
- Check contract address in .env.local
- Verify RPC URL is accessible

## Production Deployment

For mainnet deployment (when Shardeum launches):

1. Switch to Shardeum Mainnet
2. Update Chain ID and RPC URL
3. Deploy contract with real payment token
4. Set appropriate platform fees
5. Test thoroughly on testnet first

## Support

- Shardeum Docs: https://docs.shardeum.org/
- Explorer: https://explorer-mezame.shardeum.org
- Discord: https://discord.gg/shardeum
