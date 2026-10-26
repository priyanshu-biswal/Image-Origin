import { useState, useRef } from 'react';
import { Upload, Sparkles, FileCheck, AlertTriangle, CloudUpload } from 'lucide-react';
import { AnalysisResult } from '../types';
import { analyzeImage, loadPresetSample } from '../services/api';

interface DropzoneSectionProps {
  setAnalysisResult: (result: AnalysisResult | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export default function DropzoneSection({ 
  setAnalysisResult, 
  isAnalyzing, 
  setIsAnalyzing 
}: DropzoneSectionProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true);
    try {
      const imageUrl = URL.createObjectURL(file);
      const result = await analyzeImage(file);
      result.imageUrl = imageUrl;
      setAnalysisResult(result);
    } catch (error: any) {
      console.error('Analysis failed:', error);
      
      // Show more helpful error message
      const errorMsg = error.message || 'Failed to analyze image';
      
      if (errorMsg.includes('API key') || errorMsg.includes('401') || errorMsg.includes('403')) {
        alert('⚠️ Gemini API Key Error\n\n' +
              'Your API key is invalid or not configured.\n\n' +
              '1. Go to: https://aistudio.google.com/app/apikey\n' +
              '2. Create an API key (starts with "AIza")\n' +
              '3. Add it to the .env file\n' +
              '4. Restart the server\n\n' +
              'For now, try clicking the "Sample 1", "Sample 2", or "Sample 3" buttons - they work without an API key!');
      } else {
        alert('Image Analysis Error:\n\n' + errorMsg);
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handlePresetClick = async (presetId: number) => {
    setIsAnalyzing(true);
    try {
      const result = await loadPresetSample(presetId);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Failed to load preset:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCustomUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-slate-dark border border-slate-dark-light rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Input & Test Bench Presets</h3>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-emerald-bright/20 border border-emerald-bright rounded text-xs font-bold text-emerald-bright font-mono">
            C2PA V1.3
          </span>
          <span className="px-2 py-1 bg-cyan-bright/20 border border-cyan-bright rounded text-xs font-bold text-cyan-bright font-mono">
            CAWG COMPLIANT
          </span>
          <span className="px-2 py-1 bg-blue-electric/20 border border-blue-electric rounded text-xs font-bold text-blue-electric font-mono">
            SHA-256 VALIDATED
          </span>
        </div>
      </div>

      {/* Dropzone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-12 text-center transition-all cursor-pointer
          ${isDragging 
            ? 'border-cyan-bright bg-cyan-bright/10 shadow-glow-cyan' 
            : 'border-cyan-bright/30 hover:border-cyan-bright/60 hover:bg-slate-dark-light'
          }
        `}
        onClick={handleCustomUpload}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <CloudUpload className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-cyan-bright' : 'text-gray-500'}`} />
        
        <h4 className="text-xl font-bold text-white mb-2">
          Drop image or sample C2PA file to verify authenticity
        </h4>
        <p className="text-gray-400 text-sm font-mono">
          Supports JPEG, PNG, WEBP, AVIF, TIFF with embedded JUMBF C2PA manifests
        </p>

        {isAnalyzing && (
          <div className="mt-4">
            <div className="inline-block px-4 py-2 bg-cyan-bright/20 border border-cyan-bright rounded-lg">
              <span className="text-cyan-bright font-mono text-sm animate-pulse-glow">
                ⚡ Analyzing with Gemini Flash...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Test Bench Presets */}
      <div className="mt-6">
        <p className="text-sm text-gray-400 mb-3 font-medium">TEST BENCH PRESETS:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={() => handlePresetClick(1)}
            disabled={isAnalyzing}
            className="flex items-center gap-3 p-4 bg-slate-dark-light border border-purple-500/30 rounded-lg hover:border-purple-500 hover:bg-slate-dark transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <div>
              <p className="text-sm font-bold text-white">Sample 1:</p>
              <p className="text-xs text-gray-400">AI Generated (Midjourney v6)</p>
            </div>
          </button>

          <button
            onClick={() => handlePresetClick(2)}
            disabled={isAnalyzing}
            className="flex items-center gap-3 p-4 bg-slate-dark-light border border-emerald-bright/30 rounded-lg hover:border-emerald-bright hover:bg-slate-dark transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileCheck className="w-5 h-5 text-emerald-bright" />
            <div>
              <p className="text-sm font-bold text-white">Sample 2:</p>
              <p className="text-xs text-gray-400">C2PA Signed (Adobe Firefly)</p>
            </div>
          </button>

          <button
            onClick={() => handlePresetClick(3)}
            disabled={isAnalyzing}
            className="flex items-center gap-3 p-4 bg-slate-dark-light border border-red-alert/30 rounded-lg hover:border-red-alert hover:bg-slate-dark transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <AlertTriangle className="w-5 h-5 text-red-alert" />
            <div>
              <p className="text-sm font-bold text-white">Sample 3:</p>
              <p className="text-xs text-gray-400">Metadata Stripped (Suspect)</p>
            </div>
          </button>

          <button
            onClick={handleCustomUpload}
            disabled={isAnalyzing}
            className="flex items-center gap-3 p-4 bg-slate-dark-light border border-cyan-bright/30 rounded-lg hover:border-cyan-bright hover:bg-slate-dark transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-5 h-5 text-cyan-bright" />
            <div>
              <p className="text-sm font-bold text-white">Upload Custom</p>
              <p className="text-xs text-gray-400">Your own file</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
