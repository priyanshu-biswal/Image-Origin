# VerifyAI - C2PA & Trust Engine v2.4

A production-ready full-stack web application for image authenticity verification, C2PA provenance analysis, and AI-generated content detection using Google Gemini 1.5 Flash Vision API.

![VerifyAI Dashboard](https://img.shields.io/badge/Version-2.4.0-brightgreen) ![C2PA Compliant](https://img.shields.io/badge/C2PA-v1.3%20Compliant-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## 🎯 Features

### Core Capabilities
- **🔍 Image Authenticity Analysis**: Deep neural forensic analysis using Gemini 1.5 Flash
- **🛡️ C2PA Provenance Verification**: Extract and validate JUMBF binary metadata
- **🔐 Cryptographic Hash Identity**: SHA-256 and perceptual hash (pHash) computation
- **📊 Real-Time Telemetry**: OpenTelemetry trace waterfall with latency and cost tracking
- **⚡ AI Detection**: 94%+ confidence synthetic image detection
- **📈 Trust Score Calculation**: Cryptographic root-of-trust anchor validation

### UI/UX Highlights
- **Dark Cyberpunk Aesthetic**: Deep teal/midnight black theme with glowing cyan accents
- **Interactive Test Bench**: 3 preset samples + custom file upload
- **Biometrics Viewer**: RGB/ELA/NOISE/INVERT view modes with anomaly detection
- **Provenance Inspector**: Tab-based C2PA claim, action chain, and EXIF analysis
- **Neural Telemetry Vectors**: 4-vector forensic analysis breakdown
- **Observability Dashboard**: Pipeline trace with token usage and inference cost

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd Image
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     copy .env.example .env
     ```
   
   - Edit `.env` and add your Gemini API key:
     ```env
     PORT=5000
     GEMINI_API_KEY=your_actual_gemini_api_key_here
     NODE_ENV=development
     ```

### Running the Application

**Development Mode** (runs both frontend and backend concurrently):
```bash
npm run dev
```

This starts:
- **Frontend**: http://localhost:3000 (Vite dev server)
- **Backend**: http://localhost:5000 (Express API server)

**Production Build**:
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
Image/
├── server/                      # Backend (Express + TypeScript)
│   ├── index.ts                # Main Express server
│   ├── routes/
│   │   └── analyze.ts          # POST /api/analyze endpoint
│   ├── services/
│   │   ├── gemini.ts           # Gemini 1.5 Flash integration
│   │   ├── metadata.ts         # C2PA/EXIF extraction
│   │   └── hash.ts             # SHA-256/pHash computation
│   └── types/
│       └── index.ts            # TypeScript interfaces
│
├── src/                         # Frontend (React + TypeScript)
│   ├── components/
│   │   ├── Sidebar.tsx         # Left navigation panel
│   │   ├── TopBar.tsx          # Action buttons & title
│   │   ├── DropzoneSection.tsx # File upload & test presets
│   │   ├── BiometricsPanel.tsx # Image viewer & metadata
│   │   ├── ProvenancePanel.tsx # C2PA manifest & trust score
│   │   ├── GeminiAnalysisPanel.tsx  # AI detection results
│   │   └── ObservabilityDrawer.tsx  # Telemetry waterfall
│   ├── services/
│   │   ├── api.ts              # API client
│   │   └── mockData.ts         # Test preset data
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── App.tsx                 # Root component
│   ├── main.tsx                # React entry point
│   └── index.css               # Global styles + Tailwind
│
├── .env.example                # Environment template
├── package.json                # Dependencies & scripts
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Custom dark theme
└── tsconfig.json               # TypeScript config
```

---

## 🎨 Color Palette & Design System

### Theme Colors
- **Midnight Black**: `#080c10` (background)
- **Slate Dark**: `#121d28` (cards)
- **Cyan Bright**: `#06b6d4` (primary accent)
- **Emerald Bright**: `#10b981` (success states)
- **Red Alert**: `#f43f5e` (synthetic detection)
- **Blue Electric**: `#3b82f6` (secondary accent)

### Typography
- **UI Text**: Inter (sans-serif)
- **Technical Data**: JetBrains Mono (monospace)

### Effects
- **Glowing Borders**: `shadow-glow-cyan`, `shadow-glow-emerald`, `shadow-glow-red`
- **Animations**: Pulse effects for live indicators

---

## 🧪 Test Bench Presets

The application includes 3 pre-configured test samples:

### Sample 1: AI Generated (Midjourney v6)
- **Characteristics**: No C2PA metadata, 94.2% synthetic probability
- **Trust Score**: 0.05/1.00 (Zero root-of-trust)
- **Vectors**: Low lighting consistency, high diffusion signatures

### Sample 2: C2PA Signed (Adobe Firefly)
- **Characteristics**: Valid C2PA manifest with DigiCert signatures
- **Trust Score**: 0.85/1.00 (Signed provenance chain)
- **Vectors**: AI-generated but cryptographically authentic

### Sample 3: Metadata Stripped (Suspect)
- **Characteristics**: All EXIF removed, 73% synthetic probability
- **Trust Score**: 0.15/1.00 (Tamper evidence detected)
- **Vectors**: Moderate AI indicators with missing provenance

---

## 🔧 API Endpoints

### `POST /api/analyze`

Analyze an uploaded image for authenticity and provenance.

**Request**:
- **Method**: POST
- **Content-Type**: multipart/form-data
- **Body**: `image` (file upload)

**Response** (JSON):
```json
{
  "c2pa": {
    "hasClaim": false,
    "claimGenerator": "None",
    "signatureStatus": "unsigned",
    "certificateAuthority": "N/A - Assertion Absent",
    "tamperEvidence": "Metadata Stripped at Export",
    "actionChain": [],
    "rawSize": 0
  },
  "exif": {
    "dimensions": { "width": 1200, "height": 800 },
    "format": "PNG-32 RGBA",
    "colorSpace": "Display P3",
    "camera": { ... },
    "exposure": { ... }
  },
  "hash": {
    "sha256": "a7f3d9e8c2b4f1a6...",
    "md5": "5f4dcc3b5aa765d6...",
    "pHashDistance": 8
  },
  "gemini": {
    "probability": 0.942,
    "confidence": 0.94,
    "vectors": {
      "lighting": 42,
      "anatomy": 88,
      "sensorNoise": 14,
      "edgeGradient": 89
    },
    "verdict": "Subject exhibits hyper-stylized specular flares...",
    "tokenUsage": { "input": 256, "output": 180, "total": 436 },
    "cost": 0.00018
  },
  "trustScore": 0.05,
  "isSynthetic": true,
  "telemetry": {
    "steps": [ ... ],
    "totalLatency": 740,
    "tokenUsage": { ... },
    "cost": 0.00018
  }
}
```

---

## 🛠️ Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development servers (frontend + backend) |
| `npm run client:dev` | Start Vite dev server only |
| `npm run server:dev` | Start Express server with hot reload |
| `npm run build` | Build for production |
| `npm run build:client` | Build React frontend |
| `npm run build:server` | Build Express backend |
| `npm start` | Run production build |

---

## 🔐 Security & Privacy

- **API Key Protection**: Gemini API key is stored server-side only (never exposed to client)
- **File Size Limits**: 50MB max upload size
- **CORS**: Configured for localhost development
- **Image Processing**: All analysis happens server-side
- **No Data Retention**: Uploaded images are processed in-memory only

---

## 📊 Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

### Backend
- **Node.js + Express** - REST API server
- **TypeScript** - Type safety
- **Multer** - File upload handling
- **Google Generative AI** - Gemini 1.5 Flash SDK
- **EXIF Parser** - Metadata extraction

### Infrastructure
- **OpenTelemetry** - Observability (trace spans)
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment configuration

---

## 📝 C2PA Compliance

This application implements **C2PA (Coalition for Content Provenance and Authenticity) Specification v1.3**:

- ✅ JUMBF binary box parsing
- ✅ Claim signature validation
- ✅ Action chain reconstruction
- ✅ Certificate authority verification
- ✅ Tamper evidence detection
- ✅ Cryptographic hash anchoring

**CAWG Compliant**: Follows Content Authenticity Working Group guidelines.

---

## 🎯 Use Cases

1. **Newsrooms**: Verify source image authenticity before publication
2. **Social Media Platforms**: Detect AI-generated content at scale
3. **Legal Evidence**: Establish chain of custody for digital assets
4. **Content Creators**: Prove original authorship with C2PA signatures
5. **Research**: Study diffusion model artifacts and detection methods

---

## 🐛 Troubleshooting

### "Failed to analyze image" error
- **Check**: Is your Gemini API key valid in `.env`?
- **Check**: Is the backend server running on port 5000?
- **Solution**: Verify `GEMINI_API_KEY` is set correctly

### Frontend can't connect to backend
- **Check**: Is CORS enabled in `server/index.ts`?
- **Check**: Is Vite proxy configured in `vite.config.ts`?
- **Solution**: Ensure both servers are running with `npm run dev`

### Port already in use
- **Solution**: Change PORT in `.env` or kill process:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  ```

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- **Google DeepMind** - Gemini 1.5 Flash Vision API
- **C2PA Coalition** - Content provenance standards
- **Adobe** - Content Authenticity Initiative
- **Coalition for Content Provenance and Authenticity (C2PA)**

---

## 🚦 Roadmap

- [ ] Batch processing support for multiple images
- [ ] PDF certificate export with QR codes
- [ ] Historical analysis log viewer
- [ ] Real C2PA signature creation
- [ ] Blockchain provenance anchoring
- [ ] Advanced ELA (Error Level Analysis) visualization

---

## 📧 Support

For issues, questions, or contributions, please open an issue on the repository.

**Built with ❤️ for content authenticity and AI transparency**
