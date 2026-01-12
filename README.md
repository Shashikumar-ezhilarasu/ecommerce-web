# E-Commerce DApp

A decentralized e-commerce platform with AI Agent Wallet integration built with Next.js, TypeScript, and Web3.

## Features

- 🛍️ **Product Browsing**: View products with pricing in ETH and tokens
- 🛒 **Shopping Cart**: Add/remove items with quantity management
- 💳 **Dual Payment Options**:
  - Pay with your connected wallet
  - Request an AI Agent Wallet to pay on your behalf
- 🔗 **Web3 Integration**: Built with wagmi, viem, and RainbowKit
- 🎨 **Modern UI**: Responsive design with Tailwind CSS

## Prerequisites

- Node.js 18+ installed
- MetaMask or another Web3 wallet
- Deployed ECommerceStore smart contract

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Update the following variables in `.env.local`:

```env
# Smart Contract Addresses
NEXT_PUBLIC_ECOMMERCE_CONTRACT_ADDRESS=0x... # Your deployed contract address
NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS=0x...      # ERC20 token address
NEXT_PUBLIC_AGENT_WALLET_ADDRESS=0x...       # Agent wallet address

# Network Configuration
NEXT_PUBLIC_CHAIN_ID=1                       # 1 for mainnet, 11155111 for Sepolia
NEXT_PUBLIC_RPC_URL=https://...              # Your RPC URL

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=...     # Get from https://cloud.walletconnect.com
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
ecomerce-web/
├── app/                      # Next.js app directory
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Home page (product listing)
│   ├── cart/                # Shopping cart page
│   └── checkout/            # Checkout page
├── components/
│   ├── layout/              # Header, Hero components
│   ├── products/            # Product grid and cards
│   ├── cart/                # Cart view and items
│   └── checkout/            # Checkout form with payment
├── lib/
│   ├── abi.ts               # Smart contract ABIs
│   ├── types.ts             # TypeScript interfaces
│   ├── cart-store.ts        # Zustand state management
│   ├── constants.ts         # App constants
│   └── utils.ts             # Helper functions
└── public/                  # Static assets
```

## Usage

### Shopping Flow

1. **Browse Products**: View available products on the home page
2. **Add to Cart**: Click "Add to Cart" on products you want to purchase
3. **Review Cart**: Click the cart icon to review items
4. **Checkout**: Proceed to checkout and choose payment method

### Payment Methods

#### Option 1: Pay with Your Wallet

- Standard Web3 payment flow
- Connect your wallet (MetaMask, etc.)
- Approve transaction in your wallet
- Payment is processed on-chain

#### Option 2: Request Agent to Pay

- Enter your Agent Wallet address
- Agent receives payment request
- Agent approves and executes payment
- Order is completed automatically

## Smart Contract Integration

The app interacts with your `ECommerceStore` contract:

- `listProduct`: Sellers can list new products
- `getProduct`: Fetch product details
- `purchaseWithAgentWallet`: Make purchase with ETH/tokens
- `requestPaymentFromWallet`: Request agent wallet payment
- `getUserOrders`: View order history

## Building for Production

```bash
npm run build
npm start
```

## Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **wagmi**: React hooks for Ethereum
- **viem**: TypeScript Ethereum library
- **RainbowKit**: Wallet connection UI
- **Zustand**: State management
- **ethers**: Ethereum utilities

## Customization

### Adding Real Products

Edit `components/products/ProductGrid.tsx` to fetch products from your deployed contract or database.

### Styling

Customize colors in `tailwind.config.ts`:

```ts
colors: {
  primary: {
    // Your brand colors
  }
}
```

### Payment Flow

Modify `components/checkout/CheckoutForm.tsx` to implement custom payment logic or batch purchases.

## Troubleshooting

### Wallet Not Connecting

- Ensure WalletConnect Project ID is set
- Check that you're on the correct network
- Clear browser cache and try again

### Transaction Failing

- Verify contract addresses are correct
- Ensure sufficient ETH/token balance
- Check gas settings in wallet

### Products Not Loading

- Confirm contract is deployed and accessible
- Check RPC URL is working
- Verify contract ABI matches deployed version

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
