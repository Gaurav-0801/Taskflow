# TaskFlow - Full-Stack Task Management App

A modern, production-ready task management application built with Next.js 16, Express.js, TypeScript, PostgreSQL (Neon), and Tailwind CSS.

## Features

- **Secure Authentication**: bcrypt password hashing with JWT token management
- **Full CRUD Operations**: Create, read, update, and delete tasks
- **Task Management**: Priority levels, status tracking, due dates, and search functionality
- **Profile Management**: Update user profile information
- **Responsive Design**: Mobile-first UI with Tailwind CSS and Framer Motion animations
- **Form Validation**: Client and server-side validation with Zod and React Hook Form
- **PostgreSQL Database**: Scalable data persistence with Neon
- **Middleware Protection**: Route-level authentication guards
- **Modern UI Components**: Built with shadcn/ui
- **Beautiful UI/UX**: Enhanced with animations, gradients, and modern design patterns

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Form Management**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: Sonner

### Backend
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **Authentication**: JWT + bcrypt
- **Validation**: Zod

## Architecture

```
Next.js Frontend (Port 3000) → Express Backend API (Port 3001) → PostgreSQL Database
```

## Deployment Links

### Production
- **Frontend**: [https://taskflow-self-omega.vercel.app/](https://taskflow-self-omega.vercel.app/)
- **Backend API**: [https://taskflow-zxih.onrender.com/](https://taskflow-zxih.onrender.com/)

### Local Development
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Neon PostgreSQL database
- pnpm or npm

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. Set up environment variables:

   **Root `.env.local` (for local development):**
   ```env
   DATABASE_URL=postgresql://user:password@host/database
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

   **Root `.env.local` (for production):**
   ```env
   DATABASE_URL=postgresql://user:password@host/database
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NEXT_PUBLIC_API_URL=https://taskflow-zxih.onrender.com
   ```

   **Backend `.env` (for local development):**
   ```env
   PORT=3001
   DATABASE_URL=postgresql://user:password@host/database
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CORS_ORIGIN=http://localhost:3000
   NODE_ENV=development
   ```

   **Backend `.env` (for production):**
   ```env
   PORT=3001
   DATABASE_URL=postgresql://user:password@host/database
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   CORS_ORIGIN=https://taskflow-self-omega.vercel.app
   NODE_ENV=production
   ```

5. Run the database migration:
   The SQL script in `scripts/001-create-schema.sql` will create the necessary tables.

6. Start the development servers:

   **Option 1: Run both together**
   ```bash
   npm run dev:all
   ```

   **Option 2: Run separately**
   ```bash
   # Terminal 1 - Frontend
   npm run dev:frontend

   # Terminal 2 - Backend
   npm run dev:backend
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
Taskflow/
├── backend/              # Express Backend API
│   ├── src/
│   │   ├── server.ts     # Express app entry point
│   │   ├── routes/        # API route handlers
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Auth, validation, error handling
│   │   ├── utils/         # Database and auth utilities
│   │   └── validators/    # Zod schemas
│   └── package.json
├── app/                   # Next.js App Router
│   ├── dashboard/         # Dashboard page
│   ├── login/            # Login page
│   ├── signup/           # Sign up page
│   └── page.tsx          # Landing page
├── components/           # React components
│   ├── ui/              # shadcn/ui components
│   ├── dashboard-header.tsx
│   ├── task-list.tsx    # Task list with search
│   ├── task-card.tsx
│   ├── create-task-dialog.tsx
│   ├── edit-task-dialog.tsx
│   └── profile-dialog.tsx
├── lib/
│   ├── api-client.ts    # API client for backend calls
│   ├── validations.ts   # Zod validation schemas
│   └── auth.ts         # Authentication utilities
├── types/
│   └── index.ts        # TypeScript type definitions
├── scripts/
│   └── 001-create-schema.sql  # Database schema
├── middleware.ts        # Next.js middleware for route protection
├── API.md              # API documentation
├── SCALABILITY.md      # Scalability documentation
└── postman_collection.json  # Postman collection
```

## Database Schema

### Users Table
- `id`: Primary key
- `email`: Unique email address
- `password_hash`: Hashed password
- `name`: User's full name
- `created_at`, `updated_at`: Timestamps

### Tasks Table
- `id`: Primary key
- `user_id`: Foreign key to users
- `title`: Task title
- `description`: Task description
- `status`: pending | in-progress | completed
- `priority`: low | medium | high
- `due_date`: Optional due date
- `created_at`, `updated_at`: Timestamps

## API Documentation

See [API.md](./API.md) for complete API documentation.

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT tokens stored in HTTP-only cookies
- Middleware-based route protection
- SQL injection prevention with parameterized queries
- CSRF protection with SameSite cookies
- Input validation with Zod on both client and server

## Available Scripts

### Frontend
- `npm run dev` or `npm run dev:frontend` - Start Next.js dev server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend
- `cd backend && npm run dev` - Start Express dev server with hot reload
- `cd backend && npm run build` - Compile TypeScript
- `cd backend && npm run start` - Start production server

### Both
- `npm run dev:all` - Run both frontend and backend concurrently

## Scalability

See [SCALABILITY.md](./SCALABILITY.md) for detailed scalability strategies and production deployment considerations.

## Testing the API

Import the `postman_collection.json` file into Postman to test all API endpoints.

## Deployment

### Production Deployment Links
- **Frontend**: [https://taskflow-self-omega.vercel.app/](https://taskflow-self-omega.vercel.app/)
- **Backend API**: [https://taskflow-zxih.onrender.com/](https://taskflow-zxih.onrender.com/)

### Frontend (Vercel)
1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables:
   - `NEXT_PUBLIC_API_URL` - Your backend API URL (e.g., `https://taskflow-zxih.onrender.com`)
   - `JWT_SECRET` - For middleware token verification
4. Deploy

### Backend (Render)
1. Build the TypeScript code: `cd backend && npm run build`
2. Deploy to Render (or your preferred hosting: Railway, AWS, etc.)
3. Set environment variables:
   - `PORT` - Server port (default: 3001)
   - `DATABASE_URL` - PostgreSQL connection string
   - `JWT_SECRET` - Secret key for JWT tokens
   - `CORS_ORIGIN` - Frontend URL (e.g., `https://taskflow-self-omega.vercel.app`)
   - `NODE_ENV` - Set to `production`
4. Ensure CORS_ORIGIN points to your frontend URL

## License

Built as an internship assignment demonstrating full-stack development skills.
#
