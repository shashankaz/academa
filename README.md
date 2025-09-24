# Academa - Learning Management System

Academa is a modern, full-stack Learning Management System (LMS) that enables instructors to create and manage courses while providing students with an intuitive platform to enroll in courses, track progress, and complete lessons. The platform supports both reading materials and interactive quizzes with real-time progress tracking.

## 🚀 Features

- **User Authentication & Authorization**: Role-based access control for students and instructors
- **Course Management**: Create, edit, and manage courses with rich content
- **Interactive Learning**: Support for reading materials and quiz-based lessons
- **Progress Tracking**: Real-time progress tracking for enrolled students
- **File Upload Support**: AWS S3 integration for course materials and cover images
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **Real-time Updates**: Dynamic content updates and notifications

## 🛠 Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7.x
- **Styling**: Tailwind CSS 4.x with custom animations
- **UI Components**: Radix UI primitives with custom styling
- **Routing**: React Router 7.x
- **HTTP Client**: Axios
- **State Management**: React hooks and local storage
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js 5.x
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with HTTP-only cookies
- **Password Hashing**: Argon2
- **File Storage**: AWS S3
- **Security**: Helmet, CORS, Compression
- **Development**: Nodemon with TypeScript compilation

### Database
- **Primary Database**: PostgreSQL
- **ORM**: Prisma with Accelerate extension
- **Migrations**: Prisma migrations

## 📋 Prerequisites

Before setting up the project, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database
- **AWS Account** with S3 bucket configured

## ⚙️ Local Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/shashankaz/academa.git
cd academa
```

### 2. Backend Setup

Navigate to the server directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the server directory with the following variables:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/academa_db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Environment
NODE_ENV="development"

# AWS Configuration
AWS_REGION="your-aws-region"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_S3_BUCKET="your-s3-bucket-name"

# Server Configuration
PORT=3000
```

Generate Prisma client and run migrations:
```bash
npm run prisma:generate
npm run prisma:migrate
```

Build the TypeScript code:
```bash
npm run build
```

### 3. Frontend Setup

Navigate to the client directory:
```bash
cd ../client
```

Install dependencies:
```bash
npm install
```

Create a `.env` file (if needed) or ensure your API endpoints match the backend URL.

### 4. Database Setup

Ensure your PostgreSQL database is running and accessible with the credentials provided in the `.env` file. The Prisma migrations will automatically create the necessary tables:

- **Users** (with role-based authentication)
- **Courses** (with instructor relationships)
- **Lectures** (supporting both reading and quiz types)
- **CoursesEnrolled** (tracking student enrollments and progress)

## 🚀 Running the Application

### Start the Backend Server
```bash
cd server
npm run dev
```
The API server will start on `http://localhost:3000`

### Start the Frontend Development Server
```bash
cd client
npm run dev
```
The client application will start on `http://localhost:5173`

### Additional Commands

**Backend:**
- `npm run build` - Build TypeScript to JavaScript
- `npm run start` - Run production build
- `npm run prisma:studio` - Open Prisma Studio for database management

**Frontend:**
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗 Architecture Overview

### Architecture Decisions & Rationale

**Frontend Framework Choice - React with TypeScript:**
- **React**: Chosen for its component-based architecture, extensive ecosystem, and excellent developer experience
- **TypeScript**: Provides type safety, better IDE support, and reduced runtime errors
- **Vite**: Fast build tool with excellent hot reload and modern development experience

**Backend Language & Framework - Node.js with Express:**
- **Node.js**: Enables full-stack JavaScript/TypeScript development, reducing context switching
- **Express.js**: Lightweight, flexible, and well-established framework with extensive middleware ecosystem
- **TypeScript**: Consistent language across frontend and backend, improving maintainability

**Database Choice - PostgreSQL:**
- **PostgreSQL**: Robust relational database with excellent JSON support for flexible quiz content storage
- **ACID Compliance**: Ensures data integrity for user enrollments and progress tracking
- **Scalability**: Handles complex relationships between users, courses, and lectures efficiently

**ORM Choice - Prisma:**
- **Type Safety**: Auto-generated TypeScript client ensures type safety across the application
- **Developer Experience**: Excellent tooling including Prisma Studio for database management
- **Migration System**: Robust migration system for database schema evolution

**Authentication Strategy - JWT with HTTP-only Cookies:**
- **Security**: HTTP-only cookies prevent XSS attacks while maintaining user sessions
- **Stateless**: JWT enables scalable authentication without server-side session storage
- **Role-based Access**: Clean separation between student and instructor capabilities

**File Storage - AWS S3:**
- **Scalability**: Handles file uploads without server storage limitations
- **Performance**: CDN capabilities for fast content delivery
- **Reliability**: Enterprise-grade storage with high availability

### Project Structure

```
academa/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-specific page components
│   │   ├── Layout/         # Layout wrapper components
│   │   ├── lib/            # Utility functions and API client
│   │   └── types/          # TypeScript type definitions
│   └── public/             # Static assets
└── server/                 # Express.js backend application
    ├── src/
    │   ├── controllers/    # Request handlers for different routes
    │   ├── middlewares/    # Authentication and authorization middleware
    │   ├── routes/         # API route definitions
    │   ├── config/         # Configuration files (database, AWS)
    └── prisma/             # Database schema and migrations
```

### API Architecture

The backend follows a RESTful API design with the following route structure:
- `/api/v1/auth/*` - Authentication endpoints
- `/api/v1/dashboard/*` - Course and user data endpoints
- `/api/v1/instructor/*` - Instructor-specific course management
- `/api/v1/student/*` - Student enrollment and progress tracking

### Security Features

- **Password Hashing**: Argon2 for secure password storage
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Configured for specific frontend origins
- **Helmet Security**: HTTP security headers
- **Role-based Authorization**: Middleware-enforced access control
