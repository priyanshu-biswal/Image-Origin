import { Router, Request, Response } from 'express';
import { analyzeImage } from '../services/gemini.js';
import { extractC2PAMetadata, extractEXIFMetadata } from '../services/metadata.js';
import { computeImageHash } from '../services/hash.js';
import { AnalysisResult, TelemetryStep } from '../types/index.js';

export const analyzeRouter = Router();

analyzeRouter.post('/', async (req: Request, res: Response) => {
  const startTime = Date.now();
  const telemetry: TelemetryStep[] = [];

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const imageBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;

    // Step 1: Ingestion & MIME Parse
    const step1Start = Date.now();
    const fileSize = imageBuffer.length;
    const step1Duration = Date.now() - step1Start;
    telemetry.push({
      step: 1,
      name: 'Ingestion & MIME Parse',
      duration: step1Duration,
      status: 'success',
    });

    // Step 2: C2PA JUMBF Box Parser
    const step2Start = Date.now();
    const c2paData = await extractC2PAMetadata(imageBuffer);
    const step2Duration = Date.now() - step2Start;
    telemetry.push({
      step: 2,
      name: 'C2PA JUMBF Box Parser',
      duration: step2Duration,
      status: 'success',
    });

    // Step 3: pHash & PRNU Computation
    const step3Start = Date.now();
    const hashData = await computeImageHash(imageBuffer);
    const exifData = await extractEXIFMetadata(imageBuffer);
    const step3Duration = Date.now() - step3Start;
    telemetry.push({
      step: 3,
      name: 'pHash & PRNU Computation',
      duration: step3Duration,
      status: 'success',
    });

    // Step 4: Gemini Flash Vision Analysis
    const step4Start = Date.now();
    const geminiAnalysis = await analyzeImage(imageBuffer, mimeType, exifData);
    const step4Duration = Date.now() - step4Start;
    telemetry.push({
      step: 4,
      name: 'Gemini Flash Vision Analysis',
      duration: step4Duration,
      status: 'success',
    });

    // Step 5: Verdict Aggregation & JSON-LD
    const step5Start = Date.now();
    const totalLatency = Date.now() - startTime;
    
    const isSynthetic = geminiAnalysis.probability >= 0.50;
    const hasCameraHardware = exifData.camera && exifData.camera.make !== 'Unknown';

    // Calculate trust score
    let trustScore = 0.05;
    if (c2paData.hasClaim) {
      trustScore = 0.90;
    } else if (!isSynthetic && hasCameraHardware) {
      trustScore = 0.95;
    } else if (!isSynthetic) {
      trustScore = 0.88;
    } else {
      trustScore = 0.05;
    }
    
    const result: AnalysisResult = {
      c2pa: c2paData,
      exif: exifData,
      hash: hashData,
      gemini: geminiAnalysis,
      trustScore,
      isSynthetic,
      fileInfo: {
        size: fileSize,
        mimeType,
        dimensions: exifData.dimensions || { width: 0, height: 0 },
      },
      telemetry: {
        steps: telemetry,
        totalLatency,
        tokenUsage: geminiAnalysis.tokenUsage,
        cost: geminiAnalysis.cost,
      },
      imageUrl: `data:${mimeType};base64,${imageBuffer.toString('base64')}`,
    };
    
    const step5Duration = Date.now() - step5Start;
    telemetry.push({
      step: 5,
      name: 'Verdict Aggregation & JSON-LD',
      duration: step5Duration,
      status: 'success',
    });

    res.json(result);
  } catch (error: any) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message,
      telemetry: {
        steps: telemetry,
        totalLatency: Date.now() - startTime,
      },
    });
  }
});
