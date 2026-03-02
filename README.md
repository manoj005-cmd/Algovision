
# AlgoVision - Interactive Algorithm Visualization Platform

A full-stack educational web application for learning data structures and algorithms through interactive visualizations, AI-powered insights, and knowledge testing.

## 🏗️ Architecture

This project is now separated into **Frontend** and **Backend**:

- **Frontend**: React + TypeScript + Vite (Port 3000)
- **Backend**: Node.js + Express + Google Gemini AI (Port 5000)

## 📁 Project Structure

```
project mini/
├── backend/                 # Backend API Server
│   ├── controllers/         # Request handlers
│   ├── middleware/          # Authentication middleware
│   ├── models/              # Data models
│   ├── routes/              # API routes
│   ├── services/            # Business logic & AI services
│   ├── server.js            # Express server entry point
│   ├── package.json         # Backend dependencies
│   └── .env                 # Backend environment variables
│
├── components/              # React components (Frontend)
├── services/                # Frontend API service
├── utils/                   # Helper functions
├── App.tsx                  # Root React component
├── package.json             # Frontend dependencies
└── .env.local               # Frontend environment variables
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local instance or MongoDB Atlas)
- **Google Gemini API Key** ([Get one here](https://ai.google.dev/))

### Installation & Setup

#### 1. Install Backend Dependencies

```powershell
cd backend
npm install
```

#### 2. Configure Backend

Update `backend/.env` with your credentials:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
JWT_SECRET=your_secure_jwt_secret
MONGODB_URI=mongodb://localhost:27017/algovision
PORT=5000
FRONTEND_URL=http://localhost:3000
```

#### 3. Install Frontend Dependencies

```powershell
cd ..
npm install
```

#### 4. Run Backend Server

```powershell
cd backend
npm run dev
```

Backend will start on: http://localhost:5000

#### 5. Run Frontend (New Terminal)

```powershell
npm run dev
```

Frontend will start on: http://localhost:3000

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account (@sode-edu.in emails only)
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### AI Services (Requires Authentication)
- `POST /api/ai/algorithm-suggestion` - Get AI algorithm recommendations
- `POST /api/ai/complexity-analysis` - Get complexity analysis
- `POST /api/ai/generate-video` - Generate video with Veo 3.1
- `POST /api/ai/chat` - AI chat responses

## 🔧 Tech Stack

### Frontend
- React 19.2.0, TypeScript 5.8.2, Vite 6.2.0
- Tailwind CSS, Chart.js, html2canvas, jsPDF

### Backend
- Node.js, Express 4.19, JWT, bcryptjs
- MongoDB, Mongoose 8.8.0
- Google Gemini AI 1.29.0 (Gemini 2.5 Flash + Veo 3.1)

## ✨ Features

1. **Algorithm Visualizer** - Step-by-step visualization of sorting & searching
2. **Complexity Analyzer** - Compare algorithm performance with AI insights
3. **Interactive Quiz** - 50+ questions with instant feedback
4. **AI Video Generation** - Create videos from images using Veo
5. **Export & Reporting** - PDF reports with analytics

## 🔐 Security

- JWT authentication with 7-day expiration
- Password hashing with bcrypt
- Email domain restriction
- CORS protection

## 🐛 Troubleshooting

**Backend won't start:**
- Check if port 5000 is available
- Verify GEMINI_API_KEY and MONGODB_URI in `backend/.env`
- Ensure MongoDB is running locally or accessible via your connection string

**Port already in use (EADDRINUSE):**
- Find and stop the process using port 5000:
  ```powershell
  Get-NetTCPConnection -LocalPort 5000 -State Listen | Format-Table -AutoSize LocalAddress,LocalPort,State,OwningProcess
  Stop-Process -Id <OwningProcessPID> -Force
  ```
- Alternatively, use a different port:
  ```powershell
  # Backend
  cd backend
  $env:PORT="5001"; npm run dev
  # Frontend (new terminal)
  $env:VITE_API_URL="http://localhost:5001"; npm run dev
  ```

**MongoDB error: "db already exists with different case" (Windows):**
- The server normalizes DB names to lowercase. If an uppercase DB exists, drop it:
  ```powershell
  mongosh
  show dbs
  use ALGOVISION
  db.dropDatabase()
  exit
  ```
- Set `MONGODB_URI=mongodb://localhost:27017/algovision` (lowercase) in `backend/.env`

**API calls failing:**
- Ensure backend is running on port 5000
- Check browser console for errors
- Clear localStorage if authentication fails
- Verify `VITE_API_URL` is set to base URL only (e.g., `http://localhost:5000`), not including `/api`

**Health check:**
- Verify server and DB status:
  ```powershell
  Invoke-RestMethod -UseBasicParsing http://localhost:5000/api/health | ConvertTo-Json -Depth 3
  ```
  Expect: `{ "status": "ok", "message": "AlgoVision Backend API is running", "db": "connected" }`

---

**Note**: Requires Google Gemini API key for AI features. Get yours at [Google AI Studio](https://ai.google.dev/)
