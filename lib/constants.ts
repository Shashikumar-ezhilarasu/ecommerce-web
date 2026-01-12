export const CONTRACT_ADDRESSES = {
  ECOMMERCE_STORE: process.env.NEXT_PUBLIC_ECOMMERCE_CONTRACT_ADDRESS || '0x7912D2524bA63611430cf5461Fab62Fe56C3265E',
  PAYMENT_TOKEN: process.env.NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS || '',
  AGENT_WALLET: process.env.NEXT_PUBLIC_AGENT_WALLET_ADDRESS || '0x7912D2524bA63611430cf5461Fab62Fe56C3265E',
  AGENT_WALLET_FACTORY: process.env.NEXT_PUBLIC_AGENT_WALLET_FACTORY_ADDRESS || '',
} as const;

// Shardeum EVM Testnet Configuration
export const SHARDEUM_TESTNET = {
  id: 8119,
  name: 'Shardeum EVM Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Shardeum',
    symbol: 'SHM',
  },
  rpcUrls: {
    default: { http: ['https://api-mezame.shardeum.org'] },
    public: { http: ['https://api-mezame.shardeum.org'] },
  },
  blockExplorers: {
    default: { name: 'Shardeum Explorer', url: 'https://explorer-mezame.shardeum.org' },
  },
  testnet: true,
} as const;

export const NETWORK_CONFIG = {
  CHAIN_ID: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '8119'),
  RPC_URL: process.env.NEXT_PUBLIC_RPC_URL || 'https://api-mezame.shardeum.org',
} as const;

// Mock product images for fashion demo
export const PRODUCT_IMAGES: Record<number, string> = {
  1: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80', // Denim Jacket
  2: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80', // Leather Boots
  3: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80', // Hoodie
  4: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80', // Summer Dress
  5: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80', // White Sneakers
  6: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80', // Wool Coat
  7: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80', // Silk Scarf
  8: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80', // Blazer
  9: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80', // T-Shirts
  10: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&q=80', // Leather Bag
  11: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80', // Jeans
  12: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80', // Sweater
};
