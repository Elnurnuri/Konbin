import React from 'react';
import { 
  Bookmark, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  DollarSign, 
  Share2, 
  Download,
  Shirt
} from 'lucide-react';
import { CurrencyType, OutfitLook } from '../types';
import { formatPrice, calculateBestOverallOutfitTotal } from '../utils/pricing';

interface SavedLooksViewProps {
  savedLooks: OutfitLook[];
  onSelectLook: (look: OutfitLook) => void;
  onRemoveSaved: (id: string) => void;
  currency: CurrencyType;
  onGoToMixer: () => void;
}

export const SavedLooksView: React.FC<SavedLooksViewProps> = ({
  savedLooks,
  onSelectLook,
  onRemoveSaved,
  currency,
  onGoToMixer,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#1B1D22] border border-white/10 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                Gardırop & Koleksiyonlarım
              </span>
              <span className="text-xs text-zinc-400">
                {savedLooks.length} Kombin Kayıtlı
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold font-serif text-white">
              Kayıtlı Kombinleriniz & Lookbook
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
              Beğendiğiniz veya kendiniz tasarladığınız kombinleri dilediğiniz zaman yeniden yükleyin ve fiyatlarını takip edin.
            </p>
          </div>

          <button
            onClick={onGoToMixer}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md"
          >
            Yeni Kombin Oluştur
          </button>
        </div>
      </div>

      {/* Grid of Saved Looks */}
      {savedLooks.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-white/10 rounded-3xl bg-[#1A1C20]/50">
          <Bookmark className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h2 className="text-base font-bold text-white">Henüz kaydedilmiş bir kombin yok</h2>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto mt-1 mb-4">
            Kombin Stüdyosu'nda beğendiğiniz kombinleri kalp simgesine basarak kaydedebilir veya Mikser'den kendi tarzınızı oluşturabilirsiniz.
          </p>
          <button
            onClick={onGoToMixer}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs shadow-md"
          >
            Kombin Mikserine Git
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedLooks.map((look) => {
            const minTotal = calculateBestOverallOutfitTotal(look.items);
            return (
              <div
                key={look.id}
                className="bg-[#1F2228] border border-white/10 hover:border-amber-400/40 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between group transition-all"
              >
                {/* Look Photo & Badges */}
                <div className="relative aspect-[4/3] bg-zinc-950 overflow-hidden">
                  <img
                    src={look.mannequinImage}
                    alt={look.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-white/10">
                      {look.styleCategory}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 backdrop-blur-md text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                      %{look.harmonyScore} Uyum
                    </span>
                  </div>

                  <button
                    onClick={() => onRemoveSaved(look.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-xl bg-black/60 hover:bg-rose-500/80 text-white transition-colors"
                    title="Kayıtlardan Çıkar"
                    aria-label="Kayıtlardan Çıkar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
                    {look.palette.slice(0, 4).map((c, i) => (
                      <div
                        key={i}
                        className="w-4 h-4 rounded-full border border-white/40 shadow-sm"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                      {look.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                      {look.subtitle}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
                      <Shirt className="w-3.5 h-3.5 text-amber-400" />
                      <span>{look.items.length} Parça İçeriyor</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-zinc-500 block">En İyi Toplam:</span>
                      <span className="text-sm font-black text-emerald-400">
                        {formatPrice(minTotal, currency)}
                      </span>
                    </div>

                    <button
                      onClick={() => onSelectLook(look)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95"
                    >
                      <span>Stüdyoda Aç</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
