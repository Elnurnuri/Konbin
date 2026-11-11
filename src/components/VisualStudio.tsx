import React, { useState } from 'react';
import { 
  Sparkles, 
  Tag, 
  ExternalLink, 
  CheckCircle2, 
  TrendingDown, 
  SlidersHorizontal,
  ChevronRight,
  Info,
  Maximize2,
  Heart,
  Share2
} from 'lucide-react';
import { CurrencyType, OutfitItem, OutfitLook } from '../types';
import { formatPrice, getBestOfferForItem, calculateOutfitSavings, calculateBestOverallOutfitTotal } from '../utils/pricing';

interface VisualStudioProps {
  currentLook: OutfitLook;
  allLooks: OutfitLook[];
  onSelectLook: (look: OutfitLook) => void;
  currency: CurrencyType;
  onSelectItem: (item: OutfitItem) => void;
  onGoToPrices: () => void;
  onCustomizeLook: () => void;
  onSaveLook: (look: OutfitLook) => void;
  isSaved: boolean;
}

export const VisualStudio: React.FC<VisualStudioProps> = ({
  currentLook,
  allLooks,
  onSelectLook,
  currency,
  onSelectItem,
  onGoToPrices,
  onCustomizeLook,
  onSaveLook,
  isSaved,
}) => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);

  // Separate apparel items (left column) and accessories (right column)
  const apparelItems = currentLook.items.filter((i) => 
    ['outerwear', 'top', 'bottom', 'shoes'].includes(i.category)
  );

  const accessoryItems = currentLook.items.filter((i) => 
    ['sunglasses', 'watch', 'wallet', 'bracelet', 'bag'].includes(i.category)
  );

  const totalMinPrice = calculateBestOverallOutfitTotal(currentLook.items);
  const savings = calculateOutfitSavings(currentLook.items);

  return (
    <div className="space-y-6">
      
      {/* Top Bar: Curated Lookbook Switcher & Quick Meta */}
      <div className="bg-[#1B1D22] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                {currentLook.styleCategory}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-800 text-zinc-300 border border-white/10">
                {currentLook.season}
              </span>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                <Sparkles className="w-3 h-3" />
                <span>%{currentLook.harmonyScore} Renk & Doku Uyumu</span>
              </div>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-wide">
              {currentLook.title}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              {currentLook.subtitle}
            </p>
          </div>

          {/* Quick Look Selector Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-xs text-zinc-400 font-medium whitespace-nowrap hidden sm:inline">
              Öne Çıkan Kombinler:
            </span>
            {allLooks.map((look, idx) => (
              <button
                key={look.id}
                onClick={() => onSelectLook(look)}
                className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  look.id === currentLook.id
                    ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md shadow-amber-500/20 font-bold scale-105'
                    : 'bg-zinc-800/80 text-zinc-300 border-white/10 hover:border-amber-400/40 hover:bg-zinc-700'
                }`}
                aria-label={`Kombin Seçimi ${idx + 1}: ${look.title}`}
              >
                #{idx + 1} {look.title.split('&')[0]}
              </button>
            ))}
          </div>

        </div>

        {/* Color Palette & Total Summary */}
        <div className="mt-4 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 font-medium">Kombin Renk Paleti:</span>
            <div className="flex items-center gap-1.5">
              {currentLook.palette.map((color, idx) => (
                <div
                  key={idx}
                  className="w-5 h-5 rounded-full border border-white/20 shadow-sm relative group cursor-pointer"
                  style={{ backgroundColor: color }}
                  title={color}
                >
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 text-[10px] bg-black/90 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                    {color}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-zinc-400 block">En Uygun Toplam Fiyat:</span>
              <span className="text-lg font-black text-emerald-400">
                {formatPrice(totalMinPrice, currency)}
              </span>
            </div>

            {savings.savingsAmount > 0 && (
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>%{savings.savingsPercentage} Tasarruf</span>
              </div>
            )}

            <button
              onClick={() => onSaveLook(currentLook)}
              className={`p-2 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  : 'bg-zinc-800 text-zinc-300 border-white/10 hover:text-white hover:bg-zinc-700'
              }`}
              aria-label="Kombini Kaydet"
              title="Kombini Kaydet"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Studio Stage - Editorial Dark Studio Design */}
      <div className="relative bg-gradient-to-b from-[#212429] via-[#1A1C20] to-[#141518] rounded-3xl border border-white/15 p-4 sm:p-6 shadow-2xl overflow-hidden">
        
        {/* Ambient Subtle Lighting Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT COLUMN: Apparel Items (Ceket, Tişört, Pantolon, Bot) */}
          <div className="lg:col-span-3 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs uppercase font-bold tracking-widest text-zinc-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                Giyim Parçaları ({apparelItems.length})
              </span>
              <span className="text-[10px] text-zinc-500">Tıkla & Karşılaştır</span>
            </div>

            <div className="space-y-3.5">
              {apparelItems.map((item) => {
                const bestOffer = getBestOfferForItem(item);
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className="group bg-[#282B30]/90 hover:bg-[#32363D] border border-white/10 hover:border-amber-400/50 rounded-2xl p-3.5 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-black/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-semibold tracking-wider text-amber-400/90 uppercase block mb-0.5">
                          {item.category === 'outerwear' ? 'Dış Giyim' :
                           item.category === 'top' ? 'Üst Giyim' :
                           item.category === 'bottom' ? 'Pantolon / Jean' : 'Ayakkabı / Bot'}
                        </span>
                        <h2 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                          {item.name}
                        </h2>
                      </div>
                      
                      <div 
                        className="w-4 h-4 rounded-full border border-white/30 shrink-0 mt-0.5 shadow-sm"
                        style={{ backgroundColor: item.colorHex }}
                        title={item.colorName}
                      />
                    </div>

                    <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
                      {item.material} • {item.fit || 'Regular Fit'}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-400">
                        {item.offers.length} Mağazada
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-emerald-400">
                          {bestOffer ? formatPrice(bestOffer.discountedPrice, currency) : 'Fiyat Yok'}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={onCustomizeLook}
              className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 hover:text-white flex items-center justify-center gap-2 transition-all"
              aria-label="Kombini Kişiselleştir"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>Parçaları Değiştir / Ekle</span>
            </button>
          </div>

          {/* CENTER COLUMN: Full Mannequin / Styled Look Photo */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md sm:max-w-lg aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-zinc-900 group">
              <img
                src={currentLook.mannequinImage}
                alt={currentLook.title}
                className="w-full h-full object-cover object-center group-hover:scale-[1.02] transition-transform duration-500"
              />

              {/* Top Gradient Badge */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-wider uppercase">
                  {currentLook.styleCategory}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500 text-zinc-950 text-xs font-extrabold shadow-md">
                  STÜDYO GÖRÜNÜMÜ
                </span>
              </div>

              {/* Interactive Hotspot Overlay (Illustrative Tag Pins for User Inspection) */}
              <div 
                onClick={() => {
                  const jacket = currentLook.items.find(i => i.category === 'outerwear') || currentLook.items[0];
                  if (jacket) onSelectItem(jacket);
                }}
                className="absolute top-[28%] left-[45%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                title="Ceketi İncele"
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-amber-400/30 animate-ping absolute" />
                  <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-white shadow-lg flex items-center justify-center hover:scale-125 transition-transform">
                    <span className="w-1.5 h-1.5 bg-zinc-950 rounded-full" />
                  </div>
                </div>
              </div>

              <div 
                onClick={() => {
                  const bottom = currentLook.items.find(i => i.category === 'bottom');
                  if (bottom) onSelectItem(bottom);
                }}
                className="absolute top-[62%] left-[48%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                title="Pantolonu İncele"
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-amber-400/30 animate-ping absolute" />
                  <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-white shadow-lg flex items-center justify-center hover:scale-125 transition-transform">
                    <span className="w-1.5 h-1.5 bg-zinc-950 rounded-full" />
                  </div>
                </div>
              </div>

              <div 
                onClick={() => {
                  const shoes = currentLook.items.find(i => i.category === 'shoes');
                  if (shoes) onSelectItem(shoes);
                }}
                className="absolute top-[88%] left-[52%] -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                title="Ayakkabıyı İncele"
              >
                <div className="relative flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-amber-400/30 animate-ping absolute" />
                  <div className="w-5 h-5 rounded-full bg-amber-500 border-2 border-white shadow-lg flex items-center justify-center hover:scale-125 transition-transform">
                    <span className="w-1.5 h-1.5 bg-zinc-950 rounded-full" />
                  </div>
                </div>
              </div>

              {/* Bottom Quick Look Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-zinc-300 block">Kombindeki Toplam Parça:</span>
                  <span className="text-sm font-bold text-white">{currentLook.items.length} Parça Tam Takım</span>
                </div>
                <button
                  onClick={onGoToPrices}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 active:scale-95 transition-all"
                  aria-label="Fiyatları Karşılaştır"
                >
                  <span>Fiyat Karşılaştır</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Accessories (Saat, Gözlük, Cüzdan, Bileklik, Çanta) */}
          <div className="lg:col-span-3 flex flex-col justify-between gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs uppercase font-bold tracking-widest text-zinc-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                Aksesuarlar ({accessoryItems.length})
              </span>
              <span className="text-[10px] text-zinc-500">Tamamlayıcı Parçalar</span>
            </div>

            <div className="space-y-3">
              {accessoryItems.map((item) => {
                const bestOffer = getBestOfferForItem(item);
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className="group bg-[#282B30]/90 hover:bg-[#32363D] border border-white/10 hover:border-amber-400/50 rounded-2xl p-3 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-black/50"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-semibold tracking-wider text-zinc-400 uppercase block mb-0.5">
                          {item.category === 'watch' ? 'Saat' :
                           item.category === 'sunglasses' ? 'Gözlük' :
                           item.category === 'wallet' ? 'Cüzdan / Kartlık' :
                           item.category === 'bag' ? 'Deri Çanta' : 'Bileklik'}
                        </span>
                        <h2 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                          {item.name}
                        </h2>
                      </div>
                      
                      <div 
                        className="w-3.5 h-3.5 rounded-full border border-white/30 shrink-0 mt-0.5 shadow-sm"
                        style={{ backgroundColor: item.colorHex }}
                        title={item.colorName}
                      />
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-zinc-500">
                        {item.offers.length > 0 ? `${item.offers.length} Mağaza` : 'Öneri'}
                      </span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-black text-emerald-400">
                          {bestOffer ? formatPrice(bestOffer.discountedPrice, currency) : 'İncele'}
                        </span>
                        <ChevronRight className="w-3 h-3 text-zinc-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3 text-xs text-amber-300">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Aksesuar Uyumu</span>
              </div>
              <p className="text-[11px] text-zinc-300 leading-relaxed">
                Tüm deri aksesuarlar (ayakkabı, saat kayışı, cüzdan ve çanta) aynı sıcak kahve alt tonunda eşleştirilmiştir.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Stylist Advice Panel */}
        <div className="mt-6 pt-5 border-t border-white/10 bg-[#17181B]/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 max-w-3xl">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                AI Stilist Görüşü & Kombinleme Notu
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed">
                "{currentLook.stylistAdvice}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={onGoToPrices}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-zinc-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              aria-label="Tüm Parçaların Fiyatlarını Karşılaştır"
            >
              <span>Mağaza Fiyatlarını Karşılaştır</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
