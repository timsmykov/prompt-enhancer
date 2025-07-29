# Prompt Enhancer Chrome Extension

## Overview

This project is a Chrome browser extension called "Prompt Enhancer" that improves user prompts in popular AI chatbots with one click. The application consists of a React-based frontend web interface, a Node.js/Express backend API, and Chrome extension components that inject functionality into chatbot websites.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a full-stack architecture with clear separation between the web interface, backend API, Chrome extension components, and database layer:

### Frontend Architecture
- **Framework**: React with TypeScript and hooks for state management
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Build Tool**: Vite for fast development and bundling
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Design**: RESTful API endpoints for prompt enhancement and settings management

### Chrome Extension Architecture
- **Manifest**: Version 3 Chrome extension
- **Content Scripts**: JavaScript injection into chatbot websites
- **Popup Interface**: HTML-based settings popup
- **Storage**: Chrome storage API for extension settings

## Key Components

### Web Application Components
1. **PromptEnhancer**: Main interface component for testing prompt enhancement
2. **EnhancementModal**: Modal dialog for displaying enhanced prompts with action buttons
3. **SettingsModal**: Configuration interface for API settings and preferences
4. **UI Components**: Comprehensive shadcn/ui component library including dialogs, buttons, forms, and layouts

### Chrome Extension Components
1. **Content Script** (`public/content.js`): Detects prompt input fields and injects enhancement buttons
2. **Popup Interface** (`public/popup.html`): Extension settings and configuration
3. **Manifest** (`public/manifest.json`): Extension configuration and permissions

### Backend Components
1. **Route Handlers** (`server/routes.ts`): API endpoints for enhancement and settings
2. **Storage Layer** (`server/storage.ts`): In-memory data storage with interface for future database integration
3. **Database Schema** (`shared/schema.ts`): Drizzle ORM schema definitions

## Data Flow

1. **Web Interface Flow**:
   - User enters prompt in web interface
   - Frontend sends POST request to `/api/enhance`
   - Backend processes prompt with enhancement logic
   - Enhanced prompt returned with statistics
   - Optional storage in database if history is enabled

2. **Chrome Extension Flow**:
   - Content script detects chatbot input fields
   - User clicks "Enhance" button injected by extension
   - Extension extracts current prompt text
   - Sends request to local backend server
   - Displays enhanced prompt in modal overlay
   - User can insert, regenerate, or cancel

3. **Settings Management**:
   - Settings stored via Chrome storage API for extension
   - Web interface uses backend API for settings persistence
   - Settings include API keys, model URLs, and user preferences

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React DOM, React Query for state management
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with PostCSS processing
- **Form Handling**: React Hook Form with Zod validation
- **Utilities**: Class Variance Authority, clsx, date-fns

### Backend Dependencies
- **Server**: Express.js web framework
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Database Driver**: Neon Database serverless client
- **Validation**: Zod schema validation
- **Session Management**: Connect-pg-simple for PostgreSQL sessions

### Development Dependencies
- **Build Tools**: Vite, esbuild for server bundling
- **TypeScript**: Full TypeScript support across the stack
- **Development**: tsx for TypeScript execution, hot reloading

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR and React Fast Refresh
- **Backend**: tsx for TypeScript execution with automatic restarts
- **Database**: Neon Database with connection via DATABASE_URL environment variable
- **Extension**: Load unpacked extension from `public/` directory

### Production Build
- **Frontend**: Vite builds static assets to `dist/public/`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations in `migrations/` directory
- **Extension**: Chrome Web Store deployment from `public/` directory

### Database Management
- **Schema**: Defined in `shared/schema.ts` using Drizzle ORM
- **Migrations**: Generated and applied using `drizzle-kit`
- **Connection**: Environment-based configuration with PostgreSQL URL

The application is designed to work both as a standalone web application for testing and as a Chrome extension for real-world chatbot enhancement, with a unified backend serving both interfaces.