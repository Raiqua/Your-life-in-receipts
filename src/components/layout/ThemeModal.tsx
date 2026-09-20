import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Palette, Sparkles } from 'lucide-react';
import { ThemePreset } from '../../hooks/useTheme';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: ThemePreset[];
  activeThemeId: string;
  customColor: string;
  onSelectPreset: (id: string) => void;
  onSetCustomColor: (color: string) => void;
}

export function ThemeModal({
  isOpen,
  onClose,
  presets,
  activeThemeId,
  customColor,
  onSelectPreset,
  onSetCustomColor,
}: ThemeModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="fixed inset-0" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative z-10 w-full max-w-md p-6 rounded-2xl bg-[#0e1320] border border-slate-700/60 shadow-2xl text-slate-200"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              <h3 className="font-editorial text-base font-bold text-white tracking-wide">
                ATMOSPHERIC THEME
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-5 space-y-5">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-3">
                Curated Accent Presets
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {presets.map((preset) => {
                  const isSelected = activeThemeId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => onSelectPreset(preset.id)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                        isSelected
                          ? 'bg-slate-800 border-white/40 text-white shadow-md'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full shadow-inner flex items-center justify-center"
                        style={{ backgroundColor: preset.color }}
                      >
                        {isSelected && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                      </span>
                      <span className="truncate">{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Hex Color Picker */}
            <div className="pt-4 border-t border-slate-800">
              <label className="text-xs font-mono uppercase tracking-wider text-slate-400 block mb-2">
                Custom Accent Tint
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => onSetCustomColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => onSetCustomColor(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-xs text-slate-200 uppercase focus:outline-none focus:border-cyan-400"
                  placeholder="#38BDF8"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                Saved automatically to local storage. Dynamically recalculates glow radii and soft alpha shaders across all visualizers.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
