import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { analyzeRouter } from './routes/analyze.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '2.4.0' });
});

// Analysis endpoint
app.use('/api/analyze', upload.single('image'), analyzeRouter);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 VerifyAI Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
