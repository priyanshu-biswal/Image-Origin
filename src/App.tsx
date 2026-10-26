import { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import { AnalysisResult } from './types';

function App() {
  const [activeNav, setActiveNav] = useState('scan');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="flex h-screen bg-midnight overflow-hidden">
      <Sidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <MainContent 
        analysisResult={analysisResult}
        setAnalysisResult={setAnalysisResult}
        isAnalyzing={isAnalyzing}
        setIsAnalyzing={setIsAnalyzing}
      />
    </div>
  );
}

export default App;
