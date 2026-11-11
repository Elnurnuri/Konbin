import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  RefreshCw, 
  Upload, 
  Search, 
  Filter, 
  SlidersHorizontal,
  Check,
  Tag,
  ArrowRight,
  Shirt,
  DollarSign
} from 'lucide-react';
import { CategoryType, CurrencyType, OutfitItem, OutfitLook, UserAddedItemInput } from '../types';
import { WARDROBE_CATALOG } from '../data/wardrobeCatalog';
import { CATEGORY_LABELS, CATEGORY_ORDER, calculateHarmonyScore, generateStyleAdvice } from '../utils/styling';
import { formatPrice, calculateBestOverallOutfitTotal, calculateOutfitSavings } from '../utils/pricing';

interface OutfitMixerProps {
  currentItems: OutfitItem[];
  onUpdateItems: (items: OutfitItem[]) => void;
  currency: CurrencyType;
  onGoToPrices: () => void;
  onSaveAsLook: (title: string, items: OutfitItem[]) => void;
}

export const OutfitMixer: React.FC<OutfitMixerProps> = ({
  currentItems,
  onUpdateItems,
  currency,
  onGoToPrices,
  onSaveAsLook,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [selectedSlotForCatalog, setSelectedSlotForCatalog] = useState<CategoryType | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [customLookTitle, setCustomLookTitle] = useState('Kişiselleştirilmiş AI Kombinim');

  // Custom user item form state
  const [customInput, setCustomInput] = useState<UserAddedItemInput>({
    name: '',
    category: 'top',
    colorName: 'Siyah',
    colorHex: '#1F2023',
    material: '%100 Pamuk',
    estimatedPrice: 1500,
  });

  const harmonyScore = calculateHarmonyScore(currentItems);
  const styleAnalysis = generateStyleAdvice(currentItems);
  const totalMinPrice = calculateBestOverallOutfitTotal(currentItems);
  const savings = calculateOutfitSavings(currentItems);

  // Remove an item
  const handleRemoveItem = (id: string) => {
    onUpdateItems(currentItems.filter((i) => i.id !== id));
  };

  // Add an item from catalog
  const handleAddItemFromCatalog = (item: OutfitItem) => {
    // If an item in the same category exists, replace it, otherwise append
    const existingIndex = currentItems.findIndex((i) => i.category === item.category);
    if (existingIndex >= 0) {
      const updated = [...currentItems];
      updated[existingIndex] = { ...item, id: `${item.id}-${Date.now()}` };
      onUpdateItems(updated);
    } else {
      onUpdateItems([...currentItems, { ...item, id: `${item.id}-${Date.now()}` }]);
    }
    setIsCatalogOpen(false);
    setSelectedSlotForCatalog(null);
  };

  // Add custom item
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.name.trim()) return;

    const newItem: OutfitItem = {
      id: `custom-${Date.now()}`,
      name: customInput.name,
      category: customInput.category,
      colorName: customInput.colorName,
      colorHex: customInput.colorHex,
      material: customInput.material,
      fit: 'Özel Kesim',
      imageUrl: customInput.imageUrl || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
      description: `${customInput.colorName} renkli özel eklenen parça`,
      formalityLevel: 3,
      customAdded: true,
      offers: [
        {
          id: `custom-offer-1`,
          storeName: 'Özel Seçim / Mağaza',
          tier: 'optimum',
          originalPrice: customInput.estimatedPrice * 1.2,
          discountedPrice: customInput.estimatedPrice,
          inStock: true,
          rating: 4.8,
          reviewCount: 45,
          freeShipping: true,
          shippingDays: '1-2 gün',
          productUrl: '#',
          brand: 'Kullanıcı Gardırobu',
          badge: 'Eklenen Parça',
        },
        {
          id: `custom-offer-2`,
          storeName: 'Trendyol Alternatifi',
          tier: 'budget',
          originalPrice: customInput.estimatedPrice,
          discountedPrice: Math.round(customInput.estimatedPrice * 0.75),
          inStock: true,
          rating: 4.5,
          reviewCount: 150,
          freeShipping: true,
          shippingDays: '24 saatte',
          productUrl: '#',
          brand: 'Ekonomik Muadil',
          badge: 'Bütçe Muadili',
        },
      ],
    };

    onUpdateItems([...currentItems, newItem]);
    setIsAddCustomOpen(false);
    setCustomInput({
      name: '',
      category: 'top',
      colorName: 'Siyah',
      colorHex: '#1F2023',
      material: '%100 Pamuk',
      estimatedPrice: 1500,
    });
  };

  // Trigger AI to autocomplete missing pieces
  const handleAiAutoComplete = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai/combine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: currentItems.map((i) => ({ name: i.name, category: i.category, color: i.colorName })),
          mood: 'smart-casual',
          prompt: 'Kullanıcının seçtiği bu parçalara en uyumlu ayakkabı, ceket ve aksesuarları ekleyerek kusursuz bir kombin oluştur.',
        }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        // Find missing categories from catalog to add
        const currentCats = new Set(currentItems.map((i) => i.category));
        const neededCategories: CategoryType[] = ['shoes', 'outerwear', 'watch', 'sunglasses'];
        const itemsToAdd: OutfitItem[] = [];

        for (const cat of neededCategories) {
          if (!currentCats.has(cat)) {
            const catalogItem = WARDROBE_CATALOG.find((ci) => ci.category === cat);
            if (catalogItem) {
              itemsToAdd.push({ ...catalogItem, id: `ai-suggested-${cat}-${Date.now()}` });
            }
          }
        }

        if (itemsToAdd.length > 0) {
          onUpdateItems([...currentItems, ...itemsToAdd]);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Filter catalog
  const filteredCatalog = WARDROBE_CATALOG.filter((item) => {
    const matchesCategory = 
      selectedCategoryFilter === 'all' 
        ? (!selectedSlotForCatalog || item.category === selectedSlotForCatalog) 
        : item.category === selectedCategoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.colorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header bar: Mixer Status, Actions & Harmony Score */}
      <div className="bg-[#1B1D22] border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Çoklu Parça Stüdyosu
              </span>
              <span className="text-xs text-zinc-400">
                {currentItems.length} Parça Seçili
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-white">
              Kombinini Kendin Yarat & Yapay Zeka ile Tamamla
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              Gardırobundan veya katalogdan parçalar ekle, renk ve doku uyumunu anında gör ve fiyatlarını karşılaştır.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => {
                setSelectedSlotForCatalog(null);
                setIsCatalogOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white text-xs font-semibold flex items-center gap-2 transition-all"
              aria-label="Katalogdan Parça Ekle"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Katalogdan Ekle</span>
            </button>

            <button
              onClick={() => setIsAddCustomOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-white text-xs font-semibold flex items-center gap-2 transition-all"
              aria-label="Özel Parça veya Fotoğraf Yükle"
            >
              <Upload className="w-4 h-4 text-amber-400" />
              <span>Fotoğraf / Özel Parça Ekle</span>
            </button>

            <button
              onClick={handleAiAutoComplete}
              disabled={isAiLoading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2 active:scale-95 transition-all disabled:opacity-50"
              aria-label="AI ile Kombini Tamamla"
            >
              <Sparkles className={`w-4 h-4 fill-zinc-950 ${isAiLoading ? 'animate-spin' : ''}`} />
              <span>{isAiLoading ? 'AI Tamamlıyor...' : 'AI ile Eksikleri Tamamla'}</span>
            </button>
          </div>
        </div>

        {/* Live Harmony Score & Total Cost Row */}
        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#24272D] rounded-xl p-3 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400 block">Renk & Stil Uyumu</span>
              <span className="text-sm font-bold text-white">{styleAnalysis.season}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-black text-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>%{harmonyScore} Uyum</span>
            </div>
          </div>

          <div className="bg-[#24272D] rounded-xl p-3 border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400 block">En Uygun Kombin Maliyeti</span>
              <span className="text-base font-black text-emerald-400">
                {formatPrice(totalMinPrice, currency)}
              </span>
            </div>
            {savings.savingsAmount > 0 && (
              <span className="text-xs font-bold text-zinc-400">
                {savings.savingsPercentage}% Tasarruf
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onGoToPrices}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
              aria-label="Fiyat Karşılaştırmasına Git"
            >
              <DollarSign className="w-4 h-4" />
              <span>Parçaların Fiyatlarını Karşılaştır</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Selected Items Grid */}
      <div className="bg-[#1C1E23] border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
            <Shirt className="w-4 h-4 text-amber-400" />
            Kombindeki Parçalar ({currentItems.length})
          </h2>
          <span className="text-xs text-zinc-400">
            Parça silmek için çöp kutusu simgesine tıklayın
          </span>
        </div>

        {currentItems.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-white/10 rounded-2xl">
            <Shirt className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">Henüz kombininde parça bulunmuyor</h3>
            <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 mb-4">
              Yukarıdaki butonları kullanarak katalogdan parça seçebilir, kendi fotoğrafını yükleyebilir veya hazır kombinleri inceleyebilirsin.
            </p>
            <button
              onClick={() => setIsCatalogOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md"
            >
              Katalogdan Parça Seç
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentItems.map((item) => {
              const bestOffer = item.offers?.[0];
              return (
                <div
                  key={item.id}
                  className="bg-[#25282E] border border-white/10 hover:border-amber-400/40 rounded-2xl p-4 flex flex-col justify-between group transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-800 text-amber-400 border border-white/5">
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-zinc-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Bu Parçayı Çıkar"
                        aria-label={`${item.name} parçasını çıkar`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-5 h-5 rounded-full border border-white/30 shrink-0 shadow-sm"
                        style={{ backgroundColor: item.colorHex }}
                        title={item.colorName}
                      />
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        {item.name}
                      </h4>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                      {item.material} • {item.colorName}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">En İyi Fiyat:</span>
                      <span className="text-xs font-black text-emerald-400">
                        {bestOffer ? formatPrice(bestOffer.discountedPrice, currency) : 'Fiyat Yok'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedSlotForCatalog(item.category);
                        setIsCatalogOpen(true);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[11px] font-medium border border-white/10 transition-colors"
                      aria-label={`${item.name} parçasını değiştir`}
                    >
                      Değiştir
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Style Analysis & Occasion Advice */}
      <div className="bg-[#1C1E23] border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Yapay Zeka Stil Analizi & Tavsiye
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed">
              "{styleAnalysis.advice}"
            </p>
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <span className="text-[11px] text-zinc-400 font-medium">Uyumlu Ortamlar:</span>
              {styleAnalysis.recommendedOccasions.map((occ, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-white/5"
                >
                  {occ}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={() => onSaveAsLook(customLookTitle, currentItems)}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold border border-white/10 transition-all"
            aria-label="Kombini Kaydet"
          >
            Kombini Koleksiyonuma Kaydet
          </button>
        </div>
      </div>

      {/* CATALOG MODAL */}
      {isCatalogOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1D1F24] border border-white/15 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Shirt className="w-5 h-5 text-amber-400" />
                  Katalogdan Parça Seç & Ekle
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Seçtiğiniz parça mevcut kombinle otomatik olarak eşleştirilir
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCatalogOpen(false);
                  setSelectedSlotForCatalog(null);
                }}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
                aria-label="Kapat"
              >
                ✕
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 border-b border-white/10 bg-[#17181C] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-amber-500 text-zinc-950'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  Tümü
                </button>
                {CATEGORY_ORDER.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedCategoryFilter === cat
                        ? 'bg-amber-500 text-zinc-950'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    {CATEGORY_LABELS[cat].split('/')[0]}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-60">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Parça ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Catalog Items Grid */}
            <div className="p-5 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCatalog.map((item) => {
                const bestOffer = item.offers?.[0];
                return (
                  <div
                    key={item.id}
                    onClick={() => handleAddItemFromCatalog(item)}
                    className="bg-[#262930] hover:bg-[#30343D] border border-white/10 hover:border-amber-400 rounded-2xl p-4 cursor-pointer transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-bold uppercase text-amber-400">
                          {CATEGORY_LABELS[item.category].split('/')[0]}
                        </span>
                        <div
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: item.colorHex }}
                          title={item.colorName}
                        />
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {item.material} • {item.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs font-black text-emerald-400">
                        {bestOffer ? formatPrice(bestOffer.discountedPrice, currency) : ''}
                      </span>
                      <button className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 group-hover:bg-amber-500 group-hover:text-zinc-950 font-bold text-xs transition-colors">
                        Kombine Ekle +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* ADD CUSTOM ITEM OR PHOTO MODAL */}
      {isAddCustomOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1D1F24] border border-white/15 rounded-3xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-amber-400" />
                  Kendi Parçanı / Fotoğrafını Ekle
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Gardırobundaki herhangi bir kıyafeti ekleyip fiyat alternatiflerini bul
                </p>
              </div>
              <button
                onClick={() => setIsAddCustomOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCustomItem} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Parça Adı:
                </label>
                <input
                  type="text"
                  required
                  placeholder="ör. Siyah Oversize Biker Deri Ceket"
                  value={customInput.name}
                  onChange={(e) => setCustomInput({ ...customInput, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Kategori:
                  </label>
                  <select
                    value={customInput.category}
                    onChange={(e) => setCustomInput({ ...customInput, category: e.target.value as CategoryType })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    {CATEGORY_ORDER.map((c) => (
                      <option key={c} value={c}>
                        {CATEGORY_LABELS[c]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Tahmini Fiyat (₺):
                  </label>
                  <input
                    type="number"
                    min={100}
                    value={customInput.estimatedPrice}
                    onChange={(e) => setCustomInput({ ...customInput, estimatedPrice: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Renk Adı:
                  </label>
                  <input
                    type="text"
                    placeholder="ör. Taba Kahve"
                    value={customInput.colorName}
                    onChange={(e) => setCustomInput({ ...customInput, colorName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Renk Seçimi:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customInput.colorHex}
                      onChange={(e) => setCustomInput({ ...customInput, colorHex: e.target.value })}
                      className="w-10 h-8 rounded-lg bg-zinc-900 border border-white/10 cursor-pointer"
                    />
                    <span className="text-xs text-zinc-400 font-mono">{customInput.colorHex}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Materyal / Kumaş:
                </label>
                <input
                  type="text"
                  placeholder="ör. Hakiki Deri, Yün Triko, vb."
                  value={customInput.material}
                  onChange={(e) => setCustomInput({ ...customInput, material: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustomOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md"
                >
                  Kombine Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
