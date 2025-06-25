# Emotion Tracker Frontend

A React-based dashboard for visualizing and analyzing emotion tracking data. This frontend application provides an intuitive interface for viewing emotion analytics, session data, and real-time insights from Unity experiences.

## Overview

This frontend is part of the Emotion Tracker system that includes:

- **Unity Plugin**: Collects emotion data and stimuli from Unity experiences
- **Model**: Python-based emotion detection using machine learning
- **Backend**: NestJS API for data storage and authentication
- **Frontend**: This React dashboard - visualizes emotion analytics and insights

## Features

- **Real-time Analytics**: Live emotion tracking and visualization
- **Session Management**: View and analyze emotion tracking sessions
- **Interactive Visualizations**: Charts, heatmaps, and trend analysis
- **Dark Mode Support**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop and mobile devices
- **Authentication**: Secure login and user management
- **Data Export**: Export analytics and session data

## Pages & Components

### Pages

- **Home**: Dashboard overview with key metrics
- **Login**: User authentication
- **Sessions**: Session history and management

### Core Components

- **Navbar**: Navigation and user controls
- **Sidebar**: Menu and navigation
- **Overview**: Dashboard summary and key metrics
- **Statistics**: Detailed statistical analysis
- **Visualizations**:
  - Emotion Distribution charts
  - Heatmaps for spatial analysis
  - Time Trends for temporal patterns
  - Valence-Arousal plots
  - Stimulus Analysis
- **Raw Logs**: Detailed session data
- **Widget**: Reusable UI components

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Backend API running (see backend README)

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the root directory:

   ```env
   VITE_API_URL=http://localhost:3000
   VITE_APP_NAME=Emotion Tracker
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── navbar/         # Navigation bar
│   ├── sidebar/        # Side navigation
│   ├── overview/       # Dashboard overview
│   ├── statistics/     # Statistical analysis
│   ├── visualizations/ # Charts and graphs
│   │   ├── EmotionDistribution.jsx
│   │   ├── Heatmap.jsx
│   │   ├── TimeTrends.jsx
│   │   ├── ValenceArousal.jsx
│   │   └── StimulusAnalysis.jsx
│   ├── RawLogs/        # Session data display
│   └── widget/         # Reusable widgets
├── pages/              # Page components
│   ├── home/           # Home dashboard
│   ├── login/          # Authentication
│   └── sessions/       # Session management
├── context/            # React context providers
│   ├── darkModeContext.jsx
│   └── darkModeReducer.jsx
├── data/               # Static data and utilities
│   └── dummyData.js
├── assets/             # Static assets
├── App.jsx             # Main application component
├── main.jsx            # Application entry point
└── index.css           # Global styles
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## Development

### Tech Stack

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **SCSS**: Styling with CSS preprocessor
- **Context API**: State management
- **ESLint**: Code quality and formatting

### Key Features

- **Hot Module Replacement**: Instant updates during development
- **CSS Modules**: Scoped styling for components
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Theme switching capability

## API Integration

The frontend connects to the backend API for:

- **Authentication**: Login/logout functionality
- **Session Data**: Fetch and display emotion tracking sessions
- **Analytics**: Real-time emotion data and statistics
- **User Management**: Profile and settings

### API Endpoints Used

- `POST /auth/login` - User authentication
- `GET /sessions` - Fetch user sessions
- `GET /sessions/:id` - Get specific session data
- `GET /trackable-objects` - Get stimuli data

## Styling

The application uses SCSS for styling with:

- **Component-scoped styles**: Each component has its own SCSS file
- **Dark mode support**: Theme-aware styling
- **Responsive design**: Mobile and desktop layouts
- **Modern UI**: Clean, professional appearance

## Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

The build output will be in the `dist/` directory.

## Environment Variables

| Variable        | Description      | Default                 |
| --------------- | ---------------- | ----------------------- |
| `VITE_API_URL`  | Backend API URL  | `http://localhost:3000` |
| `VITE_APP_NAME` | Application name | `Emotion Tracker`       |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Optimized Builds**: Minified and optimized for production
- **Fast Refresh**: Instant updates during development

## Troubleshooting

### Common Issues

1. **API Connection**: Ensure the backend is running on the correct port
2. **Build Errors**: Check for missing dependencies with `npm install`
3. **Styling Issues**: Verify SCSS files are properly imported

### Development Tips

- Use the browser's developer tools for debugging
- Check the console for API errors
- Use React DevTools for component inspection

## Integration

This frontend integrates with:

- **Backend**: REST API for data and authentication
- **Unity Plugin**: Displays data collected from Unity experiences
- **Model**: Visualizes processed emotion detection results

## Support

For issues and questions:

- Check the browser console for errors
- Verify API connectivity
- Review the backend README for API documentation
- Check the project's main README for overall architecture

## License

This project is part of the Emotion Tracker monorepo.
