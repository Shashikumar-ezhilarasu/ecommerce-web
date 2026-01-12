'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useCartStore } from '@/lib/cart-store';

export function Header() {
  const totalItems = useCartStore((state: any) => state.getTotalItems());

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">�</span>
            <span className="text-xl font-bold text-gray-900">Fashion Store</span>
          </Link>

          <nav className="flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Shop
            </Link>
            
            <Link
              href="/cart"
              className="relative text-gray-700 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <ConnectButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
