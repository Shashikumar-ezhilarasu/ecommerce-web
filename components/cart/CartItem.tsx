'use client';

import { CartItem as CartItemType } from '@/lib/types';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const { product, quantity } = item;
  const totalWei = product.priceInWei * BigInt(quantity);
  const totalTokens = product.priceInTokens * BigInt(quantity);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex gap-4">
      <div className="relative h-24 w-24 flex-shrink-0 bg-gray-200 rounded-md overflow-hidden">
        {product.image && (
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
            unoptimized
          />
        )}
      </div>

      <div className="flex-1">
        <div className="flex justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{product.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{product.description}</p>
            <p className="text-sm font-medium text-primary-600">
              {formatPrice(product.priceInWei, product.priceInTokens)} each
            </p>
          </div>

          <button
            onClick={() => removeItem(product.id)}
            className="text-red-500 hover:text-red-700 h-fit"
            aria-label="Remove item"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => updateQuantity(product.id, quantity - 1)}
              className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            
            <span className="font-medium text-gray-900 w-8 text-center">
              {quantity}
            </span>
            
            <button
              onClick={() => updateQuantity(product.id, quantity + 1)}
              disabled={quantity >= product.stock}
              className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="text-right">
            <p className="font-bold text-gray-900">
              {formatPrice(totalWei, totalTokens)}
            </p>
            {quantity > 1 && (
              <p className="text-xs text-gray-500">
                {quantity} × {formatPrice(product.priceInWei, product.priceInTokens)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
