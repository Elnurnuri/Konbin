import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatPrice,
  convertCurrency,
  getBestOfferForItem,
  calculateOutfitTotalByTier,
  calculateOutfitSavings,
  sortOffers,
} from './pricing';
import { OutfitItem, StoreOffer } from '../types';

const mockOffers: StoreOffer[] = [
  {
    id: 'o1',
    storeName: 'Zara',
    tier: 'optimum',
    originalPrice: 3200,
    discountedPrice: 2800,
    inStock: true,
    rating: 4.8,
    reviewCount: 120,
    freeShipping: true,
    shippingDays: '1-2 gün',
    productUrl: '#',
    brand: 'Zara',
  },
  {
    id: 'o2',
    storeName: 'Trendyol Man',
    tier: 'budget',
    originalPrice: 1800,
    discountedPrice: 1400,
    inStock: true,
    rating: 4.5,
    reviewCount: 340,
    freeShipping: true,
    shippingDays: '24 saatte',
    productUrl: '#',
    brand: 'Trendyol Man',
  },
  {
    id: 'o3',
    storeName: 'Beymen Club',
    tier: 'luxury',
    originalPrice: 8500,
    discountedPrice: 7200,
    inStock: true,
    rating: 4.9,
    reviewCount: 65,
    freeShipping: true,
    shippingDays: 'Aynı gün',
    productUrl: '#',
    brand: 'Beymen Club',
  },
];

const mockItem: OutfitItem = {
  id: 'item-1',
  name: 'Deri Aviator Ceket',
  category: 'outerwear',
  colorName: 'Kahverengi',
  colorHex: '#5A3825',
  material: 'Hakiki Deri',
  imageUrl: '/assets/sample.jpg',
  description: 'Premium deri bomber ceket',
  formalityLevel: 3,
  offers: mockOffers,
};

test('formatPrice formats Turkish Lira with symbol correctly', () => {
  const result = formatPrice(2500, 'TRY');
  assert.equal(result.includes('2.500'), true);
  assert.equal(result.includes('₺'), true);
});

test('convertCurrency converts accurately for USD and EUR', () => {
  const usd = convertCurrency(1000, 'USD');
  assert.equal(usd, 29);
  const eur = convertCurrency(1000, 'EUR');
  assert.equal(eur, 27);
});

test('getBestOfferForItem finds the lowest price offer', () => {
  const best = getBestOfferForItem(mockItem);
  assert.ok(best);
  assert.equal(best?.discountedPrice, 1400);
  assert.equal(best?.storeName, 'Trendyol Man');
});

test('calculateOutfitTotalByTier calculates correct tier sum', () => {
  const budgetTotal = calculateOutfitTotalByTier([mockItem], 'budget');
  assert.equal(budgetTotal, 1400);

  const optimumTotal = calculateOutfitTotalByTier([mockItem], 'optimum');
  assert.equal(optimumTotal, 2800);

  const luxuryTotal = calculateOutfitTotalByTier([mockItem], 'luxury');
  assert.equal(luxuryTotal, 7200);
});

test('calculateOutfitSavings detects difference between highest and lowest', () => {
  const savings = calculateOutfitSavings([mockItem]);
  assert.equal(savings.minTotal, 1400);
  assert.equal(savings.maxTotal, 7200);
  assert.equal(savings.savingsAmount, 5800);
  assert.equal(savings.savingsPercentage, Math.round((5800 / 7200) * 100));
});

test('sortOffers sorts properly by price ascending and discount descending', () => {
  const asc = sortOffers(mockOffers, 'price-asc');
  assert.equal(asc[0].discountedPrice, 1400);

  const desc = sortOffers(mockOffers, 'price-desc');
  assert.equal(desc[0].discountedPrice, 7200);
});
