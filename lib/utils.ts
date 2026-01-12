import { formatEther, formatUnits } from 'ethers';

export function formatPrice(priceInWei: bigint, priceInTokens: bigint): string {
  const shmPrice = formatEther(priceInWei);
  const tokenPrice = formatUnits(priceInTokens, 18);
  
  const parts: string[] = [];
  
  if (priceInWei > 0n) {
    parts.push(`${parseFloat(shmPrice).toFixed(0)} SHM`);
  }
  
  if (priceInTokens > 0n) {
    parts.push(`${parseFloat(tokenPrice).toFixed(0)} USDT`);
  }
  
  return parts.join(' + ') || 'Free';
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
