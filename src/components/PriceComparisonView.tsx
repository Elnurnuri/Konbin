import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingDown, 
  Check, 
  ExternalLink, 
  Bell, 
  Star, 
  Truck, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Store,
  Sparkles,
  ArrowUpDown,
  ShoppingBag,
  Info
} from 'lucide-react';
import { CurrencyType, OutfitItem, StoreOffer, TierType } from '../types';
import { formatPrice, calculateOutfitTotalByTier, calculateOutfitSavings, sortOffers, getBestOfferForItem } from '../utils/pricing';
import { CATEGORY_LABELS } from '../utils/styling';

interface PriceComparisonViewProps {
  items: OutfitItem[];
  currency: CurrencyType;
  onSelectLookTab?: () => void;
}

export const PriceComparisonView: React.FC<PriceComparisonViewProps> = ({
  items,
  currency,
  onSelectLookTab,
}) => {
  const [selectedTierFilter, setSelectedTierFilter] = useState<'all' | TierType>('all');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'rating' | 'discount'>('price-asc');
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [alarmModalItem, setAlarmModalItem] = useState<OutfitItem | null>(null);
  const [alarmSuccess, setAlarmSuccess] = useState(false);
  const [selectedStoreFilter, setSelectedStoreFilter] = useState<string>('all');

  const budgetTotal = calculateOutfitTotalByTier(items, 'budget');
  const optimumTotal = calculateOutfitTotalByTier(items, 'optimum');
  const luxuryTotal = calculateOutfitTotalByTier(items, 'luxury');
  const savings = calculateOutfitSavings(items);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSetAlarm = (e: React.FormEvent) => {
    e.preventDefault();
    setAlarmSuccess(true);
    setTimeout(() => {
      setAlarmSuccess(false);
      setAlarmModalItem(null);
    }, 1800);
  };

  // Collect unique store names across all offers
  const allStoreNames = Array.from(
    new Set(items.flatMap((i) => i.offers.map((o) => o.storeName)))
  );

  return (
    <div className="space-y-6">
      
      {/* Page Title & Context Header */}
      <div className="bg-[#1B1D22] border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />
                Mağazalar Arası Fiyat Karşılaştırma Merkezi
              </span>
              <span className="text-xs text-zinc-400">
                {items.length} Parça İçin {items.reduce((s, i) => s + i.offers.length, 0)} Teklif
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-white">
              Önerilen Parçaların Fiyat Karşılaştırması & Tasarruf Matrisi
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              Trendyol, Zara, Massimo Dutti, Beymen, Mango ve daha birçok mağazada en uygun fiyatları keşfedin.
            </p>
          </div>

          {/* Savings Highlight Badge */}
          {savings.savingsAmount > 0 && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-3.5 sm:text-right flex sm:flex-col items-center sm:items-end justify-between">
              <span className="text-xs text-zinc-400 font-medium">Toplam Tasarruf Fırsatı:</span>
              <div className="flex items-center gap-1.5 text-emerald-400 font-black text-lg sm:text-xl">
                <TrendingDown className="w-5 h-5" />
                <span>{formatPrice(savings.savingsAmount, currency)} (%{savings.savingsPercentage})</span>
              </div>
            </div>
          )}
        </div>

        {/* 3 Tier Comparison Cards (Ekonomik vs Optimum vs Lüks) */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3.5">
          
          {/* 1. Ekonomik Bütçe */}
          <div 
            onClick={() => setSelectedTierFilter('budget')}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${
              selectedTierFilter === 'budget'
                ? 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/40'
                : 'bg-[#23262C] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                Ekonomik & Fırsat
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-semibold border border-emerald-500/30">
                En Uygun
              </span>
            </div>
            <div className="text-2xl font-black text-white">
              {formatPrice(budgetTotal, currency)}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Trendyol Man, H&M, Defacto, Mavi alternatifleri ile maksimum bütçe dostu kombin.
            </p>
          </div>

          {/* 2. Optimum & Smart Choice */}
          <div 
            onClick={() => setSelectedTierFilter('optimum')}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${
              selectedTierFilter === 'optimum'
                ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950/40'
                : 'bg-[#23262C] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Optimum / Kalite Dengesi
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-semibold border border-amber-500/30">
                Stilist Tavsiyesi
              </span>
            </div>
            <div className="text-2xl font-black text-white">
              {formatPrice(optimumTotal, currency)}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Zara, Mango Man, Massimo Dutti parçaları ile ideal doku, kalıp ve malzeme performansı.
            </p>
          </div>

          {/* 3. Lüks & Premium */}
          <div 
            onClick={() => setSelectedTierFilter('luxury')}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${
              selectedTierFilter === 'luxury'
                ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-950/40'
                : 'bg-[#23262C] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400">
                Lüks & Zanaatkar Seçim
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-semibold border border-purple-500/30">
                Koleksiyonluk
              </span>
            </div>
            <div className="text-2xl font-black text-white">
              {formatPrice(luxuryTotal, currency)}
            </div>
            <p className="text-[11px] text-zinc-400 mt-1">
              Beymen Club, Network, Barbour, Red Wing ve saf merinos / kuzu derisi lüks dokumalar.
            </p>
          </div>

        </div>

        {/* Filter & Sorting Controls */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          
          {/* Tier Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <span className="text-xs text-zinc-400 font-medium mr-1 hidden sm:inline">
              Filtrele:
            </span>
            <button
              onClick={() => setSelectedTierFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTierFilter === 'all'
                  ? 'bg-white text-zinc-950 font-bold'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              Tüm Teklifler
            </button>
            <button
              onClick={() => setSelectedTierFilter('budget')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTierFilter === 'budget'
                  ? 'bg-emerald-500 text-zinc-950 font-bold'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              Yalnızca Ekonomik
            </button>
            <button
              onClick={() => setSelectedTierFilter('optimum')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTierFilter === 'optimum'
                  ? 'bg-amber-500 text-zinc-950 font-bold'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              Optimum / Smart Choice
            </button>
            <button
              onClick={() => setSelectedTierFilter('luxury')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedTierFilter === 'luxury'
                  ? 'bg-purple-500 text-white font-bold'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              Lüks Seçenekler
            </button>
          </div>

          {/* Sort Selection */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-zinc-900 border border-white/10 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-400"
            >
              <option value="price-asc">Fiyata Göre: En Düşük</option>
              <option value="price-desc">Fiyata Göre: En Yüksek</option>
              <option value="discount">İndirim Oranına Göre</option>
              <option value="rating">Mağaza Puanına Göre</option>
            </select>
          </div>

        </div>
      </div>

      {/* Item-by-Item Price Comparison Breakdown Cards */}
      <div className="space-y-4">
        {items.map((item) => {
          let visibleOffers = item.offers;
          if (selectedTierFilter !== 'all') {
            const filtered = visibleOffers.filter((o) => o.tier === selectedTierFilter);
            if (filtered.length > 0) visibleOffers = filtered;
          }
          const sortedOffers = sortOffers(visibleOffers, sortBy);
          const bestOffer = getBestOfferForItem(item);
          const isExpanded = expandedItems[item.id] !== false; // expanded by default

          return (
            <div
              key={item.id}
              className="bg-[#1C1E23] border border-white/10 rounded-2xl overflow-hidden shadow-xl transition-all"
            >
              {/* Item Header Banner */}
              <div
                onClick={() => toggleExpand(item.id)}
                className="p-4 sm:p-5 bg-gradient-to-r from-[#23262D] to-[#1C1E23] flex items-center justify-between gap-4 cursor-pointer hover:bg-[#2A2E35] transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-5 h-5 rounded-full border border-white/30 shrink-0 shadow-md"
                    style={{ backgroundColor: item.colorHex }}
                    title={item.colorName}
                  />

                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                        {CATEGORY_LABELS[item.category] || item.category}
                      </span>
                      <span className="text-zinc-500 text-xs">•</span>
                      <span className="text-xs text-zinc-400">{item.material}</span>
                    </div>
                    <h2 className="text-sm sm:text-base font-bold text-white">
                      {item.name}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block">En Düşük Fiyat:</span>
                    <span className="text-sm sm:text-base font-black text-emerald-400">
                      {bestOffer ? formatPrice(bestOffer.discountedPrice, currency) : 'Fiyat Yok'}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setAlarmModalItem(item);
                    }}
                    className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-amber-400 border border-white/10 transition-colors"
                    title="Fiyat Alarmı Kur"
                    aria-label={`${item.name} için fiyat alarmı kur`}
                  >
                    <Bell className="w-4 h-4" />
                  </button>

                  <div className="text-zinc-400 p-1">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Store Offers Table / List */}
              {isExpanded && (
                <div className="p-4 sm:p-5 pt-2 border-t border-white/5 space-y-2.5">
                  {sortedOffers.length === 0 ? (
                    <div className="text-center py-4 text-xs text-zinc-500">
                      Bu bütçe filtresi için teklif bulunamadı.
                    </div>
                  ) : (
                    sortedOffers.map((offer) => {
                      const isBestPrice = bestOffer && offer.id === bestOffer.id;
                      const discountPercent = Math.round(
                        ((offer.originalPrice - offer.discountedPrice) / (offer.originalPrice || 1)) * 100
                      );

                      return (
                        <div
                          key={offer.id}
                          className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                            isBestPrice
                              ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500'
                              : 'bg-[#25282F] border-white/5 hover:border-white/15'
                          }`}
                        >
                          {/* Store Info & Tier */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0 text-zinc-300 font-bold text-xs">
                              <Store className="w-5 h-5 text-zinc-400" />
                            </div>

                            <div>
                              <div className="flex items-center gap-2 mb-0.5">
                                <h3 className="text-xs sm:text-sm font-bold text-white">
                                  {offer.storeName}
                                </h3>
                                {offer.badge && (
                                  <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                                    isBestPrice 
                                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                      : 'bg-zinc-800 text-zinc-300 border-white/10'
                                  }`}>
                                    {offer.badge}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                                <span>{offer.brand}</span>
                                <span>•</span>
                                <div className="flex items-center gap-1 text-amber-400">
                                  <Star className="w-3 h-3 fill-amber-400" />
                                  <span>{offer.rating}</span>
                                  <span className="text-zinc-500">({offer.reviewCount})</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Shipping & Stock Badge */}
                          <div className="flex items-center gap-3 text-xs text-zinc-400">
                            {offer.freeShipping && (
                              <div className="flex items-center gap-1 text-emerald-400 font-medium">
                                <Truck className="w-3.5 h-3.5" />
                                <span>Ücretsiz Kargo</span>
                              </div>
                            )}
                            <span className="text-zinc-500 hidden md:inline">•</span>
                            <span className="text-zinc-400 hidden md:inline">
                              Kargo: {offer.shippingDays}
                            </span>
                          </div>

                          {/* Price & Action */}
                          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
                            <div className="text-right">
                              {discountPercent > 0 && (
                                <div className="flex items-center gap-1.5 justify-end">
                                  <span className="text-xs text-zinc-500 line-through">
                                    {formatPrice(offer.originalPrice, currency)}
                                  </span>
                                  <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.2 rounded">
                                    %{discountPercent} İndirim
                                  </span>
                                </div>
                              )}
                              <div className="text-base sm:text-lg font-black text-emerald-400">
                                {formatPrice(offer.discountedPrice, currency)}
                              </div>
                            </div>

                            <a
                              href={offer.productUrl}
                              target="_blank"
                              rel="noreferrer"
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md active:scale-95 ${
                                isBestPrice
                                  ? 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black'
                                  : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-white/10'
                              }`}
                              aria-label={`${offer.storeName} mağazasında incele`}
                            >
                              <span>Mağazaya Git</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Smart Stylist Budget Strategy Card */}
      <div className="bg-gradient-to-r from-[#21242B] to-[#1A1C21] border border-amber-500/30 rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Stilistten Akıllı Alışveriş Stratejisi
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed">
              "Kombinin odak noktası olan <strong className="text-white">Deri Ceket</strong> ve <strong className="text-white">Chelsea Botta</strong> dayanıklılık ve asil duruş için Optimum/Lüks katmanı (Massimo Dutti veya Beymen) tercih edin. <strong className="text-white">Beyaz tişört</strong> ve <strong className="text-white">siyah jean</strong> gibi temel parçalarda ise Ekonomik alternatifleri seçerek toplam bütçenizi %35 oranında hafifletebilirsiniz."
            </p>
          </div>
        </div>

        <button
          onClick={onSelectLookTab}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 whitespace-nowrap active:scale-95 transition-all"
        >
          Kombin Stüdyosuna Dön
        </button>
      </div>

      {/* PRICE ALERT MODAL */}
      {alarmModalItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1D1F24] border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                Fiyat Düşüş Alarmı Kur
              </h3>
              <button
                onClick={() => setAlarmModalItem(null)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {alarmSuccess ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Alarm Başarıyla Kuruldu!</h4>
                <p className="text-xs text-zinc-400">
                  {alarmModalItem.name} için fiyat düşünce e-posta ile bilgilendirileceksiniz.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSetAlarm} className="space-y-4">
                <div>
                  <span className="text-xs text-zinc-400 block mb-1">Takip Edilen Ürün:</span>
                  <div className="text-sm font-bold text-white bg-zinc-900 p-2.5 rounded-xl border border-white/10">
                    {alarmModalItem.name}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Hedef Fiyat ({currency}):
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Hedeflediğiniz indirimli fiyat"
                    defaultValue={Math.round((getBestOfferForItem(alarmModalItem)?.discountedPrice || 2000) * 0.85)}
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    E-posta Adresiniz:
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ornek@email.com"
                    className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setAlarmModalItem(null)}
                    className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs font-semibold hover:bg-zinc-700"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs shadow-md"
                  >
                    Alarmı Aktif Et
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
