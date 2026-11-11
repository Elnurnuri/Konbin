import React from 'react';
import { 
  X, 
  ExternalLink, 
  Star, 
  Truck, 
  ShieldCheck, 
  Tag, 
  Sparkles,
  Store,
  Check
} from 'lucide-react';
import { CurrencyType, OutfitItem, StoreOffer } from '../types';
import { formatPrice, getBestOfferForItem } from '../utils/pricing';
import { CATEGORY_LABELS } from '../utils/styling';

interface ItemDetailDrawerProps {
  item: OutfitItem | null;
  onClose: () => void;
  currency: CurrencyType;
}

export const ItemDetailDrawer: React.FC<ItemDetailDrawerProps> = ({
  item,
  onClose,
  currency,
}) => {
  if (!item) return null;

  const bestOffer = getBestOfferForItem(item);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg bg-[#1D1F24] border-l border-white/10 h-full overflow-y-auto p-5 sm:p-6 shadow-2xl flex flex-col justify-between"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                {CATEGORY_LABELS[item.category] || item.category}
              </span>
              <h2 className="text-lg font-bold text-white mt-0.5">
                {item.name}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Color & Material Details */}
          <div className="mt-4 p-4 rounded-2xl bg-zinc-900 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Renk:</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">{item.colorName}</span>
                <div 
                  className="w-4 h-4 rounded-full border border-white/30" 
                  style={{ backgroundColor: item.colorHex }} 
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Materyal:</span>
              <span className="text-xs font-semibold text-white">{item.material}</span>
            </div>

            {item.fit && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Kalıp:</span>
                <span className="text-xs font-semibold text-white">{item.fit}</span>
              </div>
            )}

            <div className="pt-2 border-t border-white/5">
              <p className="text-xs text-zinc-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>

          {/* Store Offers Comparison List */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs uppercase font-bold tracking-wider text-zinc-400 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-emerald-400" />
                Mağaza Fiyat Karşılaştırması ({item.offers.length})
              </h3>
              {bestOffer && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  En Uygun: {formatPrice(bestOffer.discountedPrice, currency)}
                </span>
              )}
            </div>

            <div className="space-y-2.5">
              {item.offers.map((offer) => {
                const isBest = bestOffer && offer.id === bestOffer.id;
                const discount = Math.round(
                  ((offer.originalPrice - offer.discountedPrice) / (offer.originalPrice || 1)) * 100
                );

                return (
                  <div
                    key={offer.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                      isBest 
                        ? 'bg-emerald-950/20 border-emerald-500/40' 
                        : 'bg-[#25282F] border-white/5'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-white">
                          {offer.storeName}
                        </span>
                        {offer.badge && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            isBest ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-400'
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
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        {discount > 0 && (
                          <span className="text-[10px] text-zinc-500 line-through block">
                            {formatPrice(offer.originalPrice, currency)}
                          </span>
                        )}
                        <span className="text-sm font-black text-emerald-400">
                          {formatPrice(offer.discountedPrice, currency)}
                        </span>
                      </div>

                      <a
                        href={offer.productUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold border border-white/10 flex items-center gap-1 transition-all"
                      >
                        <span>İncele</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 mt-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
