# Survey Exhibition App

## Overview

This is a multilingual (Dutch) exhibition evaluation application that guides users through a pre- and post-visit survey experience with an immersive, mystical theme. The app features a fortune teller character that guides users through various questions about their exhibition experience, preferences, and feelings about future-related topics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a modern full-stack architecture with the following components:

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI components via shadcn/ui for consistent design
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: React hooks with custom survey state management
- **Speech Integration**: Web Speech API for text-to-speech functionality

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL session store
- **API Design**: RESTful API with proper error handling and validation

### Build System
- **Bundler**: Vite for fast development and optimized builds
- **Development**: Hot module replacement with Vite dev server
- **Production**: Static asset serving with Express

## Key Components

### Survey Flow Management
- **State Management**: Custom `useSurvey` hook manages survey progression, answers, and completion
- **Section Navigation**: Handles transitions between check-in intro, questions, check-out, and results
- **Answer Persistence**: Maintains user responses throughout the survey flow
- **Progress Tracking**: Calculates completion percentage for user feedback

### Speech Integration
- **Text-to-Speech**: `useSpeech` hook wraps Web Speech API for Dutch language support
- **Auto-narration**: Questions and instructions are automatically read aloud
- **User Control**: Speech can be stopped and restarted as needed

### Interactive Question Types
- **Text Input**: Simple text responses (name, age)
- **Multiple Choice**: Radio button selections with optional "other" input
- **Ranking**: Drag-and-drop interface for topic prioritization
- **Likert Scales**: Emotional and confidence rating scales
- **Topic-specific Theming**: Dynamic color schemes based on user's most important topic

### Data Export
- **CSV Export**: Converts survey responses to downloadable CSV format
- **Data Formatting**: Handles complex data structures like rankings and multi-part answers

## Data Flow

1. **Survey Initialization**: User starts with check-in intro featuring fortune teller character
2. **Question Progression**: Sequential navigation through predefined questions with validation
3. **Answer Storage**: Responses stored in React state and optionally persisted to backend
4. **Topic Personalization**: User's most important topic influences later question styling
5. **Results Generation**: Final personality assessment based on accumulated responses
6. **Data Export**: Option to download results as CSV file

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **@supabase/supabase-js**: Alternative database client (configured but not actively used)
- **@tanstack/react-query**: Server state management and caching
- **drizzle-orm**: Type-safe database queries and migrations
- **wouter**: Lightweight routing library

### UI Dependencies
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **class-variance-authority**: Type-safe CSS class management
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Fast build tool and dev server
- **typescript**: Type safety and enhanced development experience
- **eslint**: Code linting and formatting

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with hot module replacement
- **Database**: PostgreSQL with Drizzle migrations
- **Environment Variables**: DATABASE_URL for database connection

### Production Build
- **Frontend**: Vite builds React app to static assets
- **Backend**: esbuild bundles Express server
- **Database**: PostgreSQL with connection pooling via Neon/Supabase
- **Serving**: Express serves both API routes and static frontend assets

### Database Schema
- **survey_responses**: Stores complete user responses with timestamps
- **Validation**: Zod schemas ensure data integrity
- **Migrations**: Drizzle handles database schema changes

## Recent Changes

### July 16, 2025 - Major Survey Experience Improvements
- **Enhanced Dashboard**: Added comprehensive charts and analytics with Recharts integration
  - Interactive pie charts for topic distribution
  - Line charts showing before/after feeling and confidence comparisons
  - Improved KPI cards with calculated metrics
  - Better visualization of visitor response patterns

- **Randomized Topic Ordering**: Implemented random topic shuffling in ranking questions to prevent order bias
  - Topics are shuffled once per session using Fisher-Yates algorithm
  - Maintains user selections while preventing position-based preference bias

- **Streamlined Answer Display**: Updated question components to show minimal answer display
  - LikertScale: Shows only selected option in white box when answered
  - MultipleChoice: Shows only selected option in white box when answered
  - Removes explanatory text above answers for cleaner UI

- **Name Verification System**: Added verification for returning visitors
  - Detects duplicate names in existing responses
  - Prompts for name verification with number suffix option
  - Seamless integration with survey flow

- **Animated Result Reveal**: Created engaging result presentation
  - 3-second shuffling animation of icons and colors
  - Smooth transition to final personality result
  - Enhanced visual feedback with topic-specific styling

- **Improved Action Choice Display**: Consistent white box styling for all answer types
  - Maintains design consistency across question types
  - Better visual hierarchy and readability

The application is designed to be deployment-ready for platforms like Replit, with proper environment variable handling and production optimizations.