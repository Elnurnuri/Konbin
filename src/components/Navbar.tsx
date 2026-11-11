import React from 'react';
import { 
  Sparkles, 
  Layers, 
  DollarSign, 
  Bookmark, 
  PlusCircle, 
  Shirt, 
  TrendingDown
} from 'lucide-react';
import { CurrencyType } from '../types';

interface NavbarProps {
  activeTab: 'studio' | 'mixer' | 'prices' | 'saved';
  setActiveTab: (tab: 'studio' | 'mixer' | 'prices' | 'saved') => void;
  currency: CurrencyType;
  setCurrency: (c: CurrencyType) => void;
  onOpenAiModal: () => void;
  savedLooksCount: number;
  totalSavingsAmount: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  onOpenAiModal,
  savedLooksCount,
  totalSavingsAmount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#16171A]/90 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand / Logo */}
        <div 
          onClick={() => setActiveTab('studio')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all">
            <div className="w-full h-full bg-[#1A1C20] rounded-[10px] flex items-center justify-center">
              <Shirt className="w-6 h-6 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif tracking-wider text-xl font-bold bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
                KOMBIN<span className="text-amber-400 font-sans font-black">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                PRO STYLIST
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 hidden sm:block">
              Akıllı Çoklu Parça Kombin & Fiyat Karşılaştırma Laboratuvarı
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 p-1 bg-black/40 border border-white/10 rounded-xl" aria-label="Ana Menü">
          <button
            onClick={() => setActiveTab('studio')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'studio'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-900/30'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
            aria-label="Kombin Stüdyosu Sekmesi"
          >
            <Shirt className="w-4 h-4" />
            <span className="hidden md:inline">Kombin Stüdyosu</span>
          </button>

          <button
            onClick={() => setActiveTab('mixer')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'mixer'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-900/30'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
            aria-label="Çoklu Ürün Ekle ve Karıştır Sekmesi"
          >
            <Layers className="w-4 h-4" />
            <span>Çoklu Ürün Ekle</span>
          </button>

          <button
            onClick={() => setActiveTab('prices')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'prices'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-md shadow-emerald-900/30'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
            aria-label="Fiyat Karşılaştırması Sekmesi"
          >
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Fiyat Karşılaştır</span>
            <span className="sm:hidden">Fiyatlar</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-500/30">
              Canlı
            </span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'saved'
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-900/30'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`}
            aria-label="Kayıtlı Kombinler Sekmesi"
          >
            <Bookmark className="w-4 h-4" />
            <span className="hidden lg:inline">Kayıtlılar</span>
            {savedLooksCount > 0 && (
              <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-amber-400/30">
                {savedLooksCount}
              </span>
            )}
          </button>
        </nav>

        {/* Currency & AI Actions */}
        <div className="flex items-center gap-2.5">
          {/* Currency Selector */}
          <div className="flex items-center bg-black/40 border border-white/10 rounded-lg p-0.5 text-xs font-medium">
            {(['TRY', 'USD', 'EUR'] as CurrencyType[]).map((c) => (
              <button
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-2 py-1 rounded transition-colors ${
                  currency === c
                    ? 'bg-zinc-700 text-white font-bold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
                aria-label={`Para Birimi ${c}`}
              >
                {c === 'TRY' ? '₺ TL' : c === 'USD' ? '$ USD' : '€ EUR'}
              </button>
            ))}
          </div>

          {/* AI Kombin Oluştur Trigger */}
          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all active:scale-95"
            aria-label="AI ile Kombin Üret"
          >
            <Sparkles className="w-4 h-4 fill-zinc-950" />
            <span className="hidden sm:inline">AI ile Kombin Üret</span>
            <span className="sm:hidden">AI</span>
          </button>
        </div>

      </div>
    </header>
  );
};
