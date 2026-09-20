import { Compass, Sparkles, Map, Network, ReceiptText, Search, Palette, BookOpen, Play, Database, Award } from 'lucide-react';

export type NavPage = 'Journey' | 'Investigate' | 'Discover' | 'LifeMap' | 'Patterns' | 'Receipts';

interface NavbarProps {
  activePage: NavPage;
  onSelectPage: (page: NavPage) => void;
  onOpenSearch: () => void;
  onOpenTheme: () => void;
  onOpenHelp: () => void;
  onOpenDatasetModal: () => void;
  onOpenDossier: () => void;
  onStartDemo: () => void;
  datasetName: string;
  totalRecords: number;
}

export function Navbar({
  activePage,
  onSelectPage,
  onOpenSearch,
  onOpenTheme,
  onOpenHelp,
  onOpenDatasetModal,
  onOpenDossier,
  onStartDemo,
  datasetName,
  totalRecords,
}: NavbarProps) {
  const navItems: { id: NavPage; label: string; icon: typeof Compass }[] = [
    { id: 'Journey', label: 'Journey', icon: Compass },
    { id: 'Investigate', label: 'AI Detective', icon: Sparkles },
    { id: 'Discover', label: 'Discover', icon: Sparkles },
    { id: 'LifeMap', label: 'Life Map', icon: Map },
    { id: 'Patterns', label: 'Patterns', icon: Network },
    { id: 'Receipts', label: 'Receipts', icon: ReceiptText },
  ];

  return (
    <>
      {/* Top Desktop Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#07090e]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectPage('Journey')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition">
                <ReceiptText className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-editorial text-base sm:text-lg font-bold tracking-wider text-white block leading-none">
                  YOUR LIFE, IN RECEIPTS
                </span>
                <span className="text-[10px] font-mono text-slate-400 tracking-wider hidden sm:block">
                  AN INTERACTIVE INVESTIGATION
                </span>
              </div>
            </button>

            {/* Dataset Pill Selector */}
            <button
              id="btn-switch-dataset"
              onClick={onOpenDatasetModal}
              className="hidden lg:flex items-center gap-1.5 ml-3 px-2.5 py-1 rounded-full text-xs font-mono bg-slate-800/60 hover:bg-slate-800 text-slate-300 border border-slate-700/50 transition cursor-pointer"
              title="Switch or upload dataset"
            >
              <Database className="w-3 h-3 text-cyan-400" />
              <span className="truncate max-w-[140px]">{datasetName.replace('.csv', '')}</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                {totalRecords.toLocaleString()}
              </span>
            </button>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id.toLowerCase()}`}
                  onClick={() => onSelectPage(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Controls: Search, Theme, Help, Demo */}
          <div className="flex items-center gap-2">
            {/* Search Button with `/` shortcut badge */}
            <button
              id="btn-open-search"
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition cursor-pointer"
              title="Search receipts (Shortcut: /)"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 rounded border border-slate-700 text-slate-400">
                /
              </kbd>
            </button>

            {/* Official Life Dossier button */}
            <button
              id="btn-open-dossier"
              onClick={onOpenDossier}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/40 text-amber-300 text-xs font-medium transition cursor-pointer"
              title="Open Official Forensic Life Dossier"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Life Dossier</span>
            </button>

            {/* Demo Walkthrough button */}
            <button
              id="btn-start-demo-header"
              onClick={onStartDemo}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-500/40 text-cyan-300 text-xs font-medium transition cursor-pointer"
              title="Launch guided interactive demo"
            >
              <Play className="w-3 h-3 fill-cyan-400 text-cyan-400" />
              <span>Demo Tour</span>
            </button>

            {/* Theme Customizer button */}
            <button
              id="btn-open-theme"
              onClick={onOpenTheme}
              className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-cyan-300 transition cursor-pointer"
              title="Theme customization"
            >
              <Palette className="w-4 h-4" />
            </button>

            {/* Docs & Methodology button */}
            <button
              id="btn-open-help"
              onClick={onOpenHelp}
              aria-label="Documentation & System Methodology Guide"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-300 hover:text-cyan-300 transition cursor-pointer text-xs font-mono"
              title="Documentation & System Methodology"
            >
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="hidden xl:inline">Docs</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Compact Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#07090e]/95 backdrop-blur-lg border-t border-slate-800 px-2 py-1.5 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectPage(item.id)}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-medium transition cursor-pointer ${
                isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
