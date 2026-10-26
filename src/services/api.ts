import { AnalysisResult } from '../types';
import { mockPresets } from './mockData';

export async function analyzeImage(file: File): Promise<AnalysisResult> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/analyze', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const serverMessage = errorData?.message || errorData?.error || 'Unknown server error';
    throw new Error(serverMessage);
  }

  return await response.json();
}

export async function loadPresetSample(presetId: number): Promise<AnalysisResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const preset = mockPresets[presetId - 1];
  if (!preset) {
    throw new Error('Preset not found');
  }

  return preset;
}
