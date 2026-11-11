/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { VisualStudio } from './components/VisualStudio';
import { OutfitMixer } from './components/OutfitMixer';
import { PriceComparisonView } from './components/PriceComparisonView';
import { SavedLooksView } from './components/SavedLooksView';
import { ItemDetailDrawer } from './components/ItemDetailDrawer';
import { AiGenerateModal } from './components/AiGenerateModal';
import { INITIAL_OUTFITS } from './data/outfits';
import { CurrencyType, OutfitItem, OutfitLook } from './types';
import { calculateOutfitSavings } from './utils/pricing';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'mixer' | 'prices' | 'saved'>('studio');
  const [allLooks, setAllLooks] = useState<OutfitLook[]>(INITIAL_OUTFITS);
  const [currentLook, setCurrentLook] = useState<OutfitLook>(INITIAL_OUTFITS[0]);
  const [mixerItems, setMixerItems] = useState<OutfitItem[]>(INITIAL_OUTFITS[0].items);
  const [currency, setCurrency] = useState<CurrencyType>('TRY');
  const [selectedDrawerItem, setSelectedDrawerItem] = useState<OutfitItem | null>(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [savedLooks, setSavedLooks] = useState<OutfitLook[]>([INITIAL_OUTFITS[0], INITIAL_OUTFITS[2]]);

  const savings = calculateOutfitSavings(currentLook.items);
  const isCurrentLookSaved = savedLooks.some((l) => l.id === currentLook.id);

  // Switch look
  const handleSelectLook = (look: OutfitLook) => {
    setCurrentLook(look);
    setMixerItems([...look.items]);
    setActiveTab('studio');
  };

  // Toggle save look
  const handleToggleSaveLook = (look: OutfitLook) => {
    if (savedLooks.some((l) => l.id === look.id)) {
      setSavedLooks(savedLooks.filter((l) => l.id !== look.id));
    } else {
      setSavedLooks([...savedLooks, look]);
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.8 },
        });
      } catch (e) {}
    }
  };

  // Save customized look from mixer
  const handleSaveMixerAsLook = (title: string, items: OutfitItem[]) => {
    const newLook: OutfitLook = {
      id: `custom-look-${Date.now()}`,
      title: title || 'Kişiselleştirilmiş AI Kombini',
      subtitle: `${items.length} parça ile oluşturulan özel gardırop kombini`,
      styleCategory: 'Smart Casual',
      season: '4 Mevsim',
      harmonyScore: 96,
      aestheticDescription: 'Kullanıcı tarafından özel olarak eşleştirilen parçalarla hazırlanmış dengeli stil.',
      stylistAdvice: 'Parçalar arasındaki doku kontrastı ve ton dengesi başarılı bir gün boyu konfor sunar.',
      mannequinImage: currentLook.mannequinImage,
      palette: items.slice(0, 5).map((i) => i.colorHex),
      items: [...items],
    };

    setAllLooks([newLook, ...allLooks]);
    setCurrentLook(newLook);
    setSavedLooks([newLook, ...savedLooks]);
    setActiveTab('studio');

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch (e) {}
  };

  return (
    <div className="min-h-screen bg-[#111215] text-zinc-100 font-sans selection:bg-amber-500 selection:text-zinc-950">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        savedLooksCount={savedLooks.length}
        totalSavingsAmount={`${savings.savingsPercentage}%`}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'studio' && (
          <VisualStudio
            currentLook={currentLook}
            allLooks={allLooks}
            onSelectLook={handleSelectLook}
            currency={currency}
            onSelectItem={(item) => setSelectedDrawerItem(item)}
            onGoToPrices={() => setActiveTab('prices')}
            onCustomizeLook={() => {
              setMixerItems([...currentLook.items]);
              setActiveTab('mixer');
            }}
            onSaveLook={handleToggleSaveLook}
            isSaved={isCurrentLookSaved}
          />
        )}

        {activeTab === 'mixer' && (
          <OutfitMixer
            currentItems={mixerItems}
            onUpdateItems={(items) => setMixerItems(items)}
            currency={currency}
            onGoToPrices={() => setActiveTab('prices')}
            onSaveAsLook={handleSaveMixerAsLook}
          />
        )}

        {activeTab === 'prices' && (
          <PriceComparisonView
            items={mixerItems.length > 0 ? mixerItems : currentLook.items}
            currency={currency}
            onSelectLookTab={() => setActiveTab('studio')}
          />
        )}

        {activeTab === 'saved' && (
          <SavedLooksView
            savedLooks={savedLooks}
            onSelectLook={handleSelectLook}
            onRemoveSaved={(id) => setSavedLooks(savedLooks.filter((l) => l.id !== id))}
            currency={currency}
            onGoToMixer={() => setActiveTab('mixer')}
          />
        )}
      </main>

      {/* Item Detail Drawer */}
      <ItemDetailDrawer
        item={selectedDrawerItem}
        onClose={() => setSelectedDrawerItem(null)}
        currency={currency}
      />

      {/* AI Generate Outfit Modal */}
      <AiGenerateModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onApplyNewLook={(look) => {
          setAllLooks([look, ...allLooks]);
          setCurrentLook(look);
          setMixerItems([...look.items]);
          setActiveTab('studio');
        }}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10 bg-[#0E0F12] py-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-400">KOMBIN<span className="text-amber-400">AI</span></span>
            <span>• Akıllı Kombinasyon & Mağaza Fiyat Karşılaştırma Asistanı</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <span>Trendyol</span>
            <span>•</span>
            <span>Zara</span>
            <span>•</span>
            <span>Massimo Dutti</span>
            <span>•</span>
            <span>Beymen</span>
            <span>•</span>
            <span>Mango</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
