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

### July 19, 2025 - Fortune Teller Mystical Theme Implementation
- **Complete Fortune Teller Theme**: Replaced user theme customization with immersive mystical fortune teller atmosphere
- **Mystical Background**: Added animated starfield with twinkling stars, mystical particles, and gradient backgrounds  
- **Fortune Teller Character**: Created animated fortune teller character with crystal ball, mystical accessories, and glowing aura
- **Custom Animations**: Implemented twinkle, mystical-glow, crystal-pulse, floating, and mystical-shimmer CSS animations
- **Mystical Components**: Added MysticalCard and MysticalBorder wrapper components for consistent theming
- **CSS Variables**: Added fortune-teller specific color palette (deep purple, royal purple, mystical gold)
- **Enhanced Entry Choice**: Updated with mystical portal, animated crystal ball, and fortune teller guidance text
- **Progress Bar**: Transformed to mystical shimmer effect with gradient colors
- **Dashboard Link**: Styled with mystical theme and glow effects
- **Animation Optimization**: Reduced distracting animations - only background elements animate, main UI elements are static for better focus
- **Background Stars System**: Updated all background decorations to use only stars (⭐, ✨, 🌟, 💫) and dots for consistent mystical atmosphere
- **Enhanced Results Page**: Completely redesigned Results component with mystical crystal ball theme matching homepage atmosphere
- **Discrete Dashboard**: Made dashboard link less prominent for museum staff use only
- **Simplified Entry Screen**: Removed extra text and decorative emojis from choice buttons for cleaner interface
- **Name Input Background**: Added BackgroundEmojis component to all name input pages (CheckoutNameInput, CheckInIntro, NameMatching, NameVerification)
- **Golden Shimmer Results**: Updated Results and AnimatedResult components with golden gradient text effects for mystical appearance
- **Improved Results Layout**: Positioned results card directly under crystal ball, reduced background distraction for better focus
- **Welcome Text Styling**: Changed "Welkom bij Toekomstmakers!" to simple yellow color without glow effects per user preference
- **Consistent Mystical Experience**: Applied fortune teller theme across all survey components with star-field background including name entry sections

### July 18, 2025 - Database Migration and Checkout Flow Fix
- **Database Migration**: Replaced in-memory storage with PostgreSQL database to ensure data persistence
- **Fixed existingResponses Issue**: API now properly returns stored survey responses from database
- **Enhanced Checkout Logic**: Simplified name matching logic to find exact matches (case-insensitive)
- **Test Data Creation**: Created test users "anna", "testkind", and "floor" with complete check-in data
- **Improved Logging**: Added comprehensive console logging to track checkout flow progression
- **Name Memory System**: Any name entered in check-in is permanently stored in database and recognized in checkout

### July 18, 2025 - Complete Checkout Flow Optimization for Existing Users
- **Removed ALL preliminary questions for existing users**: When existing users (who completed check-in) do checkout, they now skip age, visiting, AND ranking questions completely
- **Direct navigation to question-6**: Existing users go directly from name verification to "How do you feel about [TOPIC] in the future?" 
- **Enhanced audio feedback**: Results component now properly speaks all personality types (UITVINDER, ACTIEVOERDER, VERANDERAAR) with console logging
- **Dashboard separation**: Complete responses vs check-in only responses clearly separated with color-coded cards (green for complete, yellow for incomplete)
- **Improved user experience**: Existing users see notice that their previous check-in data is used for comparison, no need to re-enter information

### July 18, 2025 - Major Voice and Translation Updates
- **Enhanced Dutch Voice Quality**: Updated Dutch voice pitch to 0.95 for more natural, human-like sound
- **Fixed Ranking Question Audio**: Ranking question now only speaks main question once using proper state management, removed instruction text and audio feedback on topic clicks
- **Added Results Audio**: Results section now speaks the main outcome and motivational message in the correct language
- **Complete English Translation Implementation**: 
  - Updated topic names in English (WONEN=LIVING, KLIMAAT=CLIMATE, GEZONDHEID=HEALTH, RIJKDOM=WEALTH, VREDE=PEACE, VRIJE TIJD=FREE TIME)
  - Fixed Results component to display proper English translations for all text
  - Updated all topic data displays throughout the app to use language-specific names and descriptions
- **Fixed Checkout Name Verification Logic**: 
  - Existing users (who did check-in) now skip the ranking question and use their previous topic choice
  - New users (who didn't do check-in) must answer the ranking question first
  - Proper data inheritance from check-in responses for existing users
- **Added Checkout-Only User Flow**: 
  - New checkout users now answer age and visitingWith questions before ranking
  - Complete data collection for all users regardless of entry point
  - Proper validation to distinguish between complete check-in users vs. incomplete/new users
- **Simplified and Fixed Checkout Name Input**: 
  - Checkout name section now matches check-in design exactly (same colors, layout, styling)
  - Simplified logic: exact name match with complete data = existing user, otherwise = new user
  - Uses same Question component format as check-in for consistency
- **Enhanced Navigation Logic**: Improved navigation flow between questions for checkout-only users to ensure proper sequence

### July 18, 2025 - Complete English Translation and Enhanced User Experience
- **Full Bilingual Support**: Added complete English translations for all survey components
  - Created English versions of all scale options (LIKERT_SCALE_EN, CONFIDENCE_SCALE_EN, ACTION_OPTIONS_EN, VISITING_OPTIONS_EN)
  - Updated all components to use language-specific options based on user selection
  - Implemented translation system for ranking question instructions and labels
  - Added future context display with age calculation in checkout questions

- **Enhanced Touch-Screen Support**: Improved ranking question interactions for mobile devices
  - Added touch event handlers for drag-and-drop ranking on mobile
  - Implemented swipe gestures for topic reordering with proper touch feedback
  - Added visual feedback during touch interactions with opacity changes
  - Prevented default scroll behavior during touch manipulation

- **Horizontal Action Choice Layout**: Updated action choice questions to use horizontal layout
  - Changed from vertical (columns=1) to horizontal (columns=3) layout
  - Improved visual balance and touch accessibility on tablets and mobile devices
  - Maintained consistent styling with other question types

- **Disabled Automatic CSV Download**: Removed automatic CSV export functionality
  - CSV download now only available through museum staff dashboard
  - Simplified results flow for better user experience
  - Maintained data collection for analytics purposes

- **Updated Checkout Message**: Enhanced checkout intro message clarity
  - Updated message to "Kom je aan het einde van de tentoonstelling terug? Dan onderzoeken we verder wat voor toekomstmaker jij bent!"
  - Added matching speech synthesis for improved accessibility
  - Clearer user guidance for post-exhibition survey completion

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
  - 10-second shuffling animation of icons and colors with countdown timer
  - Direct transition to final personality results after animation
  - Enhanced visual feedback with topic-specific styling
  - Added skip functionality and detailed console logging for debugging
  - Robust timeout mechanism with visual countdown display

- **Persistent Answer Display**: Updated answer display behavior
  - Multiple choice and Likert scale questions now show all options after selection
  - Ranking questions maintain drag-and-drop interface without white answer boxes
  - Consistent behavior across age, companion, and feeling/confidence sections
  - Ranking question completely hides answer descriptions for cleaner interface

- **Updated Topic Icons**: Changed RIJKDOM icon from money (💰) to sharing/handshake (🤝)
  - Better represents the concept of sharing over wealth accumulation
  - Consistent with "Delen is fijner dan hebben!" message
  - Icon appears throughout ranking, results, and dashboard components

- **Clean Interface Updates**: Further refined user interface elements
  - Ranking question completely removes answer display for minimal interface
  - Action choice question now shows white box answer format matching other questions
  - Results properly display as final section with animated introduction

- **Improved Action Choice Display**: Consistent white box styling for all answer types
  - Maintains design consistency across question types
  - Better visual hierarchy and readability

- **Standardized Checkout Question Format**: Updated checkout questions to match check-in format
  - All checkout questions now use the standardized Question component
  - Consistent navigation, styling, and answer display across all questions
  - Topic-specific theming with dynamic background gradients
  - Proper Previous/Next button flow for better user experience

- **Entry Choice Flow Update**: Modified post-check-in behavior to return to entry choice
  - After check-in completion, users return to the initial entry choice page
  - Allows seamless transition from check-in to check-out within the same session
  - Improved user workflow for completing both survey parts

- **Comprehensive Formatting Consistency (July 16, 2025)**: Standardized all question layouts
  - Converted questions 4 and 5 from custom layouts to Question component format
  - Updated NameMatching component to use Question component format
  - Simplified checkout name question to match check-in format (removed complex lists and checkboxes)
  - Removed topic data blocks from checkout questions 6, 7, 8 for consistency
  - Standardized all "Jouw antwoord:" displays to use translation system
  - All checkout questions now have identical formatting to check-in questions
  - Consistent spacing (space-y-4) across all question types

The application is designed to be deployment-ready for platforms like Replit, with proper environment variable handling and production optimizations.