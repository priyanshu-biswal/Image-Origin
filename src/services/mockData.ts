import { AnalysisResult } from '../types';

// Mock data for test bench presets
export const mockPresets: AnalysisResult[] = [
  // Preset 1: AI Generated (Midjourney v6)
  {
    c2pa: {
      hasClaim: false,
      claimGenerator: 'None',
      signatureStatus: 'unsigned',
      certificateAuthority: 'N/A - Assertion Absent',
      tamperEvidence: 'Metadata Stripped at Export',
      actionChain: [],
      rawSize: 0,
    },
    exif: {
      dimensions: { width: 1200, height: 800 },
      format: 'PNG-32 RGBA',
      colorSpace: 'Display P3',
      camera: {
        make: 'Unknown',
        model: 'Unknown',
        software: 'Unknown',
      },
      exposure: {
        iso: 0,
        fNumber: 0,
        exposureTime: 0,
        focalLength: 0,
      },
      dateTime: new Date().toISOString(),
    },
    hash: {
      sha256: 'a7f3d9e8c2b4f1a6e9d8c7b5a4f3e2d1c0b9a8e7f6d5c4b3a2f1e0d9c8b7a6f5',
      md5: '5f4dcc3b5aa765d61d8327deb882cf99',
      pHashDistance: 8,
    },
    gemini: {
      probability: 0.942,
      confidence: 0.94,
      vectors: {
        lighting: 42,
        anatomy: 88,
        sensorNoise: 14,
        edgeGradient: 89,
      },
      verdict: 'Subject exhibits hyper-stylized specular flares, ungrounded focal falloff in the background, and a clean lack of sensor-level pattern noise. Edge gradient frequency analysis detected diffusion-model characteristics typical of Midjourney v6 generation. Cryptographic assertions are non-existent; no provenance chain found.',
      tokenUsage: {
        input: 256,
        output: 180,
        total: 436,
      },
      cost: 0.00018,
    },
    trustScore: 0.05,
    isSynthetic: true,
    fileInfo: {
      size: 1927680,
      mimeType: 'image/png',
      dimensions: { width: 1200, height: 800 },
    },
    telemetry: {
      steps: [
        { step: 1, name: 'Ingestion & MIME Parse', duration: 15, status: 'success' },
        { step: 2, name: 'C2PA JUMBF Box Parser', duration: 45, status: 'success' },
        { step: 3, name: 'pHash & PRNU Computation', duration: 72, status: 'success' },
        { step: 4, name: 'Gemini 1.5 Flash Vision Analysis', duration: 595, status: 'success' },
        { step: 5, name: 'Verdict Aggregation & JSON-LD', duration: 13, status: 'success' },
      ],
      totalLatency: 740,
      tokenUsage: {
        input: 256,
        output: 180,
        total: 436,
      },
      cost: 0.00018,
    },
    imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <radialGradient id="aiGlow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#9333ea" stop-opacity="0.8"/>
      <stop offset="40%" stop-color="#3b82f6" stop-opacity="0.6"/>
      <stop offset="80%" stop-color="#06b6d4" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#050814" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4"/>
      <stop offset="50%" stop-color="#ec4899"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="#050814"/>
  <rect width="1200" height="800" fill="url(#aiGlow)"/>
  <circle cx="600" cy="380" r="180" fill="none" stroke="url(#neonGrad)" stroke-width="6" opacity="0.85"/>
  <ellipse cx="540" cy="350" rx="25" ry="15" fill="#06b6d4" opacity="0.9"/>
  <ellipse cx="660" cy="350" rx="25" ry="15" fill="#ec4899" opacity="0.9"/>
  <path d="M 520 440 Q 600 500 680 440" stroke="#06b6d4" stroke-width="4" fill="none" opacity="0.8"/>
  <path d="M 300 200 L 900 200 L 800 600 L 400 600 Z" stroke="#3b82f6" stroke-width="1.5" stroke-dasharray="8,8" fill="none" opacity="0.4"/>
  <text x="600" y="700" font-family="monospace" font-size="28" fill="#a855f7" text-anchor="middle" font-weight="bold">AI GENERATED SYNTHETIC SUBJECT // MIDJOURNEY V6</text>
  <text x="600" y="740" font-family="monospace" font-size="16" fill="#64748b" text-anchor="middle">SPECULAR FLARES &bull; DIFFUSION NOISELESS LATENT SPACE</text>
</svg>
`)}`,
  },

  // Preset 2: C2PA Signed (Adobe Firefly)
  {
    c2pa: {
      hasClaim: true,
      claimGenerator: 'Adobe Firefly v1',
      signatureStatus: 'valid',
      certificateAuthority: 'DigiCert Content Authenticity',
      tamperEvidence: 'none',
      actionChain: [
        { action: 'created', software: 'Adobe Firefly', timestamp: new Date(Date.now() - 86400000).toISOString() },
        { action: 'edited', software: 'Photoshop 2024', timestamp: new Date().toISOString() },
      ],
      rawSize: 2048,
    },
    exif: {
      dimensions: { width: 1920, height: 1080 },
      format: 'JPEG',
      colorSpace: 'sRGB',
      camera: {
        make: 'Adobe',
        model: 'Firefly',
        software: 'Adobe Firefly 1.0',
      },
      exposure: {
        iso: 0,
        fNumber: 0,
        exposureTime: 0,
        focalLength: 0,
      },
      dateTime: new Date(Date.now() - 86400000).toISOString(),
    },
    hash: {
      sha256: 'b3c8f4e2d9a7b6f5c4e3d2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1',
      md5: '098f6bcd4621d373cade4e832627b4f6',
      pHashDistance: 3,
    },
    gemini: {
      probability: 0.89,
      confidence: 0.87,
      vectors: {
        lighting: 38,
        anatomy: 82,
        sensorNoise: 22,
        edgeGradient: 85,
      },
      verdict: 'Image shows clear signs of AI generation with diffusion model artifacts. However, a valid C2PA manifest is present with cryptographic signatures from DigiCert. The provenance chain indicates creation by Adobe Firefly and subsequent editing in Photoshop 2024. Digital signature validates content authenticity claims despite synthetic origin.',
      tokenUsage: {
        input: 268,
        output: 195,
        total: 463,
      },
      cost: 0.00019,
    },
    trustScore: 0.85,
    isSynthetic: true,
    fileInfo: {
      size: 2458624,
      mimeType: 'image/jpeg',
      dimensions: { width: 1920, height: 1080 },
    },
    telemetry: {
      steps: [
        { step: 1, name: 'Ingestion & MIME Parse', duration: 18, status: 'success' },
        { step: 2, name: 'C2PA JUMBF Box Parser', duration: 62, status: 'success' },
        { step: 3, name: 'pHash & PRNU Computation', duration: 85, status: 'success' },
        { step: 4, name: 'Gemini 1.5 Flash Vision Analysis', duration: 612, status: 'success' },
        { step: 5, name: 'Verdict Aggregation & JSON-LD', duration: 11, status: 'success' },
      ],
      totalLatency: 788,
      tokenUsage: {
        input: 268,
        output: 195,
        total: 463,
      },
      cost: 0.00019,
    },
    imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="60%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#skyGrad)"/>
  <polygon points="200,850 600,400 950,850" fill="#022c22" opacity="0.9"/>
  <polygon points="700,850 1150,320 1600,850" fill="#064e3b" opacity="0.95"/>
  <circle cx="960" cy="280" r="80" fill="#34d399" opacity="0.7"/>
  <rect x="1350" y="70" width="480" height="130" rx="16" fill="#0f172a" stroke="#10b981" stroke-width="3" opacity="0.95"/>
  <circle cx="1410" cy="135" r="28" fill="#10b981"/>
  <path d="M 1398 135 L 1406 143 L 1424 125" stroke="#050814" stroke-width="5" fill="none" stroke-linecap="round"/>
  <text x="1455" y="125" font-family="monospace" font-size="20" fill="#10b981" font-weight="bold">C2PA VALIDATED</text>
  <text x="1455" y="155" font-family="monospace" font-size="14" fill="#94a3b8">Adobe Firefly / DigiCert Signed</text>
  <text x="960" y="980" font-family="monospace" font-size="24" fill="#34d399" text-anchor="middle" font-weight="bold">AUTHENTIC PROVENANCE EMBEDDED JUMBF MANIFEST</text>
</svg>
`)}`,
  },

  // Preset 3: Metadata Stripped (Suspect)
  {
    c2pa: {
      hasClaim: false,
      claimGenerator: 'None',
      signatureStatus: 'unsigned',
      certificateAuthority: 'N/A - Assertion Absent',
      tamperEvidence: 'Metadata Stripped at Export',
      actionChain: [],
      rawSize: 0,
    },
    exif: {
      dimensions: { width: 2048, height: 1536 },
      format: 'JPEG',
      colorSpace: 'sRGB',
      camera: {
        make: 'Unknown',
        model: 'Unknown',
        software: 'Unknown',
      },
      exposure: {
        iso: 0,
        fNumber: 0,
        exposureTime: 0,
        focalLength: 0,
      },
      dateTime: new Date().toISOString(),
    },
    hash: {
      sha256: 'f9e8d7c6b5a4f3e2d1c0b9a8e7f6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8',
      md5: 'e10adc3949ba59abbe56e057f20f883e',
      pHashDistance: 12,
    },
    gemini: {
      probability: 0.73,
      confidence: 0.71,
      vectors: {
        lighting: 55,
        anatomy: 68,
        sensorNoise: 31,
        edgeGradient: 72,
      },
      verdict: 'Image exhibits moderate AI generation indicators with suspicious metadata removal. All EXIF camera data has been stripped, and no C2PA provenance exists. Edge patterns suggest potential post-processing or generation artifacts. The absence of sensor noise combined with missing metadata raises authenticity concerns.',
      tokenUsage: {
        input: 245,
        output: 168,
        total: 413,
      },
      cost: 0.00017,
    },
    trustScore: 0.15,
    isSynthetic: true,
    fileInfo: {
      size: 3145728,
      mimeType: 'image/jpeg',
      dimensions: { width: 2048, height: 1536 },
    },
    telemetry: {
      steps: [
        { step: 1, name: 'Ingestion & MIME Parse', duration: 22, status: 'success' },
        { step: 2, name: 'C2PA JUMBF Box Parser', duration: 38, status: 'success' },
        { step: 3, name: 'pHash & PRNU Computation', duration: 94, status: 'success' },
        { step: 4, name: 'Gemini 1.5 Flash Vision Analysis', duration: 578, status: 'success' },
        { step: 5, name: 'Verdict Aggregation & JSON-LD', duration: 9, status: 'success' },
      ],
      totalLatency: 741,
      tokenUsage: {
        input: 245,
        output: 168,
        total: 413,
      },
      cost: 0.00017,
    },
    imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <radialGradient id="alertGlow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#ef4444" stop-opacity="0.3"/>
      <stop offset="60%" stop-color="#1e1b4b" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="#020617" stop-opacity="1"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#alertGlow)"/>
  <line x1="100" y1="400" x2="1100" y2="400" stroke="#ef4444" stroke-width="1" stroke-dasharray="6,6" opacity="0.5"/>
  <line x1="600" y1="100" x2="600" y2="700" stroke="#ef4444" stroke-width="1" stroke-dasharray="6,6" opacity="0.5"/>
  <rect x="420" y="260" width="360" height="280" fill="none" stroke="#ef4444" stroke-width="3" stroke-dasharray="8,4"/>
  <text x="435" y="295" font-family="monospace" font-size="18" fill="#ef4444" font-weight="bold">SUSPECT: METADATA STRIPPED</text>
  <text x="600" y="680" font-family="monospace" font-size="22" fill="#f87171" text-anchor="middle" font-weight="bold">EXIF/C2PA ZERO-ASSERTION DETECTED</text>
  <text x="600" y="720" font-family="monospace" font-size="14" fill="#64748b" text-anchor="middle">PRNU NOISE RECOVERY REQUIRED &bull; TAMPER RISK HIGH</text>
</svg>
`)}`,
  },
];
