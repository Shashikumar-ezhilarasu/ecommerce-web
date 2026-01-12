'use client';

import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { useCartStore } from '@/lib/cart-store';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items, router]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
