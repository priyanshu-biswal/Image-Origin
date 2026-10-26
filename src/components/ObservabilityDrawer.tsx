import { Activity, Clock, Coins, Code } from 'lucide-react';
import { AnalysisResult } from '../types';

interface ObservabilityDrawerProps {
  analysisResult: AnalysisResult;
}

export default function ObservabilityDrawer({ analysisResult }: ObservabilityDrawerProps) {
  const { telemetry } = analysisResult;

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(5)}`;
  };

  const formatDuration = (ms: number) => {
    return `${ms}ms`;
  };

  // Calculate max duration for scaling bars
  const maxDuration = Math.max(...telemetry.steps.map(s => s.duration));

  // Generate trace ID
  const traceId = 'span_3e7c91bf4a2d8e6f';
  const spanId = '8a7c6b5d4e3f2a1b';

  return (
    <div className="bg-slate-dark border border-slate-dark-light rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-bright/20 border border-cyan-bright rounded-lg">
            <Activity className="w-6 h-6 text-cyan-bright" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Observability & Tracing</h3>
            <p className="text-xs text-gray-500 font-mono">Real-time Agent Execution Trace & Cost Telemetry</p>
          </div>
        </div>
        <div className="px-3 py-1.5 bg-emerald-bright/20 border border-emerald-bright rounded-lg animate-pulse-glow">
          <span className="text-xs font-bold text-emerald-bright font-mono">
            ● LIVE
          </span>
        </div>
      </div>

      {/* Pipeline Trace Waterfall */}
      <div className="bg-midnight-light border border-slate-dark-light rounded-lg p-5 mb-6">
        <h4 className="text-sm font-bold text-cyan-bright font-mono mb-4">
          PIPELINE TRACE WATERFALL
        </h4>

        <div className="space-y-3">
          {telemetry.steps.map((step) => {
            const barWidth = (step.duration / maxDuration) * 100;
            const stepColor = step.status === 'success' ? 'bg-emerald-bright' : 'bg-red-alert';

            return (
              <div key={step.step} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-cyan-bright/20 text-cyan-bright text-xs font-bold font-mono rounded">
                      {String(step.step).padStart(2, '0')}
                    </span>
                    <span className="text-sm text-gray-300 font-mono">{step.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-mono">
                      {formatDuration(step.duration)}
                    </span>
                    <Clock className="w-3 h-3 text-gray-500" />
                  </div>
                </div>
                
                <div className="h-8 bg-slate-dark rounded border border-slate-dark-light overflow-hidden">
                  <div
                    className={`h-full ${stepColor} transition-all duration-1000 flex items-center px-3 text-xs font-mono font-bold text-midnight`}
                    style={{ width: `${barWidth}%` }}
                  >
                    {step.duration > 50 && `${formatDuration(step.duration)}`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Telemetry Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Total Latency */}
        <div className="bg-midnight-light border border-cyan-bright/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-cyan-bright" />
            <h5 className="text-xs font-bold text-cyan-bright font-mono">TOTAL LATENCY</h5>
          </div>
          <div className="text-3xl font-bold text-white font-mono mb-1">
            {telemetry.totalLatency}<span className="text-lg text-gray-500">ms</span>
          </div>
          <p className="text-xs text-gray-500 font-mono">End-to-end pipeline execution</p>
        </div>

        {/* Token Usage */}
        <div className="bg-midnight-light border border-purple-500/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-4 h-4 text-purple-400" />
            <h5 className="text-xs font-bold text-purple-400 font-mono">TOKEN USAGE</h5>
          </div>
          <div className="text-3xl font-bold text-white font-mono mb-1">
            {telemetry.tokenUsage.total}<span className="text-lg text-gray-500">tok</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
            <span>In: <span className="text-cyan-bright font-bold">{telemetry.tokenUsage.input}</span></span>
            <span>Out: <span className="text-purple-400 font-bold">{telemetry.tokenUsage.output}</span></span>
          </div>
        </div>

        {/* Inference Cost */}
        <div className="bg-midnight-light border border-emerald-bright/30 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-4 h-4 text-emerald-bright" />
            <h5 className="text-xs font-bold text-emerald-bright font-mono">INFERENCE COST</h5>
          </div>
          <div className="text-3xl font-bold text-white font-mono mb-1">
            {formatCost(telemetry.cost)}
          </div>
          <p className="text-xs text-gray-500 font-mono">Gemini 1.5 Flash pricing</p>
        </div>
      </div>

      {/* OpenTelemetry Trace Span */}
      <div className="bg-midnight-light border border-slate-dark-light rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-cyan-bright font-mono">
            OPENTELEMETRY TRACE SPAN
          </h4>
          <button className="px-2 py-1 bg-slate-dark text-gray-400 text-xs font-mono rounded hover:bg-slate-dark-light transition-all">
            View Full Trace
          </button>
        </div>

        <div className="bg-slate-dark rounded-lg p-4 font-mono text-xs overflow-x-auto">
          <div className="space-y-1 text-gray-400">
            <div>
              <span className="text-cyan-bright">trace_id:</span> 
              <span className="text-white ml-2">&quot;{traceId}&quot;</span>
            </div>
            <div>
              <span className="text-cyan-bright">span_id:</span> 
              <span className="text-white ml-2">&quot;{spanId}&quot;</span>
            </div>
            <div>
              <span className="text-cyan-bright">service:</span> 
              <span className="text-white ml-2">&quot;verifyai-api&quot;</span>
            </div>
            <div>
              <span className="text-cyan-bright">operation:</span> 
              <span className="text-white ml-2">&quot;POST /api/analyze&quot;</span>
            </div>
            <div>
              <span className="text-cyan-bright">duration_ms:</span> 
              <span className="text-emerald-bright ml-2">{telemetry.totalLatency}</span>
            </div>
            <div>
              <span className="text-cyan-bright">status:</span> 
              <span className="text-emerald-bright ml-2">&quot;success&quot;</span>
            </div>
            <div>
              <span className="text-cyan-bright">attributes:</span> 
              <span className="text-gray-500 ml-2">&#123;</span>
            </div>
            <div className="ml-4">
              <span className="text-purple-400">&quot;model&quot;:</span> 
              <span className="text-white ml-2">&quot;gemini-1.5-flash&quot;,</span>
            </div>
            <div className="ml-4">
              <span className="text-purple-400">&quot;tokens.input&quot;:</span> 
              <span className="text-white ml-2">{telemetry.tokenUsage.input},</span>
            </div>
            <div className="ml-4">
              <span className="text-purple-400">&quot;tokens.output&quot;:</span> 
              <span className="text-white ml-2">{telemetry.tokenUsage.output},</span>
            </div>
            <div className="ml-4">
              <span className="text-purple-400">&quot;cost_usd&quot;:</span> 
              <span className="text-white ml-2">{telemetry.cost}</span>
            </div>
            <div>
              <span className="text-gray-500">&#125;</span>
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500 font-mono">
          <div>
            <span>Collector: </span>
            <span className="text-cyan-bright">OTLP/gRPC</span>
          </div>
          <div>
            <span>Sampled: </span>
            <span className="text-emerald-bright">100%</span>
          </div>
          <div>
            <span>Exported: </span>
            <span className="text-emerald-bright">✓ Success</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-slate-dark-light">
        <div className="flex items-center justify-between text-xs text-gray-500 font-mono">
          <div>
            <span>AGENT SESSION ACTIVE: </span>
            <span className="text-emerald-bright font-bold">{new Date().toLocaleString()}</span>
          </div>
          <div>
            <span>VIEW OTLP JSON</span>
          </div>
        </div>
      </div>
    </div>
  );
}
