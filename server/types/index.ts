export interface TelemetryStep {
  step: number;
  name: string;
  duration: number;
  status: 'success' | 'error';
}

export interface TokenUsage {
  input: number;
  output: number;
  total: number;
}

export interface GeminiAnalysis {
  probability: number;
  confidence: number;
  vectors: {
    lighting: number;
    anatomy: number;
    sensorNoise: number;
    edgeGradient: number;
  };
  verdict: string;
  tokenUsage: TokenUsage;
  cost: number;
}

export interface C2PAData {
  hasClaim: boolean;
  claimGenerator: string;
  signatureStatus: string;
  certificateAuthority: string;
  tamperEvidence: string;
  actionChain: Array<{
    action: string;
    software: string;
    timestamp: string;
  }>;
  rawSize: number;
}

export interface EXIFData {
  dimensions: {
    width: number;
    height: number;
  };
  format: string;
  colorSpace: string;
  camera: {
    make: string;
    model: string;
    software: string;
  };
  exposure: {
    iso: number;
    fNumber: number;
    exposureTime: number;
    focalLength: number;
  };
  dateTime: string;
}

export interface HashData {
  sha256: string;
  md5: string;
  pHashDistance: number;
}

export interface AnalysisResult {
  c2pa: C2PAData;
  exif: EXIFData;
  hash: HashData;
  gemini: GeminiAnalysis;
  trustScore: number;
  isSynthetic: boolean;
  fileInfo: {
    size: number;
    mimeType: string;
    dimensions: {
      width: number;
      height: number;
    };
  };
  telemetry: {
    steps: TelemetryStep[];
    totalLatency: number;
    tokenUsage: TokenUsage;
    cost: number;
  };
  imageUrl?: string;
}
