'use client';

import { useReadContract } from 'wagmi';
import { ECOMMERCE_STORE_ABI } from '@/lib/abi';
import { CONTRACT_ADDRESSES, PRODUCT_IMAGES } from '@/lib/constants';
import { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { useEffect, useState } from 'react';

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Read total product count
  const { data: productCounter } = useReadContract({
    address: CONTRACT_ADDRESSES.ECOMMERCE_STORE as `0x${string}`,
    abi: ECOMMERCE_STORE_ABI,
    functionName: 'productCounter',
  });

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      
      // Always show demo products for frontend display
      const demoProducts: Product[] = [
        {
          id: 1,
          title: 'Classic Denim Jacket',
          description: 'Premium denim with vintage wash, perfect fit',
          priceInWei: BigInt('100000000000000000000'), // 100 SHM (~$50)
          priceInTokens: BigInt('50000000000000000000'), // 50 tokens
          seller: '0x0000000000000000000000000000000000000000',
          isActive: true,
          stock: 25,
          image: PRODUCT_IMAGES[1],
        },
        {
          id: 2,
          title: 'Designer Leather Boots',
          description: 'Handcrafted Italian leather ankle boots',
          priceInWei: BigInt('300000000000000000000'), // 300 SHM (~$150)
          priceInTokens: BigInt('150000000000000000000'), // 150 tokens
          seller: '0x0000000000000000000000000000000000000000',
          isActive: true,
          stock: 15,
          image: PRODUCT_IMAGES[2],
        },
        {
          id: 3,
          title: 'Oversized Hoodie',
          description: 'Soft cotton blend, streetwear style, unisex',
          priceInWei: BigInt('60000000000000000000'), // 60 SHM (~$30)
          priceInTokens: BigInt('30000000000000000000'), // 30 tokens
          seller: '0x0000000000000000000000000000000000000000',
          isActive: true,
          stock: 50,
          image: PRODUCT_IMAGES[3],
        },
        {
          id: 4,
          title: 'Floral Summer Dress',
          description: 'Light breathable fabric, perfect for summer',
          priceInWei: BigInt('80000000000000000000'), // 80 SHM (~$40)
          priceInTokens: BigInt('40000000000000000000'), // 40 tokens
          seller: '0x0000000000000000000000000000000000000000',
          isActive: true,
          stock: 30,
          image: PRODUCT_IMAGES[4],
        },
        {
          id: 5,
          title: 'Premium White Sneakers',
          description: 'Clean minimalist design, genuine leather',
          priceInWei: BigInt('180000000000000000000'), // 180 SHM (~$90)
          priceInTokens: BigInt('90000000000000000000'), // 90 tokens
          seller: '0x0000000000000000000000000000000000000000',
          isActive: true,
          stock: 40,
          image: PRODUCT_IMAGES[5],
        },
        {
          id: 6,
          title: 'Wool Blend Coat',
          description: 'Elegant long coat, perfect for winter',
          priceInWei: BigInt('400000000000000000000'), // 400 SHM (~$200)
          priceInTokens: BigInt('200000000000000000000'), // 200 tokens
          seller: '0x0000000000000000000000000000000000000000',
          isActive: true,
          stock: 20,
          image: PRODUCT_IMAGES[6],
        },
        {
          id: 7,
          title: 'Silk Scarf Set',
          description: 'Luxury silk scarves in 3 elegant patterns',
          priceInWei: BigInt('120000000000000000000'), // 120 SHM (~$60)
          priceInTokens: BigInt('60000000000000000000'), // 60 tokens
          seller: '0x0000000000000000000000000000000000000000',
          isActive: true,
          stock: 35,
          image: PRODUCT_IMAGES[7],
        },
        {
          id: 8,
          title: 'Slim Fit Blazer',
          description: 'Modern cut blazer for professional look',
          priceInWei: BigInt('250000000000000000000'), // 250 SHM (~$125)
          priceInTokens: BigInt('125000000000000000000'), // 125 tokens
          seller: '0x0000000000000000000000000000000000000000',
          isActive: true,
          stock: 18,
          image: PRODUCT_IMAGES[8],
        },
        {
          id: 9,
          title: 'Graphic T-Shirt Collection',
          description: 'Set of 3 premium cotton tees with unique prints',
          priceInWei: BigInt('90000000000000000000'), // 90 SHM (~$45)
          priceInTokens: BigInt('45000000000000000000'), // 45 tokens
          seller: '0x0000000000000000000000000000000000000000',
          isActive: true,
          stock: 60,
          image: PRODUCT_IMAGES[9],
        },
        {
          id: 10,
          title: 'Leather Crossbody Bag',
          description: 'Compact designer bag with adjustable strap',
          priceInWei: BigInt('200000000000000000000'), // 200 SHM (~$100)
          priceInTokens: BigInt('100000000000000000000'), // 100 tokens
          seller: '0x0000000000000000000000000000000000000000',
          isActive: true,
          stock: 22,
          image: PRODUCT_IMAGES[10],
        },
        {
          id: 11,
          title: 'High-Waisted Jeans',
          description: 'Stretch denim, flattering fit, multiple washes',
          priceInWei: BigInt('110000000000000000000'), // 110 SHM (~$55)
          priceInTokens: BigInt('55000000000000000000'), // 55 tokens
          seller: '0x0000000000000000000000000000000000000000',
          isActive: true,
          stock: 45,
          image: PRODUCT_IMAGES[11],
        },
        {
          id: 12,
          title: 'Cashmere Sweater',
          description: '100% pure cashmere, ultra-soft luxury knit',
          priceInWei: BigInt('350000000000000000000'), // 350 SHM (~$175)
          priceInTokens: BigInt('175000000000000000000'), // 175 tokens
          seller: '0x0000000000000000000000000000000000000000',
          isActive: true,
          stock: 12,
          image: PRODUCT_IMAGES[12],
        },
      ];
      
      setProducts(demoProducts);
      setIsLoading(false);
    };

    fetchProducts();
  }, [productCounter]);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        <p className="text-gray-500 text-lg mt-4">Loading fashion collection...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
        <p className="text-gray-600">{products.length} items available</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
