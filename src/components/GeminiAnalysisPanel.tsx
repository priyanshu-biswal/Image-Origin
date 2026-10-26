import { Sparkles, Brain } from 'lucide-react';
import { AnalysisResult } from '../types';

interface GeminiAnalysisPanelProps {
  analysisResult: AnalysisResult;
}

export default function GeminiAnalysisPanel({ analysisResult }: GeminiAnalysisPanelProps) {
  const { gemini, isSynthetic } = analysisResult;

  const probabilityPercent = (gemini.probability * 100).toFixed(1);
  const confidencePercent = (gemini.confidence * 100).toFixed(0);

  // Calculate donut gauge parameters
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (gemini.probability * circumference);

  const getVectorLabel = (value: number) => {
    if (value < 30) return 'Anomalous';
    if (value < 50) return 'Suspicious';
    if (value < 70) return 'Moderate';
    if (value < 85) return 'Non-Realist';
    return 'Diffusion Signature';
  };

  const getVectorColor = (value: number) => {
    if (value < 30) return 'bg-red-alert';
    if (value < 50) return 'bg-yellow-400';
    if (value < 70) return 'bg-blue-electric';
    return 'bg-purple-500';
  };

  return (
    <div className="bg-slate-dark border border-slate-dark-light rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/20 border border-purple-500 rounded-lg">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Gemini Flash Neural Forensic Analysis</h3>
            <p className="text-xs text-gray-500 font-mono">Powered by Google DeepMind</p>
          </div>
        </div>
        <div className="px-3 py-1.5 bg-emerald-bright/20 border border-emerald-bright rounded-lg">
          <span className="text-xs font-bold text-emerald-bright font-mono">
            HIGH CONFIDENCE ({confidencePercent}%)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Probability Gauge */}
        <div className="bg-midnight-light border border-slate-dark-light rounded-lg p-6">
          <div className="flex flex-col items-center">
            {/* Donut Gauge */}
            <div className="relative w-48 h-48 mb-4">
              <svg className="transform -rotate-90 w-48 h-48">
                {/* Background circle */}
                <circle
                  cx="96"
                  cy="96"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="transparent"
                  className="text-slate-dark"
                />
                {/* Progress circle */}
                <circle
                  cx="96"
                  cy="96"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className={isSynthetic ? 'text-red-alert' : 'text-emerald-bright'}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                />
              </svg>
              
              {/* Center Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className={`text-4xl font-bold font-mono ${isSynthetic ? 'text-red-alert' : 'text-emerald-bright'}`}>
                  {probabilityPercent}%
                </div>
                <div className="text-xs text-gray-500 font-mono mt-1">PROBABILITY</div>
              </div>
            </div>

            {/* Label */}
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Probability AI Generated</p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border-2 ${
                isSynthetic 
                  ? 'bg-red-alert/20 border-red-alert' 
                  : 'bg-emerald-bright/20 border-emerald-bright'
              }`}>
                <Sparkles className={`w-4 h-4 ${isSynthetic ? 'text-red-alert' : 'text-emerald-bright'}`} />
                <span className={`text-sm font-bold font-mono ${isSynthetic ? 'text-red-alert' : 'text-emerald-bright'}`}>
                  {isSynthetic ? 'SYNTHETIC FLAG' : 'AUTHENTIC'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Neural Telemetry Vectors */}
        <div className="bg-midnight-light border border-slate-dark-light rounded-lg p-6">
          <h4 className="text-sm font-bold text-cyan-bright font-mono mb-4">
            NEURAL TELEMETRY VECTORS
          </h4>

          <div className="space-y-4">
            {/* Lighting & Specular Consistency */}
            <VectorBar
              label="[01] Lighting & Specular Consistency"
              value={gemini.vectors.lighting}
              status={getVectorLabel(gemini.vectors.lighting)}
              color={getVectorColor(gemini.vectors.lighting)}
            />

            {/* Anatomical Structural Realism */}
            <VectorBar
              label="[02] Anatomical Structural Realism"
              value={gemini.vectors.anatomy}
              status={getVectorLabel(gemini.vectors.anatomy)}
              color={getVectorColor(gemini.vectors.anatomy)}
            />

            {/* Sensor Pattern Noise */}
            <VectorBar
              label="[03] Sensor Pattern Noise (PRNU)"
              value={gemini.vectors.sensorNoise}
              status={getVectorLabel(gemini.vectors.sensorNoise)}
              color={getVectorColor(gemini.vectors.sensorNoise)}
            />

            {/* Edge Gradient Frequency */}
            <VectorBar
              label="[04] Edge Gradient Frequency"
              value={gemini.vectors.edgeGradient}
              status={getVectorLabel(gemini.vectors.edgeGradient)}
              color={getVectorColor(gemini.vectors.edgeGradient)}
            />
          </div>
        </div>
      </div>

      {/* Gemini Analytical Verdict */}
      <div className="mt-6 bg-midnight-light border-2 border-purple-500/30 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-5 h-5 text-purple-400" />
          <h4 className="text-sm font-bold text-purple-400 font-mono">
            GEMINI FLASH ANALYTICAL VERDICT
          </h4>
        </div>
        <p className="text-sm text-gray-300 leading-relaxed font-mono">
          {gemini.verdict}
        </p>
      </div>

      {/* Model Information */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500 font-mono">
        <div>
          <span>MODEL: </span>
          <span className="text-cyan-bright font-bold">GEMINI FLASH</span>
        </div>
        <div>
          <span>INFERENCE STATUS: </span>
          <span className="text-emerald-bright font-bold">SUCCESS</span>
        </div>
      </div>
    </div>
  );
}

// Helper Component for Vector Bars
interface VectorBarProps {
  label: string;
  value: number;
  status: string;
  color: string;
}

function VectorBar({ label, value, status, color }: VectorBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-400 font-mono">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white font-mono">{value}%</span>
          <span className="text-xs text-gray-500">({status})</span>
        </div>
      </div>
      <div className="h-3 bg-slate-dark rounded-full overflow-hidden border border-slate-dark-light">
        <div
          className={`h-full ${color} transition-all duration-1000`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}
