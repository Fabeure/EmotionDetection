# Emotion Tracker - Comprehensive Emotion-Driven Analytics System

<div align="center">

![Emotion Tracker](https://img.shields.io/badge/Emotion-Tracker-blue?style=for-the-badge&logo=emotion)
![Unity](https://img.shields.io/badge/Unity-2021%2B-black?style=for-the-badge&logo=unity)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![NestJS](https://img.shields.io/badge/NestJS-API-red?style=for-the-badge&logo=nestjs)
![Python](https://img.shields.io/badge/Python-3.8%2B-green?style=for-the-badge&logo=python)

**A complete emotion-driven analytics platform for Unity experiences, featuring real-time emotion detection, comprehensive data logging, and powerful visualization dashboards.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](http://makeapullrequest.com)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Components](#-components)
  - [Unity Plugin](#unity-plugin)
  - [Emotion Detection Model](#emotion-detection-model)
  - [Dashboard Backend](#dashboard-backend)
  - [Dashboard Frontend](#dashboard-frontend)
- [Quick Start](#-quick-start)
- [Installation & Setup](#-installation--setup)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Support](#-support)
- [License](#-license)

---

## 🎯 Overview

Emotion Tracker is a comprehensive, end-to-end solution for capturing, analyzing, and visualizing emotional responses in Unity-based experiences. This system enables developers, researchers, and UX designers to understand how users emotionally engage with interactive content, providing valuable insights for adaptive gameplay, user experience optimization, and research applications.

### Key Features

- **🔍 Real-time Emotion Detection**: Advanced ML-powered emotion recognition using TensorFlow Lite
- **🎮 Unity Integration**: Seamless plugin for emotion-driven gameplay and analytics
- **📊 Comprehensive Dashboard**: Rich visualizations and analytics for emotion data
- **🔐 Secure Authentication**: JWT-based user management and session control
- **📈 Advanced Analytics**: Heatmaps, trend analysis, and statistical insights
- **🌙 Dark Mode Support**: Modern, responsive UI with theme switching
- **📱 Cross-Platform**: Works on desktop and mobile devices

### Use Cases

- **🎮 Adaptive Gaming**: Dynamic difficulty adjustment based on player emotions
- **🔬 UX Research**: Emotional response analysis for interface design
- **📊 Analytics**: Post-launch engagement and emotional pattern analysis
- **♿ Accessibility**: Emotion-aware interfaces and interactions
- **🎓 Academic Research**: Psychological and behavioral studies

---

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Unity Plugin  │    │  Emotion Model  │    │   Dashboard     │
│                 │    │                 │    │                 │
│ • EmotionMgr    │◄──►│ • TensorFlow    │◄──►│ • Backend API   │
│ • Stimuli       │    │ • OpenCV        │    │ • Frontend UI   │
│ • Logging       │    │ • MediaPipe     │    │ • Analytics     │
│ • TrackableObj  │    │ • Socket Stream │    │ • Auth          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Database                             │
│  • User Sessions  • Emotion Data  • Stimuli Logs  • Analytics  │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Unity Plugin** captures user interactions and stimuli events
2. **Emotion Model** processes video feed and detects emotions in real-time
3. **Backend API** receives and stores emotion data and session information
4. **Frontend Dashboard** visualizes analytics and provides user interface
5. **MongoDB** serves as the central data store for all components

---

## 🧩 Components

### Unity Plugin

**Location**: `Unity Plugin/`

A comprehensive Unity toolkit that transforms emotion detection into a plug-and-play gameplay layer. This plugin provides real-time emotion processing, multi-modal stimulus detection, and flexible logging capabilities.

**GitHub Repository**: [AyyyCn/EmotionDriven](https://github.com/AyyyCn/EmotionDriven)

#### Key Features

- **Real-time Emotion Processing**: Configurable confidence thresholds and emotion mapping
- **Multi-modal Stimulus Detection**: Visual, Audio, Proximity, and Custom stimuli types
- **Flexible Logging System**: JSON, MongoDB, and API endpoint support
- **Designer-friendly Tools**: Editor windows for scene setup and data management
- **Extensible Architecture**: Custom emotion adapters and stimuli support

#### Core Components

```
Runtime/
├── EmotionManager.cs          # Central emotion processing hub
├── UdpEmotionReceiver.cs      # UDP socket communication
├── Logger/                    # Data logging system
│   ├── EmotionLogger.cs
│   └── StimulusLogger.cs
├── Stimuli/                   # Stimulus detection system
│   ├── StimulusBase.cs
│   ├── VisualStimulus.cs
│   ├── AudioStimulus.cs
│   ├── ProximityStimulus.cs
│   ├── TrackableObject.cs
│   └── TrackableCategory.cs
└── Utils/                     # Utility classes
    ├── EmotionAdapterBase.cs
    ├── EmotionEvents.cs
    ├── MoodService.cs
    └── SceneGuidCache.cs
```

#### Editor Tools

```
Editor/
├── EmotionSetupWizard.cs      # Guided scene setup
├── EmotionSessionLoggerWindow.cs  # Session management
├── CategoryManagerWindow.cs   # Stimulus categorization
├── TrackableObjectExporterWindow.cs  # Data export
└── TrackableCleaner.cs        # Cleanup utilities
```

#### Installation

1. Import the `.unitypackage` file into your Unity project
2. Use the Setup Wizard (`Tools → Emotion-Driven → Setup Wizard…`)
3. Configure UDP receiver for emotion data
4. Add TrackableObjects to your game objects
5. Start logging sessions

**Requirements**: Unity 2021 LTS+, .NET Standard 2.1

---

### Emotion Detection Model

**Location**: `Model/`

A Python-based emotion detection system using TensorFlow Lite and MediaPipe for real-time facial emotion recognition. This component processes video feeds and streams emotion data to the Unity plugin.

**GitHub Repository**: [Hama26/emotion_detection](https://github.com/Hama26/emotion_detection)

#### Key Features

- **Real-time Processing**: Live emotion detection from webcam feeds
- **TensorFlow Lite**: Optimized ML model for performance
- **MediaPipe Integration**: Advanced face detection and tracking
- **Socket Streaming**: Real-time data transmission to Unity
- **Multiple Emotion Classes**: Comprehensive emotion classification

#### Core Files

```
Model/
├── emotion_app.py             # Main application entry point
├── emotion_detector.py        # Core emotion detection logic
├── socket_streamer.py         # Real-time data streaming
├── emotion_mobilenet_v2.tflite # Pre-trained emotion model
├── haarcascade_frontalface_default.xml  # Face detection
├── model.h5                   # Keras model weights
├── requirements.txt           # Python dependencies
└── README.md                  # Detailed setup instructions
```

#### Supported Emotions

- 😊 Happiness
- 😢 Sadness
- 😠 Anger
- 😨 Fear
- 😲 Surprise
- 😐 Neutral
- 😞 Disgust

#### Setup

```bash
# Install dependencies
pip install -r requirements.txt

# Run the application
python emotion_app.py
```

**Requirements**: Python 3.8+, TensorFlow, OpenCV, MediaPipe

---

### Dashboard Backend

**Location**: `Dashboard/backend/`

A NestJS-based REST API that handles authentication, session management, and data storage for the emotion tracking system. This backend provides secure endpoints for the frontend dashboard and Unity plugin integration.

#### Key Features

- **JWT Authentication**: Secure user management and session control
- **Session Management**: Comprehensive emotion session data handling
- **Trackable Objects**: Stimulus and object management system
- **MongoDB Integration**: Scalable data storage and retrieval
- **RESTful API**: Clean, documented API endpoints
- **Swagger Documentation**: Interactive API documentation

#### Core Modules

```
src/
├── auth/                      # Authentication system
│   ├── auth.controller.ts     # Login/register endpoints
│   ├── auth.service.ts        # JWT token management
│   ├── jwt.strategy.ts        # JWT validation
│   └── local.strategy.ts      # Local authentication
├── sessions/                  # Session management
│   ├── sessions.controller.ts # Session CRUD operations
│   ├── sessions.service.ts    # Session business logic
│   └── schemas/session.schema.ts  # MongoDB schema
├── trackable-objects/         # Stimulus management
│   ├── trackable-objects.controller.ts
│   ├── trackable-objects.service.ts
│   └── schemas/trackable-object.schema.ts
├── users/                     # User management
│   └── schemas/user.schema.ts
└── config/                    # Configuration management
    └── configuration.ts
```

#### API Endpoints

| Method | Endpoint             | Description            | Auth Required |
| ------ | -------------------- | ---------------------- | ------------- |
| POST   | `/auth/register`     | User registration      | No            |
| POST   | `/auth/login`        | User authentication    | No            |
| GET    | `/sessions`          | Get user sessions      | Yes           |
| POST   | `/sessions/upload`   | Upload session data    | Yes           |
| GET    | `/sessions/:id`      | Get specific session   | Yes           |
| GET    | `/trackable-objects` | Get stimuli objects    | Yes           |
| POST   | `/trackable-objects` | Create stimulus object | Yes           |

#### Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run start:dev
```

**Requirements**: Node.js 16+, MongoDB

---

### Dashboard Frontend

**Location**: `Dashboard/frontend/`

A modern React-based dashboard for visualizing emotion analytics and managing emotion tracking sessions. This frontend provides an intuitive interface for researchers, developers, and analysts to understand emotional data patterns.

#### Key Features

- **Real-time Analytics**: Live emotion tracking and visualization
- **Interactive Charts**: Comprehensive data visualization suite
- **Session Management**: View and analyze emotion sessions
- **Dark Mode Support**: Theme switching capability
- **Responsive Design**: Mobile and desktop optimized
- **Data Export**: Export analytics and session data

#### Core Components

```
src/
├── components/                # Reusable UI components
│   ├── navbar/               # Navigation and user controls
│   ├── sidebar/              # Menu and navigation
│   ├── overview/             # Dashboard summary
│   ├── statistics/           # Statistical analysis
│   ├── visualizations/       # Charts and graphs
│   │   ├── EmotionDistribution.jsx
│   │   ├── Heatmap.jsx
│   │   ├── TimeTrends.jsx
│   │   ├── ValenceArousal.jsx
│   │   └── StimulusAnalysis.jsx
│   ├── RawLogs/              # Session data display
│   └── widget/               # Reusable widgets
├── pages/                    # Page components
│   ├── home/                 # Dashboard overview
│   ├── login/                # Authentication
│   └── sessions/             # Session management
├── context/                  # React context providers
│   ├── darkModeContext.jsx
│   └── darkModeReducer.jsx
└── data/                     # Static data and utilities
    └── dummyData.js
```

#### Visualization Types

- **Emotion Distribution**: Pie charts showing emotion frequency
- **Heatmaps**: Spatial analysis of emotional responses
- **Time Trends**: Temporal patterns and trends
- **Valence-Arousal**: 2D emotion space visualization
- **Stimulus Analysis**: Correlation between stimuli and emotions

#### Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start development server
npm run dev
```

**Requirements**: Node.js 16+, Modern web browser

---

## 🚀 Quick Start

### Prerequisites

- **Unity 2021 LTS or newer**
- **Node.js 16+**
- **Python 3.8+**
- **MongoDB 4.4+**
- **Webcam** (for emotion detection)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Emotion-Tracker
```

### 2. Set Up the Backend

```bash
cd Dashboard/backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run start:dev
```

### 3. Set Up the Frontend

```bash
cd Dashboard/frontend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 4. Set Up the Emotion Model

```bash
cd Model
pip install -r requirements.txt
python emotion_app.py
```

### 5. Import Unity Plugin

1. Open your Unity project
2. Import the `Unity Plugin/emotiondriven.unitypackage`
3. Use the Setup Wizard to configure your scene
4. Add TrackableObjects to your game objects

### 6. Access the Dashboard

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api

---

## 📦 Installation & Setup

### Detailed Backend Setup

1. **Install MongoDB**

   ```bash
   # Ubuntu/Debian
   sudo apt-get install mongodb

   # macOS
   brew install mongodb-community

   # Windows
   # Download from https://www.mongodb.com/try/download/community
   ```

2. **Configure Environment Variables**

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/emotion-tracker
   JWT_SECRET=your-super-secret-key-change-this-in-production
   JWT_EXPIRES_IN=1d
   ```

3. **Start the Backend**
   ```bash
   npm run start:dev
   ```

### Detailed Frontend Setup

1. **Configure Environment Variables**

   ```env
   VITE_API_URL=http://localhost:3000
   VITE_APP_NAME=Emotion Tracker
   ```

2. **Start the Frontend**
   ```bash
   npm run dev
   ```

### Detailed Model Setup

1. **Install Python Dependencies**

   ```bash
   pip install tensorflow opencv-python numpy mediapipe matplotlib pandas
   ```

2. **Verify Model Files**

   - Ensure `emotion_mobilenet_v2.tflite` is present
   - Verify `haarcascade_frontalface_default.xml` exists

3. **Test the Model**
   ```bash
   python emotion_app.py
   ```

### Unity Plugin Setup

1. **Import the Package**

   - Open Unity Package Manager
   - Import `emotiondriven.unitypackage`

2. **Configure the Scene**

   - Go to `Tools → Emotion-Driven → Setup Wizard`
   - Follow the guided setup process

3. **Add Trackable Objects**
   - Select game objects in your scene
   - Add `TrackableObject` component
   - Configure stimulus types and categories

---

## 📖 Usage Guide

### Starting a New Session

1. **Launch the Emotion Model**

   ```bash
   cd Model
   python emotion_app.py
   ```

2. **Configure Unity Scene**

   - Open your Unity project
   - Ensure TrackableObjects are configured
   - Start the emotion logging session

3. **Monitor in Dashboard**
   - Open the frontend dashboard
   - Navigate to Sessions page
   - View real-time emotion data

### Analyzing Session Data

1. **Access Session History**

   - Login to the dashboard
   - Go to Sessions page
   - Select a session to analyze

2. **View Visualizations**

   - Emotion Distribution charts
   - Time-based trend analysis
   - Stimulus correlation heatmaps
   - Valence-Arousal plots

3. **Export Data**
   - Use the export functionality
   - Download session data in various formats
   - Generate reports for analysis

### Configuring Stimuli

1. **Visual Stimuli**

   - Add `VisualStimulus` component to objects
   - Configure detection parameters
   - Set emotion triggers

2. **Audio Stimuli**

   - Add `AudioStimulus` component
   - Configure audio detection
   - Set volume and frequency triggers

3. **Proximity Stimuli**
   - Add `ProximityStimulus` component
   - Set distance thresholds
   - Configure proximity-based triggers

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password"
}
```

#### Login User

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

### Session Endpoints

#### Get User Sessions

```http
GET /sessions
Authorization: Bearer <jwt-token>
```

#### Upload Session Data

```http
POST /sessions/upload
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data

file: <session-data.jsonl>
```

#### Get Specific Session

```http
GET /sessions/:id
Authorization: Bearer <jwt-token>
```

### Trackable Objects Endpoints

#### Get All Objects

```http
GET /trackable-objects
Authorization: Bearer <jwt-token>
```

#### Create Object

```http
POST /trackable-objects
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Object Name",
  "category": "Visual",
  "position": {"x": 0, "y": 0, "z": 0},
  "parameters": {}
}
```

---

## 🛠️ Development

### Project Structure

```
Emotion-Tracker/
├── Dashboard/                 # Web dashboard
│   ├── backend/              # NestJS API
│   └── frontend/             # React dashboard
├── Model/                    # Python emotion detection
├── Unity Plugin/             # Unity integration
├── README.md                 # This file
└── .gitignore               # Git ignore rules
```

### Development Workflow

1. **Backend Development**

   ```bash
   cd Dashboard/backend
   npm run start:dev
   ```

2. **Frontend Development**

   ```bash
   cd Dashboard/frontend
   npm run dev
   ```

3. **Model Development**

   ```bash
   cd Model
   python emotion_app.py
   ```

4. **Unity Development**
   - Open Unity project
   - Import plugin changes
   - Test in Unity Editor

### Testing

#### Backend Tests

```bash
cd Dashboard/backend
npm run test          # Unit tests
npm run test:e2e      # End-to-end tests
npm run test:cov      # Coverage report
```

#### Frontend Tests

```bash
cd Dashboard/frontend
npm run test          # Unit tests
npm run build         # Build verification
```

### Code Quality

- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting
- **TypeScript**: Type safety for backend
- **SCSS**: Organized styling for frontend

---

## 🚀 Deployment

### Production Backend Deployment

1. **Build the Application**

   ```bash
   cd Dashboard/backend
   npm run build
   ```

2. **Environment Configuration**

   ```env
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=mongodb://your-production-mongodb
   JWT_SECRET=your-production-secret
   ```

3. **Deploy to Platform**
   - **Heroku**: `git push heroku main`
   - **AWS**: Use Elastic Beanstalk or EC2
   - **Docker**: Build and run container

### Production Frontend Deployment

1. **Build the Application**

   ```bash
   cd Dashboard/frontend
   npm run build
   ```

2. **Deploy Static Files**
   - **Netlify**: Drag and drop `dist/` folder
   - **Vercel**: Connect repository
   - **AWS S3**: Upload to S3 bucket

### Production Model Deployment

1. **Containerize the Application**

   ```dockerfile
   FROM python:3.8-slim
   COPY requirements.txt .
   RUN pip install -r requirements.txt
   COPY . .
   CMD ["python", "emotion_app.py"]
   ```

2. **Deploy Container**
   - **Docker**: `docker run emotion-tracker`
   - **Kubernetes**: Deploy to cluster
   - **Cloud Run**: Serverless deployment

### Unity Plugin Distribution

1. **Package the Plugin**

   - Export as `.unitypackage`
   - Include all necessary DLLs
   - Document installation steps

2. **Distribution**
   - Unity Asset Store
   - GitHub Releases
   - Direct distribution

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork the Repository**

   ```bash
   git clone https://github.com/your-username/emotion-tracker.git
   cd emotion-tracker
   ```

2. **Create a Feature Branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Your Changes**

   - Follow the coding standards
   - Add tests for new features
   - Update documentation

4. **Submit a Pull Request**
   - Describe your changes
   - Include screenshots if applicable
   - Reference any related issues

### Development Guidelines

- **Code Style**: Follow existing patterns
- **Testing**: Add tests for new features
- **Documentation**: Update README files
- **Commits**: Use conventional commit messages

### Areas for Contribution

- **New Visualizations**: Add chart types to dashboard
- **Emotion Models**: Improve ML model accuracy
- **Unity Features**: Enhance plugin functionality
- **API Endpoints**: Add new data endpoints
- **Documentation**: Improve guides and examples

---

## 🆘 Support

### Getting Help

- **Documentation**: Check component-specific README files
- **Issues**: Search existing issues on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the development team

### Common Issues

#### Emotion Detection Not Working

- Check webcam permissions
- Verify model files are present
- Ensure proper lighting conditions

#### Unity Plugin Connection Issues

- Verify UDP port configuration
- Check firewall settings
- Ensure emotion model is running

#### Dashboard Loading Problems

- Check backend API status
- Verify environment variables
- Clear browser cache

#### Database Connection Errors

- Verify MongoDB is running
- Check connection string
- Ensure network connectivity

### Troubleshooting Guide

1. **Check Logs**

   - Backend: Check console output
   - Frontend: Check browser console
   - Model: Check Python output
   - Unity: Check Unity console

2. **Verify Dependencies**

   - Node.js version compatibility
   - Python package versions
   - Unity version requirements

3. **Network Issues**
   - Check firewall settings
   - Verify port availability
   - Test network connectivity

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### License Summary

- **MIT License**: Permissive license allowing commercial use
- **Attribution**: Credit the original authors
- **No Warranty**: Use at your own risk
- **Modification**: Modify and distribute freely

---

## 🙏 Acknowledgments

- **TensorFlow Team**: For the emotion detection models
- **Unity Technologies**: For the game engine platform
- **NestJS Team**: For the backend framework
- **React Team**: For the frontend framework
- **OpenCV Contributors**: For computer vision capabilities
- **MediaPipe Team**: For face detection technology

---

## 📞 Contact

- **Project Maintainer**: [Your Name]
- **Email**: [your.email@example.com]
- **GitHub**: [@your-username]
- **Website**: [https://your-website.com]

---

<div align="center">

**Made with ❤️ by the Emotion Tracker Team**

[![GitHub stars](https://img.shields.io/github/stars/your-username/emotion-tracker?style=social)](https://github.com/your-username/emotion-tracker/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/your-username/emotion-tracker?style=social)](https://github.com/your-username/emotion-tracker/network)
[![GitHub issues](https://img.shields.io/github/issues/your-username/emotion-tracker)](https://github.com/your-username/emotion-tracker/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/your-username/emotion-tracker)](https://github.com/your-username/emotion-tracker/pulls)

</div>
