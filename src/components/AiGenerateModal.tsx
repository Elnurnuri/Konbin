import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Compass, 
  Tag, 
  DollarSign, 
  Send,
  Loader2,
  Check
} from 'lucide-react';
import { OutfitItem, OutfitLook } from '../types';
import { INITIAL_OUTFITS } from '../data/outfits';
import confetti from 'canvas-confetti';

interface AiGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyNewLook: (look: OutfitLook) => void;
}

export const AiGenerateModal: React.FC<AiGenerateModalProps> = ({
  isOpen,
  onClose,
  onApplyNewLook,
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('Smart Casual');
  const [selectedBudget, setSelectedBudget] = useState<'budget' | 'optimum' | 'luxury'>('optimum');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    'Sonbahar için kahverengi deri ceketli ve chelsea botlu şık bir hafta sonu kombini',
    'Ofis ve akşam yemeğine uygun koyu lacivert palto ve bordo trikolu smart casual stil',
    'Rahat pastel hoodie, toprak tonlu denim ve siyah deri sneakerlı modern sokak modası',
    'Vintage denim ceket, merinos yünü siyah kazak ve kum beji süet bot uyumu',
  ];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/combine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt || 'Kullanıcı için en uyumlu modern kombini hazırla.',
          occasion: selectedOccasion,
          budget: selectedBudget,
        }),
      });

      const data = await response.json();
      
      // Select best base template look from our 5 curated photos to pair with AI styling
      let baseLook = INITIAL_OUTFITS[0];
      if (prompt.toLowerCase().includes('denim') || prompt.toLowerCase().includes('mavi')) {
        baseLook = INITIAL_OUTFITS[2];
      } else if (prompt.toLowerCase().includes('bordo') || prompt.toLowerCase().includes('lacivert') || prompt.toLowerCase().includes('ofis')) {
        baseLook = INITIAL_OUTFITS[3];
      } else if (prompt.toLowerCase().includes('hoodie') || prompt.toLowerCase().includes('sokak') || prompt.toLowerCase().includes('sneaker')) {
        baseLook = INITIAL_OUTFITS[4];
      } else if (prompt.toLowerCase().includes('kiremit') || prompt.toLowerCase().includes('henley') || prompt.toLowerCase().includes('hafta sonu')) {
        baseLook = INITIAL_OUTFITS[1];
      }

      const generatedLook: OutfitLook = {
        ...baseLook,
        id: `ai-gen-${Date.now()}`,
        title: data?.data?.title || `${selectedOccasion} AI Özel Kombini`,
        stylistAdvice: data?.data?.stylistAdvice || baseLook.stylistAdvice,
        harmonyScore: data?.data?.harmonyScore || 97,
        styleCategory: selectedOccasion as any,
      };

      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (err) {}

      onApplyNewLook(generatedLook);
      onClose();
    } catch (err) {
      console.error(err);
      // Fallback
      onApplyNewLook(INITIAL_OUTFITS[0]);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#1D1F24] border border-white/15 rounded-3xl max-w-xl w-full p-6 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Yapay Zeka ile Kombin Oluştur
              </h2>
              <p className="text-xs text-zinc-400">
                Giyinmek istediğin ortamı veya parçaları anlat, Gemini API stilini yaratsın
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleGenerate} className="mt-5 space-y-4">
          
          {/* Prompt Textarea */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
              Stil İsteğinizi Belirtin:
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="ör. Yarın akşamki şık akşam yemeği için deri ceketli, sıcak tonlu ve bütçe dostu parçalardan oluşan bir kombin hazırla..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Quick Suggestion Pills */}
          <div>
            <span className="text-[11px] text-zinc-400 block mb-1.5">
              Örnek İstekler:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(qp)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-[11px] border border-white/5 text-left transition-colors"
                >
                  {qp.slice(0, 42)}...
                </button>
              ))}
            </div>
          </div>

          {/* Occasion / Ortam Seçimi */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
              Ortam / Stil Türü:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                'Smart Casual',
                'Casual Weekend',
                'Executive / İş',
                'Sokak Modası',
                'Akşam Yemeği',
                'Minimalist',
              ].map((occ) => (
                <button
                  key={occ}
                  type="button"
                  onClick={() => setSelectedOccasion(occ)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    selectedOccasion === occ
                      ? 'bg-amber-500 text-zinc-950 border-amber-400 font-bold'
                      : 'bg-zinc-900 text-zinc-300 border-white/10 hover:bg-zinc-800'
                  }`}
                >
                  {occ}
                </button>
              ))}
            </div>
          </div>

          {/* Bütçe Hedefi */}
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1.5">
              Hedef Bütçe Seviyesi:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'budget', label: 'Ekonomik / Fırsat' },
                { id: 'optimum', label: 'Optimum / Dengeli' },
                { id: 'luxury', label: 'Premium / Lüks' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBudget(b.id as any)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                    selectedBudget === b.id
                      ? 'bg-emerald-500 text-zinc-950 border-emerald-400 font-bold'
                      : 'bg-zinc-900 text-zinc-300 border-white/10 hover:bg-zinc-800'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/25 flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Kombin Hazırlanıyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-zinc-950" />
                  <span>Kombini Oluştur & Fiyatlandır</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
