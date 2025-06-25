<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Emotion Tracker Backend

A NestJS-based backend service for the Emotion Tracker application. This service provides authentication, session management, and data storage for emotion tracking data collected from Unity experiences and processed by the emotion detection model.

## Overview

This backend is part of a larger emotion-driven analytics system that includes:
- **Unity Plugin**: Collects emotion data and stimuli from Unity experiences
- **Model**: Python-based emotion detection using machine learning
- **Frontend**: React dashboard for visualizing emotion analytics
- **Backend**: This service - handles data storage, authentication, and API endpoints

## Features

- **Authentication**: JWT-based user authentication and authorization
- **Session Management**: Store and retrieve emotion tracking sessions
- **User Management**: User registration, login, and profile management
- **Trackable Objects**: Manage stimuli and objects that trigger emotional responses
- **RESTful API**: Comprehensive API for frontend integration
- **MongoDB Integration**: Scalable data storage for session and user data

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (running locally or accessible via URL)
- npm or yarn package manager

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/emotion-tracker
   JWT_SECRET=your-super-secret-key-change-this-in-production
   JWT_EXPIRES_IN=1d
   ```

3. **Start MongoDB:**
   ```bash
   # If running locally
   mongod
   ```

4. **Run the development server:**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000`

## API Documentation

- **Interactive API Documentation (Swagger UI)**: `http://localhost:3000/api`
- **API Base URL**: `http://localhost:3000`

## Core Modules

### Authentication (`/auth`)
- User registration and login
- JWT token generation and validation
- Password hashing and security

### Sessions (`/sessions`)
- Upload emotion tracking session data
- Retrieve session history
- Session analytics and metadata

### Users (`/users`)
- User profile management
- User data schemas and validation

### Trackable Objects (`/trackable-objects`)
- Manage stimuli and objects that trigger emotions
- Category management for different types of stimuli

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get access token

### Sessions
- `POST /sessions/upload` - Upload session data (requires auth)
- `GET /sessions` - Get user's sessions (requires auth)
- `GET /sessions/:id` - Get specific session (requires auth)

### Trackable Objects
- `GET /trackable-objects` - Get all trackable objects
- `POST /trackable-objects` - Create new trackable object
- `PUT /trackable-objects/:id` - Update trackable object
- `DELETE /trackable-objects/:id` - Delete trackable object

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   ├── jwt-auth.guard.ts
│   ├── jwt.strategy.ts
│   ├── local-auth.guard.ts
│   └── local.strategy.ts
├── sessions/            # Session management
│   ├── schemas/
│   │   └── session.schema.ts
│   ├── sessions.controller.ts
│   ├── sessions.module.ts
│   └── sessions.service.ts
├── trackable-objects/   # Stimuli management
│   ├── schemas/
│   │   └── trackable-object.schema.ts
│   ├── trackable-objects.controller.ts
│   ├── trackable-objects.module.ts
│   └── trackable-objects.service.ts
├── users/              # User management
│   └── schemas/
│       └── user.schema.ts
├── config/             # Configuration
│   └── configuration.ts
├── app.controller.ts   # Main controller
├── app.module.ts       # Root module
├── app.service.ts      # Main service
└── main.ts            # Application entry point
```

## Development

### Available Scripts
- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:cov` - Run tests with coverage

### Code Style
- ESLint configuration for code quality
- TypeScript for type safety
- NestJS decorators and patterns

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong `JWT_SECRET`
- Configure production `MONGODB_URI`
- Set appropriate `PORT`

## Integration

This backend integrates with:
- **Frontend**: Provides REST API for the React dashboard
- **Unity Plugin**: Receives emotion data via HTTP endpoints
- **Model**: May receive processed emotion data from Python ML model

## Support

For issues and questions:
- Check the API documentation at `http://localhost:3000/api`
- Review the NestJS documentation: https://docs.nestjs.com
- Check the project's main README for overall architecture

## License

This project is part of the Emotion Tracker monorepo.

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
