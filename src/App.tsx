/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useDataset } from './hooks/useDataset';
import { useTheme } from './hooks/useTheme';
import { NavPage, Navbar } from './components/navigation/Navbar';
import { OpeningScreen } from './components/layout/OpeningScreen';
import { ReceiptModal } from './components/receipt/ReceiptModal';
import { SearchModal } from './components/layout/SearchModal';
import { ThemeModal } from './components/layout/ThemeModal';
import { HelpModal } from './components/layout/HelpModal';
import { DatasetSelectorModal } from './components/layout/DatasetSelectorModal';
import { DemoTourModal } from './components/layout/DemoTourModal';
import { JourneyPage } from './pages/Journey';
import { InvestigatePage } from './pages/Investigate';
import { DiscoverPage } from './pages/Discover';
import { LifeMapPage } from './pages/LifeMap';
import { PatternsPage } from './pages/Patterns';
import { ReceiptsPage } from './pages/Receipts';
import { ForensicDossierModal } from './components/investigation/ForensicDossierModal';
import { Receipt } from './types/receipt';
import { Loader2, AlertCircle } from 'lucide-react';
import { ErrorBoundary } from './components/common/ErrorBoundary';

export default function App() {
  const [showOpening, setShowOpening] = useState<boolean>(() => {
    return !sessionStorage.getItem('yir_intro_seen');
  });

  const [activePage, setActivePage] = useState<NavPage>('Journey');
  const [selectedReceipt, setSelectedReceipt] = useState<Receipt | null>(null);

  // Modals state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState(false);
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);

  // Core intelligence and data hooks
  const {
    receipts,
    loading,
    error,
    source,
    filename,
    summary,
    connections,
    memoryThreads,
    discoveryInsights,
    storyChapters,
    categoryStats,
    paymentModes,
    switchDataset,
    handleCustomUpload,
  } = useDataset();

  const {
    activeThemeId,
    customColor,
    presets,
    selectPreset,
    setCustomAccent,
  } = useTheme();

  // Keyboard shortcut listener ('/' for search, ESC to close modals)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is currently typing in an input, don't hijack '/'
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (e.key === '/' && !isInput) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsThemeOpen(false);
        setIsHelpOpen(false);
        setIsDatasetModalOpen(false);
        setSelectedReceipt(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDismissOpening = () => {
    setShowOpening(false);
    sessionStorage.setItem('yir_intro_seen', 'true');
  };

  const handleStartDemo = () => {
    setIsDemoTourOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-200 antialiased selection:bg-cyan-500 selection:text-white font-sans flex flex-col">
      {/* Cinematic Opening Screen */}
      {/* Accessible Skip Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-slate-950 focus:font-bold focus:rounded-lg focus:shadow-xl focus:outline-none"
      >
        Skip to main content
      </a>

      {showOpening && (
        <OpeningScreen
          onEnter={handleDismissOpening}
          recordCount={receipts.length}
          totalVolume={summary.totalSpending}
        />
      )}

      {/* Main App Layout */}
      <Navbar
        activePage={activePage}
        onSelectPage={setActivePage}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTheme={() => setIsThemeOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenDatasetModal={() => setIsDatasetModalOpen(true)}
        onOpenDossier={() => setIsDossierOpen(true)}
        onStartDemo={handleStartDemo}
        datasetName={filename}
        totalRecords={receipts.length}
      />

      {/* Content Container */}
      <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 focus:outline-none">
        <ErrorBoundary fallbackTitle="View Rendering Issue">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <span className="font-mono text-xs uppercase tracking-widest text-slate-400">
              Analyzing Forensic Ledger Archive...
            </span>
          </div>
        ) : error ? (
          <div className="p-8 rounded-2xl bg-rose-950/20 border border-rose-800/40 text-center max-w-md mx-auto my-12 space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <h3 className="font-editorial text-lg font-bold text-white">
              Data Loading Error
            </h3>
            <p className="text-xs text-slate-300 font-mono">{error}</p>
            <button
              onClick={() => switchDataset('primary')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-300"
            >
              Reset to Primary Dataset
            </button>
          </div>
        ) : (
          <>
            {activePage === 'Journey' && (
              <JourneyPage
                receipts={receipts}
                summary={summary}
                storyChapters={storyChapters}
                insights={discoveryInsights}
                threads={memoryThreads}
                onSelectReceipt={setSelectedReceipt}
                onNavigateToDiscover={() => setActivePage('Discover')}
                onNavigateToLifeMap={() => setActivePage('LifeMap')}
              />
            )}

            {activePage === 'Investigate' && (
              <InvestigatePage
                receipts={receipts}
                summary={summary}
                onSelectReceipt={setSelectedReceipt}
                onOpenDossier={() => setIsDossierOpen(true)}
              />
            )}

            {activePage === 'Discover' && (
              <DiscoverPage
                receipts={receipts}
                insights={discoveryInsights}
                threads={memoryThreads}
                onSelectReceipt={setSelectedReceipt}
              />
            )}

            {activePage === 'LifeMap' && (
              <LifeMapPage
                receipts={receipts}
                onSelectReceipt={setSelectedReceipt}
              />
            )}

            {activePage === 'Patterns' && (
              <PatternsPage
                receipts={receipts}
                onSelectReceipt={setSelectedReceipt}
              />
            )}

            {activePage === 'Receipts' && (
              <ReceiptsPage
                receipts={receipts}
                categoryStats={categoryStats}
                paymentModes={paymentModes}
                onSelectReceipt={setSelectedReceipt}
              />
            )}
          </>
        )}
        </ErrorBoundary>
      </main>

      {/* Persistent Global Modals */}
      <ReceiptModal
        receipt={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
        allReceipts={receipts}
        onSelectReceipt={setSelectedReceipt}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        receipts={receipts}
        onSelectReceipt={setSelectedReceipt}
      />

      <ThemeModal
        isOpen={isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
        presets={presets}
        activeThemeId={activeThemeId}
        customColor={customColor}
        onSelectPreset={selectPreset}
        onSetCustomColor={setCustomAccent}
      />

      <HelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      <DatasetSelectorModal
        isOpen={isDatasetModalOpen}
        onClose={() => setIsDatasetModalOpen(false)}
        activeSource={source}
        activeFilename={filename}
        onSelectSource={switchDataset}
        onCustomUpload={handleCustomUpload}
        totalRecords={receipts.length}
      />

      <DemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onNavigatePage={setActivePage}
      />

      <ForensicDossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        summary={summary}
        receipts={receipts}
      />
    </div>
  );
}
