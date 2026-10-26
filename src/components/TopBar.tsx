import { RefreshCw, FileJson, FileText, Eye } from 'lucide-react';
import { AnalysisResult } from '../types';

interface TopBarProps {
  analysisResult: AnalysisResult | null;
}

export default function TopBar({ analysisResult }: TopBarProps) {
  const handleRescan = () => {
    // Trigger re-analysis
    window.location.reload();
  };

  const handleExportJSON = () => {
    if (!analysisResult) return;
    
    const jsonData = JSON.stringify(analysisResult, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'provenance-manifest.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    alert('PDF export functionality - In production, use jsPDF or similar library');
  };

  return (
    <div className="bg-midnight-light border-b border-slate-dark-light px-6 py-4">
      {/* Title & Badge */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">
            Image Authenticity & C2PA Provenance Inspector
          </h2>
          <div className="px-3 py-1.5 bg-emerald-bright/20 border border-emerald-bright rounded-lg">
            <span className="text-xs font-bold text-emerald-bright font-mono tracking-wide">
              C2PA SPEC V1.3 AUDIT
            </span>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Eye className="w-4 h-4" />
          <span className="font-mono">Encrypted Engine Mode</span>
        </div>
      </div>

      {/* Action Buttons */}
      {analysisResult && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleRescan}
            className="flex items-center gap-2 px-4 py-2 bg-slate-dark border border-cyan-bright/30 text-cyan-bright rounded-lg hover:bg-slate-dark-light hover:border-cyan-bright transition-all font-medium text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Re-scan File
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2 bg-slate-dark border border-blue-electric/30 text-blue-electric rounded-lg hover:bg-slate-dark-light hover:border-blue-electric transition-all font-medium text-sm"
          >
            <FileJson className="w-4 h-4" />
            Provenance JSON-LD
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-bright text-midnight rounded-lg hover:bg-cyan-bright/90 transition-all font-bold text-sm shadow-glow-cyan"
          >
            <FileText className="w-4 h-4" />
            Export PDF Certificate
          </button>
        </div>
      )}
    </div>
  );
}
