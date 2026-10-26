import { AnalysisResult } from '../types';
import TopBar from './TopBar';
import DropzoneSection from './DropzoneSection';
import BiometricsPanel from './BiometricsPanel';
import ProvenancePanel from './ProvenancePanel';
import GeminiAnalysisPanel from './GeminiAnalysisPanel';
import ObservabilityDrawer from './ObservabilityDrawer';

interface MainContentProps {
  analysisResult: AnalysisResult | null;
  setAnalysisResult: (result: AnalysisResult | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export default function MainContent({ 
  analysisResult, 
  setAnalysisResult,
  isAnalyzing,
  setIsAnalyzing
}: MainContentProps) {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <TopBar analysisResult={analysisResult} />
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Dropzone Section */}
        <DropzoneSection 
          setAnalysisResult={setAnalysisResult}
          isAnalyzing={isAnalyzing}
          setIsAnalyzing={setIsAnalyzing}
        />

        {/* Analysis Results */}
        {analysisResult && (
          <>
            {/* Biometrics & Provenance Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BiometricsPanel analysisResult={analysisResult} />
              <ProvenancePanel analysisResult={analysisResult} />
            </div>

            {/* Gemini Analysis Panel */}
            <GeminiAnalysisPanel analysisResult={analysisResult} />

            {/* Observability Drawer */}
            <ObservabilityDrawer analysisResult={analysisResult} />
          </>
        )}
      </div>
    </div>
  );
}
