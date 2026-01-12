export interface Product {
  id: number;
  title: string;
  description: string;
  priceInWei: bigint;
  priceInTokens: bigint;
  seller: string;
  isActive: boolean;
  stock: number;
  image?: string; // Frontend-only field for display
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  orderId: number;
  productId: number;
  buyer: string;
  agentWallet: string;
  paidInWei: bigint;
  paidInTokens: bigint;
  timestamp: number;
  fulfilled: boolean;
}

export enum PaymentMethod {
  WALLET = 'wallet',
  AGENT = 'agent',
  PAYFI = 'payfi',
  CREDFI = 'credfi',
}
