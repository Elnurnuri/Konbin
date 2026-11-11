import { CurrencyType, OutfitItem, StoreOffer, TierType } from '../types';

// Exchange rates relative to TRY
const RATES: Record<CurrencyType, number> = {
  TRY: 1,
  USD: 0.029, // 1 TRY ~ 0.029 USD
  EUR: 0.027, // 1 TRY ~ 0.027 EUR
};

const SYMBOLS: Record<CurrencyType, string> = {
  TRY: '₺',
  USD: '$',
  EUR: '€',
};

export function convertCurrency(amountInTRY: number, targetCurrency: CurrencyType): number {
  if (targetCurrency === 'TRY') return amountInTRY;
  const rate = RATES[targetCurrency] || 1;
  return Math.round(amountInTRY * rate);
}

export function formatPrice(amountInTRY: number, currency: CurrencyType = 'TRY'): string {
  const converted = convertCurrency(amountInTRY, currency);
  const symbol = SYMBOLS[currency] || '₺';

  if (currency === 'TRY') {
    return `${symbol}${converted.toLocaleString('tr-TR')}`;
  } else if (currency === 'USD') {
    return `$${converted.toLocaleString('en-US')}`;
  } else {
    return `€${converted.toLocaleString('de-DE')}`;
  }
}

export function getBestOfferForItem(item: OutfitItem): StoreOffer | null {
  if (!item.offers || item.offers.length === 0) return null;
  return [...item.offers].sort((a, b) => a.discountedPrice - b.discountedPrice)[0];
}

export function getBestOfferByTier(item: OutfitItem, tier: TierType): StoreOffer | null {
  if (!item.offers || item.offers.length === 0) return null;
  const tierOffers = item.offers.filter((o) => o.tier === tier);
  if (tierOffers.length === 0) {
    return getBestOfferForItem(item);
  }
  return [...tierOffers].sort((a, b) => a.discountedPrice - b.discountedPrice)[0];
}

export function calculateOutfitTotalByTier(items: OutfitItem[], tier: TierType): number {
  return items.reduce((sum, item) => {
    const bestTierOffer = getBestOfferByTier(item, tier);
    return sum + (bestTierOffer ? bestTierOffer.discountedPrice : 0);
  }, 0);
}

export function calculateBestOverallOutfitTotal(items: OutfitItem[]): number {
  return items.reduce((sum, item) => {
    const best = getBestOfferForItem(item);
    return sum + (best ? best.discountedPrice : 0);
  }, 0);
}

export function calculateOutfitSavings(items: OutfitItem[]): {
  maxTotal: number;
  minTotal: number;
  savingsAmount: number;
  savingsPercentage: number;
} {
  let minTotal = 0;
  let maxTotal = 0;

  for (const item of items) {
    if (!item.offers || item.offers.length === 0) continue;
    const sorted = [...item.offers].sort((a, b) => a.discountedPrice - b.discountedPrice);
    minTotal += sorted[0].discountedPrice;
    maxTotal += sorted[sorted.length - 1].discountedPrice;
  }

  const savingsAmount = Math.max(0, maxTotal - minTotal);
  const savingsPercentage = maxTotal > 0 ? Math.round((savingsAmount / maxTotal) * 100) : 0;

  return {
    maxTotal,
    minTotal,
    savingsAmount,
    savingsPercentage,
  };
}

export function sortOffers(
  offers: StoreOffer[],
  sortBy: 'price-asc' | 'price-desc' | 'rating' | 'discount'
): StoreOffer[] {
  return [...offers].sort((a, b) => {
    if (sortBy === 'price-asc') {
      return a.discountedPrice - b.discountedPrice;
    }
    if (sortBy === 'price-desc') {
      return b.discountedPrice - a.discountedPrice;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    if (sortBy === 'discount') {
      const discountA = ((a.originalPrice - a.discountedPrice) / (a.originalPrice || 1)) * 100;
      const discountB = ((b.originalPrice - b.discountedPrice) / (b.originalPrice || 1)) * 100;
      return discountB - discountA;
    }
    return 0;
  });
}
