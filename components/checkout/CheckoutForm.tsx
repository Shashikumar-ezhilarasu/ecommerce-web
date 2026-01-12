'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import { ECOMMERCE_STORE_ABI } from '@/lib/abi';
import { CONTRACT_ADDRESSES } from '@/lib/constants';
import { parseEther } from 'ethers';
import { Wallet, Bot, Loader2, CheckCircle2, Zap, CreditCard } from 'lucide-react';
import { PaymentMethod } from '@/lib/types';
import { useRouter } from 'next/navigation';

export function CheckoutForm() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.WALLET);
  const [agentWalletAddress, setAgentWalletAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successTxHash, setSuccessTxHash] = useState<string>('');
  const [payfiTxHash, setPayfiTxHash] = useState<string>('');

  const { writeContract, data: hash, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const { wei, tokens } = getTotalPrice();

  const handlePayment = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    if (items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    setIsProcessing(true);

    try {
      // For simplicity, purchasing first item
      // In production, you'd batch multiple purchases or implement a cart contract
      const firstItem = items[0];

      if (paymentMethod === PaymentMethod.CREDFI) {
        // CREDFI: Crypto credit payment
        writeContract({
          address: CONTRACT_ADDRESSES.ECOMMERCE_STORE as `0x${string}`,
          abi: ECOMMERCE_STORE_ABI,
          functionName: 'purchaseWithAgentWallet',
          args: [BigInt(firstItem.product.id), address],
          value: wei, // Send total cart value via CREDFI
        });
      } else if (paymentMethod === PaymentMethod.PAYFI) {
        // PayFi: Direct payment to ecommerce wallet
        writeContract({
          address: CONTRACT_ADDRESSES.ECOMMERCE_STORE as `0x${string}`,
          abi: ECOMMERCE_STORE_ABI,
          functionName: 'purchaseWithAgentWallet',
          args: [BigInt(firstItem.product.id), address],
          value: wei, // Send total cart value
        });
      } else if (paymentMethod === PaymentMethod.WALLET) {
        // Regular wallet payment
        writeContract({
          address: CONTRACT_ADDRESSES.ECOMMERCE_STORE as `0x${string}`,
          abi: ECOMMERCE_STORE_ABI,
          functionName: 'purchaseWithAgentWallet',
          args: [BigInt(firstItem.product.id), address],
          value: firstItem.product.priceInWei,
        });
      } else {
        // Agent wallet payment
        if (!agentWalletAddress) {
          alert('Please enter agent wallet address');
          setIsProcessing(false);
          return;
        }

        writeContract({
          address: CONTRACT_ADDRESSES.ECOMMERCE_STORE as `0x${string}`,
          abi: ECOMMERCE_STORE_ABI,
          functionName: 'requestPaymentFromWallet',
          args: [BigInt(firstItem.product.id), agentWalletAddress as `0x${string}`],
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  // Handle successful transaction
  if (isSuccess && hash && !successTxHash) {
    setSuccessTxHash(hash);
    clearCart();
    setTimeout(() => {
      router.push('/');
    }, 3000);
  }

  if (successTxHash) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-4">Your order has been placed.</p>
        <p className="text-sm text-gray-500 mb-6">
          Transaction: {successTxHash.substring(0, 10)}...{successTxHash.substring(successTxHash.length - 8)}
        </p>
        <p className="text-sm text-gray-500">Redirecting to home page...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {/* Payment Method Selection */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
          
          <div className="space-y-3">
            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ borderColor: paymentMethod === PaymentMethod.WALLET ? '#0ea5e9' : '#e5e7eb' }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={PaymentMethod.WALLET}
                checked={paymentMethod === PaymentMethod.WALLET}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="h-4 w-4 text-primary-600"
              />
              <Wallet className="h-6 w-6 ml-3 mr-2 text-primary-600" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Pay with Your Wallet</p>
                <p className="text-sm text-gray-600">Use your connected wallet to pay</p>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ borderColor: paymentMethod === PaymentMethod.AGENT ? '#0ea5e9' : '#e5e7eb' }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={PaymentMethod.AGENT}
                checked={paymentMethod === PaymentMethod.AGENT}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="h-4 w-4 text-primary-600"
              />
              <Bot className="h-6 w-6 ml-3 mr-2 text-purple-600" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Request Agent to Pay</p>
                <p className="text-sm text-gray-600">Let an AI agent wallet handle payment</p>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ borderColor: paymentMethod === PaymentMethod.PAYFI ? '#0ea5e9' : '#e5e7eb' }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={PaymentMethod.PAYFI}
                checked={paymentMethod === PaymentMethod.PAYFI}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="h-4 w-4 text-primary-600"
              />
              <Zap className="h-6 w-6 ml-3 mr-2 text-yellow-600" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Pay using PayFi</p>
                <p className="text-sm text-gray-600">Instant payment directly to ecommerce wallet</p>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              style={{ borderColor: paymentMethod === PaymentMethod.CREDFI ? '#0ea5e9' : '#e5e7eb' }}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={PaymentMethod.CREDFI}
                checked={paymentMethod === PaymentMethod.CREDFI}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="h-4 w-4 text-primary-600"
              />
              <CreditCard className="h-6 w-6 ml-3 mr-2 text-green-600" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Pay using CREDFI</p>
                <p className="text-sm text-gray-600">Secure crypto credit payment with instant approval</p>
              </div>
            </label>
          </div>

          {paymentMethod === PaymentMethod.AGENT && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Agent Wallet Address
              </label>
              <input
                type="text"
                value={agentWalletAddress}
                onChange={(e) => setAgentWalletAddress(e.target.value)}
                placeholder="0x..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="mt-2 text-sm text-gray-500">
                The agent wallet will be requested to authorize and complete the payment
              </p>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium text-gray-900">{item.product.title}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatPrice(
                    item.product.priceInWei * BigInt(item.quantity),
                    item.product.priceInTokens * BigInt(item.quantity)
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">
                {formatPrice(wei, tokens)}
              </span>
            </div>
            
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600">
                  {formatPrice(wei, tokens)}
                </span>
              </div>
            </div>
          </div>

          {!isConnected ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-yellow-800">
                Please connect your wallet to proceed with payment
              </p>
            </div>
          ) : null}

          <button
            onClick={handlePayment}
            disabled={!isConnected || isProcessing || isPending || isConfirming}
            className="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {paymentMethod === PaymentMethod.AGENT ? (
                  <>
                    <Bot className="h-5 w-5" />
                    Request Agent Payment
                  </>
                ) : paymentMethod === PaymentMethod.CREDFI ? (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Pay using CREDFI
                  </>
                ) : paymentMethod === PaymentMethod.PAYFI ? (
                  <>
                    <Zap className="h-5 w-5" />
                    Pay using PayFi
                  </>
                ) : (
                  <>
                    <Wallet className="h-5 w-5" />
                    Pay Now
                  </>
                )}
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 mt-4 text-center">
            Your transaction will be processed on the blockchain
          </p>
        </div>
      </div>
    </div>
  );
}
