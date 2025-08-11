# EagleBank API

A minimal TypeScript REST API for an MVP banking application built with Express, Prisma, and SQLite.

## Features

- 🔐 JWT-based authentication
- 🛡️ Password hashing with bcrypt
- ✅ Request validation with Zod
- 🗄️ Database management with Prisma
- 🚀 TypeScript with strict mode
- 📝 Comprehensive error handling
- 🏗️ Scalable architecture ready for expansion
- 🐳 Docker support for consistent development

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite (via Prisma)
- **Authentication**: JWT + bcryptjs
- **Validation**: Zod
- **Security**: Helmet, CORS
- **Containerization**: Docker & Dev Containers

## Quick Start

### **Option 1: Local Development**

```bash
git clone <repository-url>
cd EagleBank
npm install
cp env.example .env
npm run db:generate
npm run db:push
npm run dev
```

### **Option 2: Docker Development**

```bash
git clone <repository-url>
cd EagleBank
cp env.example .env
npm run docker:dev
```

### **Option 3: VS Code Dev Container**

1. Install VS Code with Dev Containers extension
2. Open project in VS Code
3. Click "Reopen in Container" when prompted
4. Wait for container to build and start

## Project Structure

```
src/
├── app.ts              # Express app configuration & middleware
├── server.ts           # Server startup & database connection
├── routes/             # Route definitions
│   └── userRoutes.ts   # User-related endpoints
├── controllers/        # Request handling logic
│   └── userController.ts
├── services/           # Business logic & database operations
│   └── userService.ts
├── middleware/         # Custom middleware
│   ├── auth.ts         # JWT authentication
│   ├── errorHandler.ts # Error handling
│   └── validation.ts   # Request validation
├── db/                 # Database configuration
│   └── client.ts       # Prisma client
└── types/              # TypeScript type definitions
    └── index.ts
```

## Prerequisites

- Node.js 18+ (or Docker)
- npm or yarn
- VS Code with Dev Containers extension (optional)

## Setup Instructions

### **Local Development**

1. **Clone and install dependencies**

   ```bash
   git clone <repository-url>
   cd EagleBank
   npm install
   ```

2. **Environment configuration**

   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Database setup**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### **Docker Development**

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd EagleBank
   ```

2. **Environment configuration**

   ```bash
   cp env.example .env
   # Edit .env if needed
   ```

3. **Start with Docker**

   ```bash
   npm run docker:dev
   ```

4. **Stop Docker services**
   ```bash
   npm run docker:dev:down
   ```

### **VS Code Dev Container**

1. **Install Dev Containers extension** in VS Code
2. **Open project** in VS Code
3. **Reopen in Container** when prompted
4. **Wait for setup** - container will automatically:
   - Install dependencies
   - Generate Prisma client
   - Set up development environment

## Available Scripts

### **Development**

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server

### **Database**

- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio (database GUI)

### **Code Quality**

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

### **Docker**

- `npm run docker:dev` - Start development environment with Docker
- `npm run docker:dev:down` - Stop Docker development environment
- `npm run docker:build` - Build production Docker image
- `npm run docker:run` - Run production Docker container
- `npm run docker:clean` - Clean up Docker resources

## Testing Your API

### **Health Check**

```bash
curl http://localhost:3000/health
```

### **Create a User**

```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","firstName":"John","lastName":"Doe"}'
```

### **User Login**

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

### **Get User Profile (with JWT token)**

```bash
curl -X GET http://localhost:3000/api/v1/users/USER_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Database Management

### **View Database Tables**

```bash
sqlite3 prisma/dev.db ".tables"
```

### **View User Data**

```bash
sqlite3 prisma/dev.db "SELECT * FROM users;"
```

### **Open Visual Database Browser**

```bash
npm run db:studio
# Opens at http://localhost:5555
```

## API Endpoints

### Authentication

- `POST /api/v1/users` - User registration
- `POST /api/v1/auth/login` - User login

### User Management

- `GET /api/v1/users/:id` - Get user profile (authenticated)

### Health Check

- `GET /health` - Server health status

## Environment Variables

| Variable       | Description               | Default         |
| -------------- | ------------------------- | --------------- |
| `JWT_SECRET`   | Secret key for JWT tokens | Required        |
| `DATABASE_URL` | SQLite database file path | `file:./dev.db` |
| `PORT`         | Server port               | `3000`          |
| `NODE_ENV`     | Environment mode          | `development`   |

## Docker Configuration

### **Development Container**

- **File**: `.devcontainer/devcontainer.json`
- **Features**: Node.js 18, TypeScript, SQLite, Git, GitHub CLI
- **Extensions**: ESLint, Prettier, Prisma, TypeScript support
- **Ports**: 3000 (API), 5555 (Prisma Studio)

### **Docker Compose**

- **File**: `docker-compose.dev.yml`
- **Services**: API with hot reload, optional PostgreSQL
- **Volumes**: Source code, node_modules, database
- **Networks**: Isolated development network

### **Production Docker**

- **File**: `Dockerfile`
- **Multi-stage**: Build + production runtime
- **Security**: Non-root user, health checks
- **Optimization**: Minimal production image

## Database Schema

The application includes three main models:

- **User**: Authentication and profile information
- **Account**: Bank accounts with balance tracking
- **Transaction**: Financial transaction records

## Authentication

Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All errors return consistent JSON responses:

```json
{
  "success": false,
  "error": "Error message"
}
```

## Development

The project is set up for incremental development:

1. **Current Implementation**: User authentication and profile management
2. **Next Phase**: Account creation and management
3. **Future Phase**: Transaction processing and reporting

## Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include validation with Zod
4. Handle errors consistently
5. Add tests for new features

## License

MIT
