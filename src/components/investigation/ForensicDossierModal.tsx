import { useState, useEffect } from 'react';
import {
  X,
  FileText,
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  Award,
  Calendar,
  MapPin,
  TrendingUp,
  Heart,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Receipt, DatasetSummary } from '../../types/receipt';
import { fetchBiographicalDossier, BiographicalDossier } from '../../services/aiService';

interface ForensicDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: DatasetSummary;
  receipts: Receipt[];
}

export function ForensicDossierModal({
  isOpen,
  onClose,
  summary,
  receipts,
}: ForensicDossierModalProps) {
  const [dossier, setDossier] = useState<BiographicalDossier | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#3b82f6', '#10b981', '#f59e0b'],
        });
      } catch (e) {
        // Ignore if unsupported
      }

      if (!dossier) {
        setLoading(true);
        fetchBiographicalDossier(summary, receipts)
          .then((data) => setDossier(data))
          .finally(() => setLoading(false));
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!dossier) return;
    const content = `
======================================================
YOUR LIFE, IN RECEIPTS: FORENSIC LIFE DOSSIER
======================================================
SUBJECT CODE: ${dossier.subjectCodeName}
PROVENANCE: 2,461 Verified Household Receipts

EXECUTIVE SUMMARY:
${dossier.biographicalSummary}

DEMOGRAPHICS & GEOGRAPHIC ODYSSEY:
- Location: ${dossier.demographicsAndGeography.location}
- Living Arrangement: ${dossier.demographicsAndGeography.livingArrangement}
- Commute Routine: ${dossier.demographicsAndGeography.commuteRoutine}
- Occupation Profile: ${dossier.demographicsAndGeography.occupationProfile}

FINANCIAL CHARACTER SCORECARD:
- Discipline Rating: ${dossier.financialCharacterScorecard.disciplineRating}
- Frugality Score: ${dossier.financialCharacterScorecard.frugalityScore}
- Investment Ratio: ${dossier.financialCharacterScorecard.investmentRatio}
- Risk Profile: ${dossier.financialCharacterScorecard.riskAppetite}

THE FOUR LIFE ERAS:
${dossier.theFourLifeEras.map((e) => `• ${e.era}: ${e.essence}`).join('\n')}

MOMENTS OF VULNERABILITY:
${dossier.momentsOfVulnerability}

UNSPOKEN SACRIFICES:
${dossier.unspokenSacrifices}

FORENSIC VERDICT:
${dossier.verdict}
======================================================
Generated via Forensic Ledger AI Studio
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Forensic_Life_Dossier_${dossier.subjectCodeName.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#090d16] border border-cyan-500/40 shadow-2xl p-6 sm:p-10 space-y-8 text-slate-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono tracking-widest uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>OFFICIAL FORENSIC DOSSIER</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold font-editorial text-white">
              The Biography of an Anonymous Life
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Synthesized from 2,461 verifiable transactional records spanning 2014–2022.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export File</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-xs text-white font-semibold transition cursor-pointer shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>

        {loading || !dossier ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
            <span className="text-xs font-mono text-slate-400">
              Generating Forensic Biographical Dossier...
            </span>
          </div>
        ) : (
          <div className="space-y-8 text-sm">
            {/* Subject Code Name & Summary */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  SUBJECT DESIGNATION: {dossier.subjectCodeName}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Reliability: 98% Documented
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed font-light text-base">
                {dossier.biographicalSummary}
              </p>
            </div>

            {/* Demographics & Geographic Map */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
                  <MapPin className="w-4 h-4" />
                  <span>Geographic Odyssey</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300">
                  <li>
                    <strong className="text-white">Location:</strong> {dossier.demographicsAndGeography.location}
                  </li>
                  <li>
                    <strong className="text-white">Living Arrangement:</strong> {dossier.demographicsAndGeography.livingArrangement}
                  </li>
                  <li>
                    <strong className="text-white">Commute:</strong> {dossier.demographicsAndGeography.commuteRoutine}
                  </li>
                  <li>
                    <strong className="text-white">Occupation:</strong> {dossier.demographicsAndGeography.occupationProfile}
                  </li>
                </ul>
              </div>

              {/* Financial Character Scorecard */}
              <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>Financial Character Scorecard</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">DISCIPLINE</span>
                    <span className="font-bold text-emerald-400">{dossier.financialCharacterScorecard.disciplineRating}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block font-mono">FRUGALITY</span>
                    <span className="font-bold text-cyan-300">{dossier.financialCharacterScorecard.frugalityScore}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 col-span-2">
                    <span className="text-[10px] text-slate-400 block font-mono">ASSET COMPOSITION</span>
                    <span className="text-white font-mono">{dossier.financialCharacterScorecard.investmentRatio}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* The Four Life Eras */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
                THE FOUR CHRONOLOGICAL LIFE ERAS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {dossier.theFourLifeEras.map((era, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span>{era.era}</span>
                    </div>
                    <p className="text-xs text-slate-300 font-light leading-relaxed">
                      {era.essence}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Vulnerabilities & Sacrifices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40 space-y-1.5">
                <span className="text-[11px] font-mono text-rose-300 uppercase tracking-wider block font-semibold">
                  Moments of Vulnerability
                </span>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  {dossier.momentsOfVulnerability}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-1.5">
                <span className="text-[11px] font-mono text-amber-300 uppercase tracking-wider block font-semibold">
                  Unspoken Sacrifices
                </span>
                <p className="text-xs text-slate-300 font-light leading-relaxed">
                  {dossier.unspokenSacrifices}
                </p>
              </div>
            </div>

            {/* Final Verdict */}
            <div className="p-6 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
              <span className="text-xs font-mono uppercase text-cyan-300 tracking-wider font-semibold block">
                FORENSIC VERDICT
              </span>
              <p className="text-sm text-slate-200 font-light italic leading-relaxed">
                "{dossier.verdict}"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
