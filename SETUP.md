# Quick Setup Guide

## 1. Install Dependencies

```bash
npm install
```

## 2. Get WalletConnect Project ID

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Create a new project
3. Copy your Project ID

## 3. Configure Environment

Create `.env.local` file:

```env
# Get this from WalletConnect Cloud
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Your deployed contract addresses
NEXT_PUBLIC_ECOMMERCE_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS=0x...
NEXT_PUBLIC_AGENT_WALLET_ADDRESS=0x...

# Network (1 = Ethereum Mainnet, 11155111 = Sepolia Testnet)
NEXT_PUBLIC_CHAIN_ID=11155111

# RPC URL (get from Alchemy, Infura, or public endpoints)
NEXT_PUBLIC_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
```

## 4. Deploy Smart Contract to Shardeum

### Get Shardeum Testnet Tokens

1. Visit [Shardeum Faucet](https://faucet-mezame.shardeum.org/)
2. Enter your wallet address
3. Receive test SHM tokens

### Deploy ECommerceStore Contract

```solidity
// Constructor parameters:
// _paymentToken: USDT or other ERC20 token address on Shardeum
// _platformFeePercent: Fee in basis points (e.g., 250 = 2.5%)

ECommerceStore(address _paymentToken, uint256 _platformFeePercent)
```

### Deploy using Remix

1. Open [Remix IDE](https://remix.ethereum.org/)
2. Paste your `ECommerceStore.sol` contract
3. Compile the contract
4. Deploy tab → Environment: "Injected Provider - MetaMask"
5. Make sure MetaMask is connected to **Shardeum EVM Testnet**
6. Deploy with constructor parameters
7. Copy deployed contract address
8. Update `.env.local` with the address

### Add Shardeum Network to MetaMask

- **Network Name**: Shardeum EVM Testnet
- **RPC URL**: https://api-mezame.shardeum.org
- **Chain ID**: 8119
- **Currency Symbol**: SHM
- **Block Explorer**: https://explorer-mezame.shardeum.org

## 5. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

## 6. Test the Application

1. Connect your wallet (MetaMask recommended)
2. Browse products
3. Add items to cart
4. Choose payment method:
   - **Your Wallet**: Direct payment from your connected wallet
   - **Agent Wallet**: Request an AI agent to pay (enter agent address)

## Common Issues

**"Please connect your wallet"**

- Click "Connect Wallet" button in header
- Approve connection in MetaMask

**"Transaction failed"**

- Make sure you're on the correct network (check CHAIN_ID)
- Ensure you have enough ETH for gas fees
- Verify contract addresses are correct

**Products not showing**

- The app shows demo products by default
- Deploy your contract and list products using the `listProduct` function
- Update contract address in `.env.local`

## Next Steps

- Deploy and verify your smart contract
- List real products on the blockchain
- Customize the UI to match your brand
- Add more features (order history, seller dashboard, etc.)

Enjoy building your decentralized e-commerce platform! 🚀
