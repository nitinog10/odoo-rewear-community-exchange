# ReWear - Sustainable Fashion Marketplace

## Overview

ReWear is a full-stack sustainable fashion marketplace that enables users to swap, share, and donate clothing items. The application features AI-powered outfit suggestions, a points-based reward system, and a modern web interface built with React and Express.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui components
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store
- **Authentication**: Replit Auth with OpenID Connect
- **API Integration**: OpenAI for AI-powered style recommendations

### Database Schema
- **Users**: Profile information, points balance, style preferences
- **Items**: Clothing items with categories, conditions, images, and metadata
- **Swaps**: User-to-user item exchanges with status tracking
- **Donations**: Direct item donations to the platform
- **AI Suggestions**: Generated outfit recommendations and style analysis
- **Sessions**: User session storage for authentication

## Key Components

### Authentication System
- Replit Auth integration for secure user authentication
- Session-based authentication with PostgreSQL session store
- Protected routes and API endpoints
- User profile management with points system

### Item Management
- Full CRUD operations for clothing items
- Image upload and storage capabilities
- Advanced filtering by category, type, condition, and status
- Featured items system for highlighting quality listings
- AI-powered item categorization and analysis

### Swap System
- User-to-user item exchange requests
- Status tracking (pending, accepted, rejected, completed)
- Points-based alternative to direct swaps
- Messaging system for swap negotiations

### AI Integration
- OpenAI GPT-4 integration for style analysis
- Color theory and fashion compatibility analysis
- Personalized outfit recommendations
- Style trend analysis and suggestions

### Points System
- Reward users for listing items (+10 points)
- Bonus points for completed swaps (+20 points)
- Donation rewards (+20 points)
- Point redemption for items without direct swaps

## Data Flow

### User Authentication Flow
1. User initiates login through Replit Auth
2. OpenID Connect handles authentication
3. Session created and stored in PostgreSQL
4. User profile fetched or created
5. Frontend receives user data and authentication state

### Item Listing Flow
1. User fills out item form with details and images
2. AI analyzes item for categorization and tagging
3. Item stored in database with "pending" status
4. Admin approval process (if implemented)
5. Item becomes available for swaps/purchases

### Swap Request Flow
1. User browses available items
2. AI suggests compatible items based on user's inventory
3. User initiates swap request with message
4. Recipient receives notification and can accept/reject
5. Upon acceptance, items are marked as "swapped"
6. Users receive points for successful transaction

### AI Recommendation Flow
1. User views an item or requests recommendations
2. System analyzes user preferences and item compatibility
3. OpenAI API processes style analysis request
4. AI returns suggestions with compatibility scores
5. Frontend displays personalized recommendations

## External Dependencies

### Authentication
- **Replit Auth**: Primary authentication provider
- **OpenID Connect**: Authentication protocol
- **Express Sessions**: Session management

### Database
- **PostgreSQL**: Primary database (Neon serverless)
- **Drizzle ORM**: Database operations and migrations
- **Connection pooling**: For production scalability

### AI Services
- **OpenAI API**: GPT-4 for style analysis and recommendations
- **Image analysis**: For item categorization and quality assessment

### Frontend Libraries
- **React Query**: Server state management and caching
- **React Hook Form**: Form handling and validation
- **Zod**: Schema validation
- **Tailwind CSS**: Styling framework
- **Radix UI**: Accessible component primitives

## Deployment Strategy

### Development Environment
- **Vite**: Development server with HMR
- **TypeScript**: Type checking and compilation
- **ESLint/Prettier**: Code quality and formatting

### Production Build
- **Frontend**: Vite build with optimized bundles
- **Backend**: ESBuild for server bundling
- **Database**: Drizzle migrations for schema management
- **Environment Variables**: Secure configuration management

### Database Deployment
- **Migrations**: Automated schema updates via Drizzle
- **Seeding**: Initial data population for featured items
- **Backup Strategy**: Regular database backups for data protection

### Monitoring and Performance
- **Error Handling**: Comprehensive error boundaries and logging
- **Query Optimization**: Efficient database queries with proper indexing
- **Image Optimization**: Optimized image serving and storage
- **API Rate Limiting**: Protection against abuse and excessive usage

The application follows a modern full-stack architecture with clear separation of concerns, robust error handling, and scalable design patterns suitable for a growing user base in the sustainable fashion marketplace.