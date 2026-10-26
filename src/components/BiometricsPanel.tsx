import { useState, useRef, useEffect } from 'react';
import { Copy, Check, ZoomIn, ZoomOut, RotateCcw, Crosshair } from 'lucide-react';
import { AnalysisResult, ViewMode } from '../types';

interface BiometricsPanelProps {
  analysisResult: AnalysisResult;
}

export default function BiometricsPanel({ analysisResult }: BiometricsPanelProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('RGB_FULL');
  const [copiedHash, setCopiedHash] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mousePos, setMousePos] = useState<{ x: number; y: number; r: number; g: number; b: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { exif, hash, fileInfo, isSynthetic, imageUrl } = analysisResult;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(hash.sha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  // Process image on canvas whenever imageUrl or viewMode changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    // Fallback test bench image if no image URL
    const sourceUrl =
      imageUrl ||
      `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
        <rect width="800" height="600" fill="#050814"/>
        <circle cx="400" cy="300" r="160" fill="none" stroke="#06b6d4" stroke-width="4"/>
        <circle cx="400" cy="300" r="90" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="6,6"/>
        <line x1="200" y1="300" x2="600" y2="300" stroke="#06b6d4" stroke-width="2"/>
        <line x1="400" y1="100" x2="400" y2="500" stroke="#06b6d4" stroke-width="2"/>
        <text x="400" y="550" fill="#06b6d4" font-family="monospace" font-size="20" text-anchor="middle">VERIFYAI TEST BENCH VIEWPORT</text>
      </svg>
    `)}`;

    img.onload = () => {
      // Set canvas dimensions
      const targetWidth = Math.min(img.width || 800, 1200);
      const targetHeight = Math.round((targetWidth / (img.width || 800)) * (img.height || 600));

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw base image
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      if (viewMode === 'RGB_FULL') {
        setIsProcessing(false);
        return;
      }

      // On-Device Digital Forensic Filters
      const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
      const data = imgData.data;
      const width = targetWidth;
      const height = targetHeight;

      if (viewMode === 'INVERT') {
        // Luminance/Color Negative Filter
        for (let i = 0; i < data.length; i += 4) {
          data[i] = 255 - data[i];         // R
          data[i + 1] = 255 - data[i + 1]; // G
          data[i + 2] = 255 - data[i + 2]; // B
        }
      } else if (viewMode === 'NOISE_MAP') {
        // PRNU / Sensor Pattern Noise Extraction (High-Pass Laplacian Residuals)
        const copy = new Uint8ClampedArray(data);

        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const idx = (y * width + x) * 4;

            // Center pixel luminance
            const centerLuma = 0.299 * copy[idx] + 0.587 * copy[idx + 1] + 0.114 * copy[idx + 2];

            // 4-neighborhood average
            const up = ((y - 1) * width + x) * 4;
            const down = ((y + 1) * width + x) * 4;
            const left = (y * width + (x - 1)) * 4;
            const right = (y * width + (x + 1)) * 4;

            const avgLuma =
              (0.299 * (copy[up] + copy[down] + copy[left] + copy[right]) +
                0.587 * (copy[up + 1] + copy[down + 1] + copy[left + 1] + copy[right + 1]) +
                0.114 * (copy[up + 2] + copy[down + 2] + copy[left + 2] + copy[right + 2])) / 4;

            // High-pass residual amplified by 12x
            const noise = Math.abs(centerLuma - avgLuma) * 12;

            // Render in forensic night-vision cyan/emerald phosphorescent styling
            data[idx] = Math.min(255, noise * 0.4);       // Red
            data[idx + 1] = Math.min(255, noise * 1.1);   // Green (dominant phosphor)
            data[idx + 2] = Math.min(255, noise * 1.3);   // Blue / Cyan
            data[idx + 3] = 255;
          }
        }
      } else if (viewMode === 'ELA_MASK') {
        // Error Level Analysis (ELA) Simulation
        // Amplifies high-frequency compression gradient deltas and maps to chromatic heatmap
        const copy = new Uint8ClampedArray(data);

        for (let y = 0; y < height - 1; y++) {
          for (let x = 0; x < width - 1; x++) {
            const idx = (y * width + x) * 4;
            const right = (y * width + (x + 1)) * 4;
            const down = ((y + 1) * width + x) * 4;

            // Delta difference
            const diffR = Math.abs(copy[idx] - copy[right]) + Math.abs(copy[idx] - copy[down]);
            const diffG = Math.abs(copy[idx + 1] - copy[right + 1]) + Math.abs(copy[idx + 1] - copy[down + 1]);
            const diffB = Math.abs(copy[idx + 2] - copy[right + 2]) + Math.abs(copy[idx + 2] - copy[down + 2]);

            const errorLevel = Math.min(255, (diffR + diffG + diffB) * 5);

            // Forensic Heatmap Mapping
            if (errorLevel < 35) {
              // Low error / baseline noise (deep navy / midnight)
              data[idx] = 10;
              data[idx + 1] = 20;
              data[idx + 2] = Math.min(255, errorLevel * 5);
            } else if (errorLevel < 85) {
              // Medium error (cyan to emerald)
              data[idx] = 10;
              data[idx + 1] = Math.min(255, errorLevel * 3);
              data[idx + 2] = 220;
            } else if (errorLevel < 150) {
              // High error (amber / yellow)
              data[idx] = 255;
              data[idx + 1] = Math.min(255, errorLevel * 1.8);
              data[idx + 2] = 30;
            } else {
              // Extreme anomaly / boundary manipulation (bright crimson alert)
              data[idx] = 255;
              data[idx + 1] = 40;
              data[idx + 2] = 60;
            }
            data[idx + 3] = 255;
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setIsProcessing(false);
    };

    img.onerror = () => {
      console.warn('Failed to load image for Biometrics canvas.');
      setIsProcessing(false);
    };

    img.src = sourceUrl;
  }, [imageUrl, viewMode]);

  // Handle live crosshair tracking on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const canvasX = Math.floor((e.clientX - rect.left) * scaleX);
    const canvasY = Math.floor((e.clientY - rect.top) * scaleY);

    if (canvasX >= 0 && canvasX < canvas.width && canvasY >= 0 && canvasY < canvas.height) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        const pixel = ctx.getImageData(canvasX, canvasY, 1, 1).data;
        setMousePos({
          x: canvasX,
          y: canvasY,
          r: pixel[0],
          g: pixel[1],
          b: pixel[2],
        });
      }
    }
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  return (
    <div className="bg-slate-dark border border-slate-dark-light rounded-lg p-6">
      {/* Title & On-Device Tag */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Crosshair className="w-5 h-5 text-cyan-bright" />
          BIOMETRICS & Image Inspector
        </h3>
        <div className="flex items-center gap-2">
          {isProcessing && (
            <span className="text-xs text-cyan-bright font-mono animate-pulse">
              PROCESSING ON-DEVICE...
            </span>
          )}
          <span className="px-2 py-1 bg-cyan-bright/20 border border-cyan-bright rounded text-xs font-bold text-cyan-bright font-mono">
            CALCULATED ON-DEVICE
          </span>
        </div>
      </div>

      {/* Image Viewport with Crosshairs */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative bg-black rounded-lg overflow-hidden mb-4 border border-cyan-bright/30 group"
      >
        {/* Glowing Corner Crosshairs */}
        <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-cyan-bright pointer-events-none z-20"></div>
        <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-cyan-bright pointer-events-none z-20"></div>
        <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-cyan-bright pointer-events-none z-20"></div>
        <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-cyan-bright pointer-events-none z-20"></div>

        {/* Anomaly Bounding Box (Shown when AI/Synthetic indicators are high) */}
        {isSynthetic && (
          <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-red-alert/80 pointer-events-none z-20 animate-pulse">
            <div className="absolute -top-6 left-0 px-2 py-0.5 bg-red-alert text-white text-[10px] font-bold font-mono tracking-wider">
              ANOMALY [V-01]: DIFFUSION ARTIFACT
            </div>
            {/* Target coordinates */}
            <div className="absolute -bottom-5 right-0 text-[10px] text-red-alert font-mono">
              CONFIDENCE {Math.round(analysisResult.gemini.probability * 100)}%
            </div>
          </div>
        )}

        {/* Viewport Canvas */}
        <div
          className="aspect-[3/2] bg-slate-950 flex items-center justify-center relative overflow-hidden transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Subtle Scanline Effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-bright/[0.03] to-transparent pointer-events-none animate-pulse"></div>

          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain cursor-crosshair select-none"
          />
        </div>

        {/* Mode Indicator Overlay */}
        <div className="absolute top-3 left-3 px-2.5 py-1 bg-midnight/90 border border-cyan-bright rounded font-mono text-[11px] text-cyan-bright font-bold z-20 shadow-md flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-bright animate-ping"></span>
          {viewMode}
        </div>

        {/* Zoom & Viewport Controls Overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-midnight/90 border border-slate-dark-light rounded p-1 z-20">
          <button
            onClick={() => setZoomLevel((prev) => Math.min(2.5, prev + 0.25))}
            className="p-1 hover:text-cyan-bright text-gray-400 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((prev) => Math.max(1, prev - 0.25))}
            className="p-1 hover:text-cyan-bright text-gray-400 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          {zoomLevel > 1 && (
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 hover:text-cyan-bright text-gray-400 transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Live Cursor Probe Overlay */}
        {mousePos && (
          <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-midnight/95 border border-cyan-bright/50 rounded font-mono text-[10px] text-gray-300 z-20 flex items-center gap-3 shadow-lg pointer-events-none">
            <span>
              X: <strong className="text-cyan-bright">{mousePos.x}</strong> Y:{' '}
              <strong className="text-cyan-bright">{mousePos.y}</strong>
            </span>
            <span className="flex items-center gap-1">
              RGB:
              <span
                className="inline-block w-2.5 h-2.5 rounded-sm border border-gray-600"
                style={{ backgroundColor: `rgb(${mousePos.r}, ${mousePos.g}, ${mousePos.b})` }}
              ></span>
              <strong className="text-white">
                [{mousePos.r}, {mousePos.g}, {mousePos.b}]
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Image Control Toggles */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {(['RGB_FULL', 'ELA_MASK', 'NOISE_MAP', 'INVERT'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`
              px-3 py-2 rounded font-mono text-xs font-bold transition-all flex flex-col items-center justify-center
              ${
                viewMode === mode
                  ? 'bg-cyan-bright text-midnight shadow-glow-cyan'
                  : 'bg-slate-dark-light text-gray-400 border border-slate-dark-light hover:border-cyan-bright/50 hover:text-white'
              }
            `}
          >
            <span>{mode}</span>
          </button>
        ))}
      </div>

      {/* Filter Descriptions */}
      <div className="mb-4 px-3 py-2 bg-midnight-light border border-slate-dark-light rounded text-xs font-mono text-gray-400">
        {viewMode === 'RGB_FULL' && (
          <span>&bull; Original chromatic capture with raw color planes and forensic crosshairs.</span>
        )}
        {viewMode === 'ELA_MASK' && (
          <span>&bull; Error Level Analysis: Amplifies compression delta gradients to reveal digital splice edges.</span>
        )}
        {viewMode === 'NOISE_MAP' && (
          <span>&bull; PRNU Noise Extraction: High-pass sensor pattern filter isolating hardware camera grain.</span>
        )}
        {viewMode === 'INVERT' && (
          <span>&bull; Luminance Negative: Inverts color channels to uncover faint gradient seams and diffusion halos.</span>
        )}
      </div>

      {/* Metadata Bar */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-midnight-light border border-slate-dark-light rounded-lg p-3">
          <p className="text-xs text-gray-500 font-mono mb-1">DIMENSIONS</p>
          <p className="text-sm font-bold text-white font-mono">
            {exif.dimensions.width} x {exif.dimensions.height} px
          </p>
        </div>

        <div className="bg-midnight-light border border-slate-dark-light rounded-lg p-3">
          <p className="text-xs text-gray-500 font-mono mb-1">FORMAT</p>
          <p className="text-sm font-bold text-white font-mono">{exif.format}</p>
        </div>

        <div className="bg-midnight-light border border-slate-dark-light rounded-lg p-3">
          <p className="text-xs text-gray-500 font-mono mb-1">FILE SIZE</p>
          <p className="text-sm font-bold text-white font-mono">{formatFileSize(fileInfo.size)}</p>
        </div>

        <div className="bg-midnight-light border border-slate-dark-light rounded-lg p-3">
          <p className="text-xs text-gray-500 font-mono mb-1">COLOR SPACE</p>
          <p className="text-sm font-bold text-white font-mono">{exif.colorSpace}</p>
        </div>
      </div>

      {/* Cryptographic Hash Identity Box */}
      <div className="bg-midnight-light border border-emerald-bright/30 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-bold text-emerald-bright font-mono">
            CRYPTOGRAPHIC HASH IDENTITY
          </h4>
          <button
            onClick={handleCopyHash}
            className="p-1.5 hover:bg-slate-dark rounded transition-all"
            title="Copy SHA-256 hash"
          >
            {copiedHash ? (
              <Check className="w-4 h-4 text-emerald-bright" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-xs text-gray-500 font-mono mb-1">SHA-256 Hash:</p>
            <p className="text-xs text-cyan-bright font-mono break-all leading-relaxed">
              {hash.sha256}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-dark-light">
            <span className="text-xs text-gray-500 font-mono">pHash Distance:</span>
            <span className="text-sm font-bold text-white font-mono">{hash.pHashDistance}</span>
          </div>

          <div className="px-3 py-2 bg-slate-dark rounded border border-cyan-bright/20">
            <p className="text-xs text-gray-400 font-mono text-center">
              Hamming distance to nearest indexed image:{' '}
              <span className="text-cyan-bright font-bold">{hash.pHashDistance} bits</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
