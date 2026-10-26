import crypto from 'crypto';
import { HashData } from '../types/index.js';

export async function computeImageHash(imageBuffer: Buffer): Promise<HashData> {
  // Compute SHA-256 hash
  const sha256 = crypto.createHash('sha256').update(imageBuffer).digest('hex');
  
  // Compute MD5 hash (for compatibility)
  const md5 = crypto.createHash('md5').update(imageBuffer).digest('hex');
  
  // Simulate perceptual hash (pHash) distance
  // In production, use an actual pHash library
  const pHashDistance = Math.floor(Math.random() * 15);
  
  return {
    sha256,
    md5,
    pHashDistance,
  };
}
