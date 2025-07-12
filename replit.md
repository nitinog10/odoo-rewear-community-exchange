# Rewear - AI-Powered Fashion Recommendation Platform

## Overview

Rewear is a full-stack fashion recommendation platform built with React, Express, and PostgreSQL. The application allows users to input their fashion preferences and generates personalized outfit recommendations with AI-generated images using OpenAI's GPT-4o and DALL-E 3 models. The system features a modern UI built with shadcn/ui components and Tailwind CSS.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and building
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: TanStack Query (React Query) for server state
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error middleware
- **Request Logging**: Custom middleware for API request/response logging

### Data Storage Solutions
- **Database**: PostgreSQL (configured for production)
- **ORM**: Drizzle ORM with type-safe queries
- **Development Storage**: In-memory storage implementation for development
- **Migration Management**: Drizzle Kit for schema migrations

## Key Components

### Database Schema
The system uses three main tables:
- `users`: User authentication and profiles
- `fashion_profiles`: User fashion preferences and characteristics
- `recommendations`: AI-generated outfit recommendations

### External Service Integration
- **OpenAI Integration**: 
  - GPT-4o model for generating personalized fashion recommendations
  - DALL-E 3 for generating realistic outfit photography
- **Neon Database**: Serverless PostgreSQL database for production

### UI Components
- Comprehensive component library with 40+ shadcn/ui components
- Custom styling with CSS variables for theming
- Responsive design with mobile-first approach
- Accessible components using Radix UI primitives

## Data Flow

1. **User Input**: Users fill out a fashion preferences form with gender-specific body types, curated color preferences, skin tone, occasion, season, and style preferences
2. **Validation**: Form data is validated using Zod schemas on both client and server
3. **AI Processing**: Validated preferences are sent to OpenAI GPT-4o API to generate 3 personalized outfit recommendations
4. **Image Generation**: Each recommendation is enhanced with DALL-E 3 generated fashion photography showing the complete outfit
5. **Data Storage**: Fashion profile and recommendations (including image URLs) are stored in the database
6. **Response**: Complete recommendations with styling tips, tags, and generated images are returned to the client

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **openai**: OpenAI API integration for GPT-4o
- **drizzle-orm**: Type-safe database queries
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form state management
- **zod**: Runtime type validation

### UI Dependencies
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant handling
- **lucide-react**: Icon library

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- Express server with TypeScript compilation via tsx
- In-memory storage for rapid development
- Replit-specific configurations for cloud development

### Production Build
- Frontend: Vite builds optimized React bundle to `dist/public`
- Backend: esbuild bundles Node.js application to `dist/index.js`
- Environment variables for database and API keys
- Database migrations via Drizzle Kit

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: OpenAI API authentication
- Development/production mode detection via `NODE_ENV`

## Recent Changes (January 2025)

### Gender-Specific Body Types
- Implemented gender-specific body type options (male/female/non-binary)
- Added male body types: Ectomorph, Mesomorph, Endomorph, Rectangle, Inverted Triangle, Oval
- Added female body types: Pear, Apple, Hourglass, Rectangle, Inverted Triangle, Athletic
- Body type selection now dynamically updates based on gender selection

### Enhanced Color Preferences
- Replaced text input with curated dropdown menu for color preferences
- Added 10 color categories: Neutral, Warm Tones, Cool Tones, Earth Tones, Pastels, Jewel Tones, Monochrome, Bold & Bright, Vintage, Seasonal

### AI-Generated Images
- Integrated DALL-E 3 for generating realistic outfit photography
- Each recommendation now includes a professional fashion photo
- Images show complete outfits based on user preferences and AI recommendations
- Added proper error handling for image generation failures

### UI/UX Improvements
- Rebranded from "StyleAI" to "Rewear"
- Fixed tag visibility issues with improved color contrast
- Enhanced loading states to indicate image generation process
- Improved recommendation display layout with image integration
- Removed budget field as per user request

### Technical Updates
- Updated database schema to include imageUrl field for recommendations
- Enhanced OpenAI service to handle both text and image generation
- Improved error handling and fallbacks for image generation
- Updated form validation and type definitions

The architecture prioritizes type safety, developer experience, and scalability while maintaining a clean separation between frontend and backend concerns. The platform now provides comprehensive visual fashion recommendations enhanced with AI-generated imagery.