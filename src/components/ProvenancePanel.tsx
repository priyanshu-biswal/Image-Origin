import { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Shield, Clock } from 'lucide-react';
import { AnalysisResult, ProvenanceTab } from '../types';

interface ProvenancePanelProps {
  analysisResult: AnalysisResult;
}

export default function ProvenancePanel({ analysisResult }: ProvenancePanelProps) {
  const [activeTab, setActiveTab] = useState<ProvenanceTab>('claim');

  const { c2pa, exif, trustScore, isSynthetic } = analysisResult;

  const formatTrustScore = (score: number) => {
    return score.toFixed(2);
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 0.7) return 'text-emerald-bright';
    if (score >= 0.4) return 'text-yellow-400';
    return 'text-red-alert';
  };

  const getTrustScoreLabel = (score: number) => {
    if (score >= 0.7) return 'HIGH TRUST';
    if (score >= 0.4) return 'MODERATE';
    return 'LOW TRUST';
  };

  return (
    <div className="bg-slate-dark border border-slate-dark-light rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Provenance Assertion Manifest</h3>
        <span className="px-2 py-1 bg-red-alert/20 border border-red-alert rounded text-xs font-bold text-red-alert font-mono animate-pulse-glow">
          SUBMIT VIEW
        </span>
      </div>

      {/* Alert Card */}
      {isSynthetic && !c2pa.hasClaim && (
        <div className="bg-red-alert/10 border-2 border-red-alert rounded-lg p-4 mb-4 shadow-glow-red">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-alert flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-lg font-bold text-red-alert mb-2">
                ⚠️ SYNTHETIC DETECTED
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                Image displays deep neural generative patterns with completely missing cryptographic 
                provenance chains. No signed C2PA manifest found in JUMBF binary box.
              </p>
            </div>
          </div>
        </div>
      )}

      {c2pa.hasClaim && (
        <div className="bg-emerald-bright/10 border-2 border-emerald-bright rounded-lg p-4 mb-4 shadow-glow-emerald">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-bright flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-lg font-bold text-emerald-bright mb-2">
                ✓ C2PA MANIFEST FOUND
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                Valid cryptographic provenance chain detected with signed assertions. 
                Content authenticity verified through {c2pa.certificateAuthority}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-4 border-b border-slate-dark-light">
        {[
          { id: 'claim', label: 'Claim & Signature' },
          { id: 'action', label: 'Action Chain' },
          { id: 'exif', label: 'EXIF / Camera' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ProvenanceTab)}
            className={`
              px-4 py-2 font-mono text-sm font-bold transition-all relative
              ${activeTab === tab.id
                ? 'text-cyan-bright border-b-2 border-cyan-bright'
                : 'text-gray-500 hover:text-gray-300'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'claim' && (
          <>
            {/* Status Checklist */}
            <div className="space-y-3">
              <StatusItem
                label="Claim Generator:"
                value={c2pa.claimGenerator}
                status={c2pa.hasClaim ? 'success' : 'error'}
                badge={c2pa.hasClaim ? undefined : '0 bytes C2PA'}
              />

              <StatusItem
                label="Digital Signature:"
                value={c2pa.signatureStatus.toUpperCase()}
                status={c2pa.signatureStatus === 'valid' ? 'success' : 'error'}
                badge={c2pa.signatureStatus === 'unsigned' ? 'UNSIGNED / MISSING' : undefined}
              />

              <StatusItem
                label="Certificate Authority:"
                value={c2pa.certificateAuthority}
                status={c2pa.hasClaim ? 'success' : 'neutral'}
              />

              <StatusItem
                label="Tamper Evidence:"
                value={c2pa.tamperEvidence}
                status={c2pa.tamperEvidence === 'none' ? 'success' : 'warning'}
              />
            </div>
          </>
        )}

        {activeTab === 'action' && (
          <div className="space-y-3">
            {c2pa.actionChain.length > 0 ? (
              c2pa.actionChain.map((action, index) => (
                <div
                  key={index}
                  className="bg-midnight-light border border-slate-dark-light rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-cyan-bright/20 border border-cyan-bright rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-cyan-bright font-bold text-xs">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-white capitalize">{action.action}</span>
                        <span className="px-2 py-0.5 bg-emerald-bright/20 text-emerald-bright text-xs font-mono rounded">
                          SIGNED
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 font-mono">{action.software}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(action.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-mono text-sm">No action chain recorded</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'exif' && (
          <div className="space-y-3">
            <div className="bg-midnight-light border border-slate-dark-light rounded-lg p-4">
              <h5 className="text-xs text-gray-500 font-mono mb-3">CAMERA INFORMATION</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Make:</span>
                  <span className="text-sm text-white font-mono">{exif.camera.make}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Model:</span>
                  <span className="text-sm text-white font-mono">{exif.camera.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Software:</span>
                  <span className="text-sm text-white font-mono">{exif.camera.software}</span>
                </div>
              </div>
            </div>

            <div className="bg-midnight-light border border-slate-dark-light rounded-lg p-4">
              <h5 className="text-xs text-gray-500 font-mono mb-3">EXPOSURE DATA</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">ISO:</span>
                  <span className="text-sm text-white font-mono">
                    {exif.exposure.iso || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Aperture:</span>
                  <span className="text-sm text-white font-mono">
                    {exif.exposure.fNumber ? `f/${exif.exposure.fNumber}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Shutter:</span>
                  <span className="text-sm text-white font-mono">
                    {exif.exposure.exposureTime ? `1/${Math.round(1 / exif.exposure.exposureTime)}s` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Focal Length:</span>
                  <span className="text-sm text-white font-mono">
                    {exif.exposure.focalLength ? `${exif.exposure.focalLength}mm` : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cryptographic Trust Score */}
      <div className="mt-6 bg-midnight-light border-2 border-cyan-bright/30 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-cyan-bright font-mono">
            CRYPTOGRAPHIC TRUST SCORE
          </h4>
          <span className={`px-3 py-1 bg-slate-dark border rounded font-bold text-xs font-mono ${getTrustScoreColor(trustScore)}`}>
            {getTrustScoreLabel(trustScore)}
          </span>
        </div>

        <div className="flex items-end gap-6">
          {/* Large Score Display */}
          <div className="flex-shrink-0">
            <div className={`text-5xl font-bold font-mono ${getTrustScoreColor(trustScore)}`}>
              {formatTrustScore(trustScore)}
            </div>
            <div className="text-gray-500 text-sm font-mono">/ 1.00</div>
          </div>

          {/* Visual Meter */}
          <div className="flex-1">
            <div className="h-12 bg-slate-dark rounded-lg overflow-hidden border border-slate-dark-light">
              <div
                className={`h-full transition-all duration-1000 ${
                  trustScore >= 0.7 ? 'bg-emerald-bright' :
                  trustScore >= 0.4 ? 'bg-yellow-400' : 'bg-red-alert'
                }`}
                style={{ width: `${trustScore * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 font-mono mt-2">
              {c2pa.hasClaim 
                ? `${c2pa.actionChain.length} Root-of-Trust anchors found`
                : 'Zero Root-of-Trust anchors found'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Component
interface StatusItemProps {
  label: string;
  value: string;
  status: 'success' | 'error' | 'warning' | 'neutral';
  badge?: string;
}

function StatusItem({ label, value, status, badge }: StatusItemProps) {
  const getIcon = () => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-bright" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-alert" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-600" />;
    }
  };

  const getTextColor = () => {
    switch (status) {
      case 'success':
        return 'text-emerald-bright';
      case 'error':
        return 'text-red-alert';
      case 'warning':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="bg-midnight-light border border-slate-dark-light rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {getIcon()}
          <div>
            <p className="text-xs text-gray-500 font-mono">{label}</p>
            <p className={`text-sm font-bold font-mono ${getTextColor()}`}>
              {value}
            </p>
          </div>
        </div>
        {badge && (
          <span className="px-2 py-1 bg-red-alert/20 border border-red-alert rounded text-xs font-bold text-red-alert font-mono">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
