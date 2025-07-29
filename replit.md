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

### July 27, 2025 - iPad Layout Fixes and Question Text Updates
- **iPad CSS Optimizations**: Fixed CSS syntax errors and implemented iPad-specific optimizations for better tablet user experience
- **Viewport Improvements**: Updated viewport meta tag for optimal iPad performance and touch interactions
- **Touch-Friendly Elements**: Enhanced button sizes, input fields, and interactive elements for iPad usage
- **Question Text Refinement**: Updated confidence question wording from "Denk jij dat kinderen iets kunnen doen om [onderwerp x] te helpen in de toekomst" to "Denk je dat kinderen iets kunnen doen voor [onderwerp x] in de toekomst?" for both check-in and check-out phases
- **Bilingual Consistency**: Applied same text improvements to English translations for consistency across languages
- **Full Viewport Coverage**: Implemented survey-section class for complete screen coverage (100vw x 100vh) eliminating purple background visibility
- **Content Width Optimization**: Updated question-content to use 0.5cm margins from screen edges (calc(100% - 1cm) width) for better iPad readability and wider content area
- **Consistent Component Styling**: Applied new layout system to all survey components (EntryChoice, CheckInClosing, CheckOutIntro, Results) for uniform full-screen experience
- **Enhanced Likert Scale Buttons**: Improved emoji buttons with professional 3D styling, inset shadows, gradients, and ::before pseudo-elements for polished appearance
- **Dual Click Interface**: Added both emoji buttons and traditional radio buttons under emojis for familiar interaction patterns
- **Action Question Spacing**: Increased spacing between action choice answers and navigation buttons by 2cm for better visual separation
- **Language Selector Repositioning**: Moved language selector 3cm to the left (from right-12 to right-20) for better iPad accessibility
- **Comprehensive CSV Export**: Enhanced dashboard CSV export to include all survey questions: knowledge before, learned something new, most interesting learned, and checkout user status fields
- **Radio Button Alignment**: Fixed radio buttons under Likert scale emojis to be perfectly centered using flex-1 and justify-center wrapper
- **Audio Volume Enhancement**: Increased all speech synthesis volume to 300% (3.0) across useSpeech hook and Results component for better exhibition audio
- **Text Color Fix**: Changed check-in name input text color from gray to black for better visibility and consistency with checkout
- **CSV Format Enhancement**: Improved Numbers app compatibility with UTF-8 BOM and semicolon separators instead of commas
- **Topic Name Display Fix**: Added CSS word-wrap rules to prevent GEZONDHEID text truncation in all topic displays
- **Dashboard Bug Fix**: Resolved actionChoice null value issue in statistics calculation to prevent TypeScript errors
- **iPad CSV Download Fix**: Enhanced CSV download to work properly on iPad devices with automatic Downloads folder saving and improved mobile compatibility
- **CSS Input Text Fix**: Added CSS rules to ensure all text inputs display black text with gray placeholders, preventing any gray text issues
- **Check-In Name Layout Fix**: Updated check-in name input (question-0) to match checkout name layout with larger text, better styling, and black text color
- **Button Spacing Enhancement**: Added 2cm extra spacing (mt-16) for navigation buttons in visiting companions and action choice questions for better iPad usability
- **Name Input Width Reduction**: Reduced question-content width by 2cm on both sides (from calc(100% - 1cm) to calc(100% - 5cm) with 2.5cm margins) for narrower name input columns
- **Topic Text Alignment Fix**: Added CSS to center GEZONDHEID text under heart icon and keep VRIJE TIJD on single line in ranking questions

### July 27, 2025 - Project Migration and Question Updates
- **Migration to Replit**: Successfully migrated project from Replit Agent to standard Replit environment
- **Database Setup**: Configured PostgreSQL database with proper environment variables
- **Question Modifications**: Updated feeling questions to focus on future thinking:
  - Check-in question changed from "Hoe voel je je over het onderwerp X?" to "Hoe denk jij over [onderwerp X] in de toekomst?"
  - Check-out question changed to "Hoe denk jij nu over [onderwerp X] in de toekomst?"
- **New Answer Scale**: Replaced emotion-based answers with thinking-based scale:
  - 😥 Heel slecht (Very bad)
  - 😟 Slecht (Bad) 
  - 😐 Neutraal (Neutral)
  - 🙂 Goed (Good)
  - 😊 Heel goed (Very good)
- **Bilingual Support**: Updated both Dutch and English translations for the new question format
- **Technical Fixes**: Resolved TypeScript compilation errors in storage layer

### July 21, 2025 - Homepage Layout & Apple Device Optimization
- **Video Replacement**: Updated homepage video to new "Ontwerp zonder titel" video
- **Two Column Layout**: Video left, text right with matching heights (32-36rem)
- **Video Zoom**: Applied 1.1x scale to remove white borders and improve framing
- **Background Cleanup**: Removed top-left illustrations and emojis as requested
- **Topic Selection Enhancement**: Added automatic explanations when dragging/dropping topics
- **Apple Device Audio**: Enhanced Dutch female voice selection for iOS/iPad with Xander fallback
- **Apple Emoji Support**: Added CSS to ensure consistent Apple emoji rendering across devices
- **Drag Feedback**: Topics now speak their descriptions immediately when repositioned
- **Dutch Female Voice Fix**: Completely revised voice selection to exclude all male voices (Xander, Frank) and prioritize Netherlands Dutch female voices only (Google Nederlands, Claire, Saskia, etc.) - no Belgian Dutch
- **Netherlands Dutch Priority**: Updated both useSpeech.ts and Results.tsx to only use nl-NL voices, eliminating Belgian (nl-BE) Ellen voice for proper Netherlands accent
- **Language Selector Repositioning**: Moved Dutch/English flags 30px up and 30px left from bottom-right corner (bottom-12 right-20)
- **FortuneTellerCharacter Removal**: Updated component to return null, effectively hiding fortune teller character from UI while maintaining API compatibility

### July 19, 2025 - Background Video Implementation
- **Full-Screen Video Background**: Added HNI_afstuderen_(5)_1752931557943.mp4 as background video on welcome/entry page
- **Video Optimization**: Video is auto-playing, looping, muted with full viewport coverage
- **Enhanced UI Overlay**: Added semi-transparent dark overlay (40% opacity) for better text readability
- **Improved Button Styling**: Enhanced button visibility with stronger backgrounds, borders, and backdrop-blur effects
- **Responsive Video**: Video scales properly across all screen sizes using object-cover and viewport dimensions
- **Professional Presentation**: Removed background emoji decorations in favor of clean video background
- **Video Repositioning**: Moved video above "Welkom bij Toekomstmakers!" section instead of background overlay
- **Crystal Ball Removal**: Removed crystal ball icon for cleaner interface design
- **iPad Optimization**: Enhanced responsive design for tablet use with larger touch targets
- **Touch Interface**: Added touch-friendly interactions with active states and optimized button sizing
- **Viewport Optimization**: Configured viewport meta tags for better iPad web app experience
- **Touch CSS**: Added webkit touch optimizations to prevent unwanted selections and highlights
- **Title Text Update**: Changed homepage title from "Welkom bij Toekomstmakers!" to "Wat voor toekomstmaker ben jij?" (Dutch) and "What kind of future maker are you?" (English)
- **Enhanced Text Block Design**: Redesigned main content card with mystical gradient borders, animated sparkle decorations, and improved button hover effects
- **Audio Loop Implementation**: Added 10-second interval audio loop for welcome messages on homepage with improved speech error handling
- **CSV Export with Data Clearing**: Added comprehensive CSV download functionality with administrative data clearing using authentication code "HNIlina"
- **Enhanced Dashboard UI**: Upgraded dashboard with red warning sections, prominent "🚨 DOWNLOAD & WISSEN" button, and detailed step-by-step warnings for data deletion
- **Fixed API Integration**: Corrected apiRequest calls to use proper format (POST method first, then URL, then data) for successful data clearing functionality
- **Data Management Security**: All data export and deletion now requires exact "HNIlina" authentication code with comprehensive error handling
- **Looping Audio System**: Added automatic audio loop on entry page with 10-second intervals between welcome messages
- **Enhanced Mystical Design**: Upgraded entry page with gradient borders, animated decorations, and premium button styling

### July 19, 2025 - Dashboard Layout Restoration and Red Button Completion
- **Complete Dashboard Rebuild**: Fixed JSX syntax errors that were preventing the dashboard from loading properly
- **Original Layout Restored**: Restored all 6 statistics cards (Total Responses, Complete Responses, Check-in Only, Average Age, Feeling Improvement, Confidence Improvement)
- **Topic and Action Distribution**: Re-implemented detailed topic and action popularity charts with icons and color coding
- **Response Listing**: Restored separate sections for complete responses (green) and check-in only responses (yellow) with full details
- **Working Red Button**: Maintained functional red download button with HNIlina authentication that downloads CSV and deletes all data
- **Authentication System**: Red button only activates when correct "HNIlina" code is entered, includes confirmation dialog
- **Data Management**: Button successfully exports all survey data to CSV then permanently clears database
- **Visual Feedback**: Button turns red when authenticated, shows loading state during deletion process

### July 19, 2025 - Enhanced Dashboard Analytics and Demographics Update
- **Removed Average Age Card**: Streamlined main statistics to 4 cards instead of 7 for cleaner layout
- **Updated Age Demographics**: Changed age options to match survey questions exactly (6, 7, 8, 9, 10, 11, 12, anders)
- **Updated Visiting Options**: Changed visiting companion options to match survey (School 🏫, Alleen 🚶, Oppas 👩‍🍼, Anders 👪)
- **Enhanced Bar Charts**: Redesigned Onderwerp 1 and 2 as simplified comparison charts showing average differences
- **Visual Improvements**: Added icons throughout dashboard sections (🎂 age, 👥 visiting, 🏆 topics, ⚡ actions)
- **Focused Analytics**: Simplified feeling and confidence charts to show only average improvement scores and before/after averages
- **Color-Coded Metrics**: Enhanced visual distinction with color-coded improvements (green for feeling, blue for confidence)
- **Responsive Layout**: Updated charts to use side-by-side layout for better space utilization

### July 19, 2025 - Enhanced Name Conflict Resolution System (Updated)
- **Smart Name Validation**: Users can use same name for check-in then check-out - warning only appears for names that completed BOTH parts
- **Flexible Checkout Flow**: Same person can enter name for check-in, then use same name for checkout without conflict
- **Clear Conflict Logic**: Name conflict only triggers when someone tries to reuse a name that already completed entire survey (feelingAfter !== null)
- **Bilingual Support**: Updated Dutch/English translations for improved name conflict detection
- **Enhanced Dashboard**: Red button styling that activates when correct security code "HNIlina" is entered
- **Secure Data Management**: Download and delete functionality requires exact "HNIlina" code with visual feedback (red buttons)

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
- **Welcome Text Styling**: Changed "Welkom bij Toekomstmakers!" to simple white color without glow effects per user preference
- **Entry Button Styling**: Added dark purple border to "Ik kom net binnen" button and lighter yellow color for "Ik ben net klaar" button
- **Enhanced Emoji Visibility**: Updated emoji colors to brighter shades (yellow-200, blue-300, orange-300) for better visibility
- **Ranking Instructions**: Simplified to only "Versleep de onderwerpen naar de goede plek." with speech synthesis
- **Results Text Consistency**: All result text now uses same golden color instead of topic-specific colors
- **Auto-redirect Feature**: Results page automatically returns to homepage after 30 seconds if "Nieuwe Lezing" button not clicked
- **Button Border Removal**: Removed borders from entry choice buttons for cleaner appearance
- **Larger Action Emojis**: Increased emoji size from text-4xl to text-6xl in action choice questions
- **Gender-Neutral Text**: Changed "zijn magie" to "haar magie" in fortune teller loading message
- **Improved Answer Spacing**: Added mt-8 margin to "Jouw antwoord:" sections to prevent overlap with answer options
- **Removed Check-in Notice**: Removed "Je hebt al eerder de check-in ingevuld" message for existing users for cleaner checkout experience
- **Removed All Answer Displays**: Completely removed all "Jouw antwoord:" sections throughout the application for cleaner interface
- **Enhanced Audio Feedback**: All answer selections now trigger audio playback automatically when clicked
- **Improved Ranking Instructions**: Changed "Sleep" to "Versleep" for better pronunciation (July 19, 2025 - Updated "Sleep de onderwerpen" to "Versleep de onderwerpen" throughout application)
- **Enhanced English Topic Translation**: Fixed confidence and feeling questions to properly translate topic names from Dutch to English (e.g., "WONEN" → "LIVING" in English questions)
- **Added Answer Labels**: Show selected answer text below radio buttons in LikertScale components for feeling and confidence questions  
- **Fixed English Name Audio**: Corrected CheckoutNameInput to use proper English audio with language parameter
- **Crystal Ball Color**: Changed 🔮 emoji from yellow to purple color in fortune teller reveal section
- **Results Audio Integration**: Added speech synthesis to "De waarzegster onthult" and "De Uitkomst" sections
- **Enhanced AnimatedResult Audio**: Added speech for waiting message "Wacht alsjeblieft... De waarzegger werkt haar magie..." during fortune teller animation
- **Complete Results Audio**: Results section now speaks complete text as one continuous piece instead of separate parts
- **English/Dutch Voice Selection**: Improved voice selection logic for both languages with proper female voice detection
- **Continuous Speech Flow**: Changed from sequential timeouts to single complete text reading for better user experience
- **English Translation Fix**: Fixed all result text to properly translate to English including "You are a...", "for", and motivational messages with correct audio
- **Grammar Correction**: Fixed English articles ("a" vs "an") for words starting with vowels (INVENTOR, ACTIVIST)
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