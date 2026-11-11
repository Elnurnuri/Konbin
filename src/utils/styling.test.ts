import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateHarmonyScore, generateStyleAdvice } from './styling';
import { OutfitItem } from '../types';

const item1: OutfitItem = {
  id: 'top-1',
  name: 'Beyaz Supima Tişört',
  category: 'top',
  colorName: 'Beyaz',
  colorHex: '#FFFFFF',
  material: 'Supima Pamuk',
  imageUrl: '',
  description: '',
  formalityLevel: 2,
  offers: [],
};

const item2: OutfitItem = {
  id: 'bottom-1',
  name: 'Siyah Denim Pantolon',
  category: 'bottom',
  colorName: 'Siyah',
  colorHex: '#1A1A1A',
  material: 'Pamuk Denim',
  imageUrl: '',
  description: '',
  formalityLevel: 2,
  offers: [],
};

const item3: OutfitItem = {
  id: 'shoes-1',
  name: 'Deri Chelsea Bot',
  category: 'shoes',
  colorName: 'Kahverengi',
  colorHex: '#4A2E1B',
  material: 'Hakiki Deri',
  imageUrl: '',
  description: '',
  formalityLevel: 3,
  offers: [],
};

test('calculateHarmonyScore calculates high score for core set with close formality', () => {
  const score = calculateHarmonyScore([item1, item2, item3]);
  assert.ok(score >= 85, `Expected score >= 85, got ${score}`);
});

test('generateStyleAdvice detects leather and denim notes', () => {
  const result = generateStyleAdvice([item1, item2, item3]);
  assert.ok(result.advice.includes('Deri detaylar'));
  assert.equal(result.season, 'Sonbahar / Kış');
});
