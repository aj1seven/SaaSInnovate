# AI Content Analysis Platform

## Overview

This is a full-stack AI-powered content analysis platform built with React, Express.js, TypeScript, and PostgreSQL. The application provides comprehensive content analysis services including sentiment analysis, keyword extraction, topic modeling, and summarization using OpenAI's GPT-4o model.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Theme**: Dark/light mode support with custom theme provider

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with RESTful API design
- **Database ORM**: Drizzle ORM with PostgreSQL
- **AI Integration**: OpenAI GPT-4o for content analysis
- **File Handling**: Multer for file uploads with memory storage
- **Session Management**: Express sessions with PostgreSQL store

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless
- **Schema Management**: Drizzle Kit for migrations
- **Tables**: users, projects, analyses, file_uploads
- **Relationships**: User-owned projects and analyses with proper foreign keys

## Key Components

### Content Analysis Engine
- **Sentiment Analysis**: Emotion detection with confidence scoring
- **Keyword Extraction**: Important term identification with categories
- **Text Summarization**: Automated content summarization
- **Topic Modeling**: Subject matter identification
- **Multi-format Support**: Text, file uploads, and URL analysis

### Project Management System
- **Project Organization**: Group analyses by projects
- **Status Tracking**: Active, completed, and archived project states
- **User Association**: Multi-tenant support with user isolation

### File Upload System
- **Format Support**: Multiple file types with MIME type validation
- **Size Limits**: 10MB upload limit with proper error handling
- **Storage**: Memory-based processing with optional persistence

### Dashboard Interface
- **Statistics Overview**: Real-time analytics and usage metrics
- **Analysis Results**: Comprehensive result visualization
- **Recent Projects**: Quick access to current work
- **Theme Support**: Professional dark/light theme switching

## Data Flow

1. **Content Input**: Users submit text, files, or URLs through the dashboard
2. **Analysis Processing**: Content is processed by OpenAI GPT-4o with structured prompts
3. **Result Storage**: Analysis results stored in PostgreSQL with full metadata
4. **Real-time Updates**: Frontend polls for analysis completion using React Query
5. **Export Functionality**: Results exportable in JSON/CSV formats

## External Dependencies

### Core Services
- **OpenAI API**: GPT-4o model for all AI analysis tasks
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit Infrastructure**: Development and deployment platform

### Key Libraries
- **Frontend**: React, TanStack Query, Shadcn/ui, Tailwind CSS, Wouter
- **Backend**: Express, Drizzle ORM, Multer, OpenAI SDK
- **Development**: Vite, TypeScript, ESBuild

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module
- **Build Tool**: Vite for frontend, ESBuild for backend
- **Hot Reload**: Full-stack development with live reloading

### Production Deployment
- **Target**: Replit Autoscale deployment
- **Build Process**: Vite build + ESBuild bundling
- **Port Configuration**: Internal port 5000, external port 80
- **Asset Serving**: Static file serving with Vite integration

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API authentication
- `NODE_ENV`: Environment specification

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- June 16, 2025: Enhanced UI with vibrant contrast colors and real OpenAI usage tracking
  - Implemented real-time OpenAI token usage tracking instead of mock data
  - Enhanced visual design with gradient backgrounds and improved contrast
  - Added animated elements and better hover effects throughout interface
  - Set light mode as default with professional blue/purple color scheme
  - Updated stats to show actual API requests, tokens used, and success rates
  - Improved dashboard layout with better spacing and visual hierarchy
  - Added glass effect elements and animated gradients for modern appearance

- June 16, 2025: Completed full-stack AI Content Analysis SaaS platform
  - Integrated OpenAI GPT-4o for sentiment analysis, keyword extraction, summarization, and topic modeling
  - Built professional dashboard with dark/light theme switching
  - Implemented file upload system with drag-and-drop functionality
  - Added real-time statistics tracking and project management
  - Fixed TypeScript compatibility issues and CSS styling
  - Application successfully deployed and running on port 5000

## User Preferences

- Preferred interface: Light mode with high contrast colors
- Preferred API usage display: Real OpenAI token utilization instead of mock percentages
- Preferred visual style: Modern, vibrant design with gradients and animations

## Deployment Status

✓ Application is live and fully functional with enhanced UI
✓ All API endpoints operational with real usage tracking
✓ OpenAI integration configured with token monitoring
✓ Frontend and backend connected with improved visual design
✓ Ready for local download and deployment