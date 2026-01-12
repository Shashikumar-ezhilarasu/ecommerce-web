export const ECOMMERCE_STORE_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_paymentToken", "type": "address" },
      { "internalType": "uint256", "name": "_platformFeePercent", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "orderId", "type": "uint256" },
      { "indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" },
      { "indexed": false, "internalType": "address", "name": "agentWallet", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "paidInWei", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "paidInTokens", "type": "uint256" }
    ],
    "name": "OrderPlaced",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "productId", "type": "uint256" },
      { "indexed": false, "internalType": "string", "name": "title", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "priceInWei", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "priceInTokens", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "seller", "type": "address" }
    ],
    "name": "ProductListed",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_productId", "type": "uint256" }
    ],
    "name": "getProduct",
    "outputs": [
      { "internalType": "uint256", "name": "id", "type": "uint256" },
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "string", "name": "description", "type": "string" },
      { "internalType": "uint256", "name": "priceInWei", "type": "uint256" },
      { "internalType": "uint256", "name": "priceInTokens", "type": "uint256" },
      { "internalType": "address", "name": "seller", "type": "address" },
      { "internalType": "bool", "name": "isActive", "type": "bool" },
      { "internalType": "uint256", "name": "stock", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_title", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" },
      { "internalType": "uint256", "name": "_priceInWei", "type": "uint256" },
      { "internalType": "uint256", "name": "_priceInTokens", "type": "uint256" },
      { "internalType": "uint256", "name": "_stock", "type": "uint256" }
    ],
    "name": "listProduct",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_productId", "type": "uint256" },
      { "internalType": "address", "name": "_agentWallet", "type": "address" }
    ],
    "name": "purchaseWithAgentWallet",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_productId", "type": "uint256" },
      { "internalType": "address", "name": "_agentWallet", "type": "address" }
    ],
    "name": "requestPaymentFromWallet",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "productCounter",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "_user", "type": "address" }],
    "name": "getUserOrders",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_orderId", "type": "uint256" }],
    "name": "getOrder",
    "outputs": [
      { "internalType": "uint256", "name": "orderId", "type": "uint256" },
      { "internalType": "uint256", "name": "productId", "type": "uint256" },
      { "internalType": "address", "name": "buyer", "type": "address" },
      { "internalType": "address", "name": "agentWallet", "type": "address" },
      { "internalType": "uint256", "name": "paidInWei", "type": "uint256" },
      { "internalType": "uint256", "name": "paidInTokens", "type": "uint256" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "internalType": "bool", "name": "fulfilled", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const AGENT_WALLET_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "target", "type": "address" },
      { "internalType": "uint256", "name": "value", "type": "uint256" },
      { "internalType": "bytes", "name": "data", "type": "bytes" }
    ],
    "name": "executeAction",
    "outputs": [{ "internalType": "bytes", "name": "", "type": "bytes" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;
