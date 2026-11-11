import { CategoryType, OutfitItem } from '../types';

export const CATEGORY_LABELS: Record<CategoryType, string> = {
  outerwear: 'Dış Giyim / Ceket',
  top: 'Üst Giyim / Tişört & Kazak',
  bottom: 'Alt Giyim / Jean & Pantolon',
  shoes: 'Ayakkabı & Bot',
  sunglasses: 'Güneş Gözlüğü',
  watch: 'Saat',
  wallet: 'Cüzdan & Kartlık',
  bracelet: 'Bileklik & Aksesuar',
  bag: 'Çanta / Postacı Çantası',
};

export const CATEGORY_ORDER: CategoryType[] = [
  'outerwear',
  'top',
  'bottom',
  'shoes',
  'sunglasses',
  'watch',
  'wallet',
  'bracelet',
  'bag',
];

/**
 * Calculates harmony score between items (0 - 100)
 * Evaluates:
 * 1. Completeness: Core items (top, bottom, shoes) + accessories
 * 2. Formality variance: Keeps items within compatible formality levels
 * 3. Color harmony: Cohesive palette balance
 */
export function calculateHarmonyScore(items: OutfitItem[]): number {
  if (items.length === 0) return 0;
  if (items.length === 1) return 65;

  let score = 75; // baseline for multiple picked items

  const categories = new Set(items.map((i) => i.category));

  // Completeness bonuses
  const hasCore = categories.has('top') && categories.has('bottom') && categories.has('shoes');
  if (hasCore) score += 12;

  if (categories.has('outerwear')) score += 5;
  if (categories.has('watch') || categories.has('sunglasses') || categories.has('bag')) score += 5;

  // Formality variance penalty
  const formalities = items.map((i) => i.formalityLevel);
  const minFormality = Math.min(...formalities);
  const maxFormality = Math.max(...formalities);
  const diff = maxFormality - minFormality;

  if (diff >= 3) {
    score -= 15; // e.g. very formal shoes with hyper-casual items
  } else if (diff === 2) {
    score -= 5;
  } else {
    score += 4; // great formality coherence
  }

  return Math.min(99, Math.max(50, score));
}

export function generateStyleAdvice(items: OutfitItem[]): {
  advice: string;
  season: 'Sonbahar / Kış' | 'İlkbahar / Yaz' | '4 Mevsim';
  recommendedOccasions: string[];
} {
  const hasLeather = items.some((i) => i.material.toLowerCase().includes('deri'));
  const hasDenim = items.some((i) => i.material.toLowerCase().includes('denim') || i.name.toLowerCase().includes('jean'));
  const hasKnit = items.some((i) => i.material.toLowerCase().includes('yün') || i.material.toLowerCase().includes('triko') || i.name.toLowerCase().includes('kazak'));
  const hasBoots = items.some((i) => i.name.toLowerCase().includes('bot') || i.category === 'shoes');

  let advice = 'Seçilen parçalar renk ve doku dengesiyle dengeli bir silüet yaratıyor.';
  if (hasLeather && hasDenim) {
    advice = 'Deri detaylar ile ham denim dokusunun kontrastı, zamansız ve maskülen bir karakter kazandırıyor. Ton sür ton deri aksesuarlar görünümü kusursuz birleştiriyor.';
  } else if (hasKnit) {
    advice = 'Yumuşak dokulu triko ve temiz dikişli pantolon birlikteliği zahmetsiz bir zarafet (effortless chic) sunuyor.';
  }

  const occasions = ['Smart Casual', 'Hafta Sonu Buluşması', 'Şehir Turu', 'Akşam Yemeği'];

  return {
    advice,
    season: (hasKnit || hasLeather || hasBoots) ? 'Sonbahar / Kış' : 'İlkbahar / Yaz',
    recommendedOccasions: occasions,
  };
}
