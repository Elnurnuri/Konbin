export type CategoryType = 
  | 'outerwear' 
  | 'top' 
  | 'bottom' 
  | 'shoes' 
  | 'sunglasses' 
  | 'watch' 
  | 'wallet' 
  | 'bracelet' 
  | 'bag';

export type TierType = 'budget' | 'optimum' | 'luxury';

export type CurrencyType = 'TRY' | 'USD' | 'EUR';

export interface StoreOffer {
  id: string;
  storeName: string;
  storeLogo?: string;
  badge?: string; // e.g. "En Uygun", "Orijinal Ürün", "Aynı Gün Kargo"
  tier: TierType;
  originalPrice: number;
  discountedPrice: number;
  inStock: boolean;
  rating: number; // e.g. 4.8
  reviewCount: number;
  freeShipping: boolean;
  shippingDays: string; // e.g. "1-2 gün"
  productUrl: string;
  brand: string;
}

export interface OutfitItem {
  id: string;
  name: string;
  category: CategoryType;
  colorName: string;
  colorHex: string;
  material: string; // e.g. "Hakiki Deri", "Supima Pamuk", "%100 Ham Pamuk Denim"
  fit?: string; // e.g. "Slim Fit", "Straight Leg", "Regular Fit"
  imageUrl: string;
  description: string;
  formalityLevel: number; // 1 (casual) to 5 (formal)
  offers: StoreOffer[];
  customAdded?: boolean;
}

export interface OutfitLook {
  id: string;
  title: string;
  subtitle: string;
  styleCategory: 'Smart Casual' | 'Casual Weekend' | 'Vintage Denim' | 'Executive Casual' | 'Urban Minimal';
  season: 'Sonbahar / Kış' | 'İlkbahar / Yaz' | '4 Mevsim';
  harmonyScore: number; // 0 - 100
  aestheticDescription: string;
  stylistAdvice: string;
  mannequinImage: string; // The full look photograph from user attachments
  palette: string[]; // Color hexes
  items: OutfitItem[];
}

export interface UserAddedItemInput {
  name: string;
  category: CategoryType;
  colorName: string;
  colorHex: string;
  material: string;
  estimatedPrice: number;
  imageUrl?: string;
  storeName?: string;
}
