# JDSA Admin

## Overview

JDSA Admin is a student administrative management application built with Expo/React Native for the frontend and Express.js for the backend. The app serves two user roles: students (view-only access to personal information and grades) and administrators (full CRUD management of student records). The application uses a deep blue and amber color scheme to balance institutional authority with approachability.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Expo SDK 54 with React Native 0.81, supporting iOS, Android, and web platforms
- **Navigation**: React Navigation v7 with native stack navigators
  - Stack-only navigation for students (minimal features)
  - Full navigation with role-based screens for admins
  - Screens: Landing → Role Selection → Login (Student/Admin) → Dashboard → Management
- **State Management**: TanStack React Query for server state and API data fetching
- **Styling**: Theme-based approach with light/dark mode support via `useTheme` hook
- **Animations**: React Native Reanimated for smooth UI transitions and gestures
- **Path Aliases**: `@/` maps to `./client`, `@shared/` maps to `./shared`

### Backend Architecture
- **Framework**: Express.js v5 running on Node.js with TypeScript (via tsx)
- **API Design**: RESTful endpoints under `/api/` prefix
  - `/api/admin/login` - Admin authentication
  - `/api/student/login` - Student authentication
  - CRUD endpoints for student management
- **Database**: PostgreSQL with Drizzle ORM
  - Schema defined in `shared/schema.ts` with Zod validation via drizzle-zod
  - Tables: `admins`, `students` with UUID primary keys
- **CORS**: Configured for Replit domains and localhost development

### Shared Code
- **Location**: `./shared/` directory contains code used by both client and server
- **Schema**: Database schema definitions and Zod validation schemas exported from `shared/schema.ts`
- **Type Safety**: TypeScript strict mode enabled across the entire codebase

### Authentication
- Simple credential-based authentication for both admin and student roles
- Admin credentials: hardcoded in routes (username: "admin", password: "12345")
- Student credentials: stored in database with studentId and password

### Build System
- **Development**: Concurrent Expo and Express servers
- **Production**: Custom build script for static web output, esbuild for server bundling
- **Database Migrations**: Drizzle Kit for schema synchronization (`npm run db:push`)

## External Dependencies

### Database
- **PostgreSQL**: Primary data store accessed via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and migrations

### Third-Party Services
- **Expo**: Mobile app framework and build service
- **React Navigation**: Navigation library for routing between screens

### Key Libraries
- **@tanstack/react-query**: Server state management and caching
- **react-native-reanimated**: Animation library for smooth transitions
- **expo-haptics**: Haptic feedback for native interactions
- **zod**: Runtime type validation for API requests and forms

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `EXPO_PUBLIC_DOMAIN`: API server domain for client-side requests
- `REPLIT_DEV_DOMAIN`: Development domain for CORS configuration
- `REPLIT_DOMAINS`: Production domains for CORS configuration