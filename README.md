# EagleBank API

A production-ready TypeScript REST API for a complete banking application built with Express, Prisma, and SQLite. Features user management, bank account operations, and financial transactions with enterprise-grade security.

## Features

- 🔐 JWT-based authentication with bcrypt password hashing
- 👥 Complete user management (CRUD operations)
- 🏦 Bank account management with unique account numbers
- 💰 Real-time transaction processing (deposits/withdrawals)
- 🛡️ Comprehensive security (Helmet, CORS, input validation)
- ✅ Request validation with Zod schemas
- 🗄️ Database management with Prisma ORM
- 🚀 TypeScript with strict mode
- 📝 Centralized error handling
- 🏗️ Layered architecture (routes, controllers, services)
- 🧪 Comprehensive testing suite
- 🐳 Docker support for consistent development
- 📊 Full audit trail for all financial operations

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: SQLite (via Prisma)
- **Authentication**: JWT + bcryptjs
- **Validation**: Zod
- **Security**: Helmet, CORS, input sanitization
- **Testing**: Jest
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
├── app.ts                 # Express app configuration & middleware
├── server.ts              # Server startup & database connection
├── routes/                # Route definitions
│   ├── userRoutes.ts      # User management endpoints
│   ├── authRoutes.ts      # Authentication endpoints
│   ├── accountRoutes.ts   # Account management endpoints
│   └── transactionRoutes.ts # Transaction endpoints
├── controllers/           # Request handling logic
│   ├── userController.ts
│   ├── authController.ts
│   ├── accountController.ts
│   └── transactionController.ts
├── services/              # Business logic & database operations
│   ├── userService.ts
│   ├── authService.ts
│   ├── accountService.ts
│   └── transactionService.ts
├── middleware/            # Custom middleware
│   ├── auth.ts            # JWT authentication
│   ├── errorHandler.ts    # Error handling
│   └── validation.ts      # Request validation
├── db/                    # Database configuration
│   └── client.ts          # Prisma client
├── types/                 # TypeScript type definitions
│   └── index.ts
└── __tests__/             # Test files
    ├── userService.test.ts
    ├── accountService.test.ts
    ├── validation.test.ts
    └── ...
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

### **Testing**

- `npm test` - Run all tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:watch` - Run tests in watch mode

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

## 🧪 Complete API Testing Guide

### **Prerequisites**

Make sure your server is running:

```bash
npm run dev
# Look for: 🚀 Server running on port 3000
```

### **Step 1: Health Check**

```bash
curl http://localhost:3000/health
```

### **Step 2: Create a New User**

```bash
curl -X POST http://localhost:3000/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo.user@example.com",
    "password": "SecurePassword123",
    "firstName": "Demo",
    "lastName": "User"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "id": "user_id_here",
    "email": "demo.user@example.com",
    "firstName": "Demo",
    "lastName": "User",
    "createdAt": "2025-08-13T...",
    "updatedAt": "2025-08-13T..."
  },
  "message": "User created successfully"
}
```

**Save the user ID for later use!**

### **Step 3: Login to Get JWT Token**

```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo.user@example.com",
    "password": "SecurePassword123"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

**Copy the entire JWT token (starts with "eyJ...")**

### **Step 4: Create a Bank Account**

```bash
# Replace YOUR_JWT_TOKEN with the actual token from step 3
curl -X POST http://localhost:3000/v1/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "accountNumber": "12345678",
    "currency": "GBP",
    "type": "CHECKING"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "id": "account_id_here",
    "accountNumber": "12345678",
    "balance": 0,
    "currency": "GBP",
    "type": "CHECKING",
    "status": "ACTIVE",
    "createdAt": "2025-08-13T...",
    "updatedAt": "2025-08-13T...",
    "userId": "user_id_here"
  },
  "message": "Account created successfully"
}
```

**Save the account ID for later use!**

### **Step 5: Create a Deposit Transaction**

```bash
# Replace YOUR_JWT_TOKEN and ACCOUNT_ID with actual values
curl -X POST http://localhost:3000/v1/accounts/ACCOUNT_ID/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "DEPOSIT",
    "amount": 1000.50,
    "description": "Initial deposit"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "data": {
    "id": "transaction_id_here",
    "type": "DEPOSIT",
    "amount": 1000.5,
    "description": "Initial deposit",
    "balanceBefore": 0,
    "balanceAfter": 1000.5,
    "createdAt": "2025-08-13T...",
    "updatedAt": "2025-08-13T...",
    "accountId": "account_id_here"
  },
  "message": "Transaction created successfully"
}
```

**Save the transaction ID for later use!**

### **Step 6: Create a Withdrawal Transaction**

```bash
curl -X POST http://localhost:3000/v1/accounts/ACCOUNT_ID/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "WITHDRAWAL",
    "amount": 250.75,
    "description": "ATM withdrawal"
  }'
```

### **Step 7: Test Insufficient Funds (Should Fail)**

```bash
curl -X POST http://localhost:3000/v1/accounts/ACCOUNT_ID/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "WITHDRAWAL",
    "amount": 1000.00,
    "description": "Large withdrawal"
  }'
```

**Expected Response (Error):**

```json
{
  "success": false,
  "error": "Insufficient funds"
}
```

### **Step 8: Get Account Details**

```bash
curl -X GET http://localhost:3000/v1/accounts/ACCOUNT_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Notice the balance has been updated!**

### **Step 9: List Account Transactions**

```bash
curl -X GET "http://localhost:3000/v1/accounts/ACCOUNT_ID/transactions" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Step 10: Get Specific Transaction**

```bash
# Replace TRANSACTION_ID with actual transaction ID
curl -X GET "http://localhost:3000/v1/accounts/ACCOUNT_ID/transactions/TRANSACTION_ID" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Step 11: Get User Transaction History**

```bash
curl -X GET "http://localhost:3000/v1/transactions" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Step 12: List All User Accounts**

```bash
curl -X GET http://localhost:3000/v1/accounts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Step 13: Update Account**

```bash
curl -X PATCH http://localhost:3000/v1/accounts/ACCOUNT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "SAVINGS"
  }'
```

### **Step 14: Test Error Scenarios**

#### Invalid JWT Token

```bash
curl -X GET http://localhost:3000/v1/accounts \
  -H "Authorization: Bearer invalid_token_here"
```

#### Missing Authorization Header

```bash
curl -X GET http://localhost:3000/v1/accounts
```

#### Invalid Transaction Data

```bash
curl -X POST http://localhost:3000/v1/accounts/ACCOUNT_ID/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "type": "INVALID_TYPE",
    "amount": -100
  }'
```

## 🚀 Quick Reference Commands

### **Health Check**

```bash
curl http://localhost:3000/health
```

### **Create User**

```bash
curl -X POST http://localhost:3000/v1/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePassword123","firstName":"Test","lastName":"User"}'
```

### **Login & Get Token**

```bash
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePassword123"}'
```

### **Create Account**

```bash
curl -X POST http://localhost:3000/v1/accounts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"accountNumber":"12345678","currency":"GBP","type":"CHECKING"}'
```

### **Create Transaction**

```bash
curl -X POST http://localhost:3000/v1/accounts/ACCOUNT_ID/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"type":"DEPOSIT","amount":100,"description":"Test deposit"}'
```

## 🔧 Troubleshooting

### **Common Issues:**

1. **Port Already in Use**

   ```bash
   pkill -f "ts-node-dev"
   npm run dev
   ```

2. **Database Issues**

   ```bash
   npm run db:push
   ```

3. **JWT Token Expired**
   - Just login again to get a new token

4. **Curl Command Issues**
   - Make sure you're using the correct quotes
   - Check that the JWT token is complete
   - Verify the account ID is correct

## API Endpoints

### **Public Endpoints (No Authentication)**

| Method | Endpoint         | Description             |
| ------ | ---------------- | ----------------------- |
| `POST` | `/v1/users`      | Create new user account |
| `POST` | `/v1/auth/login` | User authentication     |
| `GET`  | `/health`        | Server health status    |

### **Protected Endpoints (JWT Required)**

| Method   | Endpoint                                              | Description                  |
| -------- | ----------------------------------------------------- | ---------------------------- |
| `GET`    | `/v1/users/:userId`                                   | Get user profile             |
| `PATCH`  | `/v1/users/:userId`                                   | Update user profile          |
| `DELETE` | `/v1/users/:userId`                                   | Delete user account          |
| `POST`   | `/v1/accounts`                                        | Create bank account          |
| `GET`    | `/v1/accounts`                                        | List user accounts           |
| `GET`    | `/v1/accounts/:accountId`                             | Get account details          |
| `PATCH`  | `/v1/accounts/:accountId`                             | Update account               |
| `DELETE` | `/v1/accounts/:accountId`                             | Delete account               |
| `POST`   | `/v1/accounts/:accountId/transactions`                | Create transaction           |
| `GET`    | `/v1/accounts/:accountId/transactions`                | List account transactions    |
| `GET`    | `/v1/accounts/:accountId/transactions/:transactionId` | Get transaction details      |
| `GET`    | `/v1/transactions`                                    | Get user transaction history |

## Database Schema

The application includes three main models:

- **User**: Authentication and profile information
- **Account**: Bank accounts with balance tracking and unique account numbers
- **Transaction**: Financial transaction records with balance before/after tracking

### **Key Relationships**

```
User (1) ←→ (Many) Account (1) ←→ (Many) Transaction
```

### **Business Rules**

- Users can have multiple accounts
- Each account has a unique account number
- Transactions automatically update account balances
- Withdrawals cannot exceed available balance
- All operations are atomic (database transactions)

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

### **HTTP Status Codes**

| Code  | Meaning        | Usage                                       |
| ----- | -------------- | ------------------------------------------- |
| `200` | OK             | Successful GET, PATCH, DELETE               |
| `201` | Created        | Successful POST                             |
| `400` | Bad Request    | Validation errors, business rule violations |
| `401` | Unauthorized   | Invalid or missing JWT token                |
| `403` | Forbidden      | User doesn't own the resource               |
| `404` | Not Found      | Resource doesn't exist                      |
| `409` | Conflict       | Duplicate data, business conflicts          |
| `500` | Internal Error | Server-side errors                          |

## Testing

### **Run All Tests**

```bash
npm test
```

### **Run Tests with Coverage**

```bash
npm run test:coverage
```

### **Test Coverage Includes**

- ✅ User service operations
- ✅ Account service operations
- ✅ Transaction service operations
- ✅ Validation schemas
- ✅ Error handling

## Development

The project is fully implemented with:

1. ✅ **User Management**: Complete CRUD operations
2. ✅ **Authentication**: JWT-based login system
3. ✅ **Account Management**: Bank account CRUD operations
4. ✅ **Transaction Processing**: Deposits, withdrawals, balance tracking
5. ✅ **Security**: Input validation, authentication, authorization
6. ✅ **Testing**: Comprehensive test suite
7. ✅ **Documentation**: Complete API documentation

## Contributing

1. Follow the existing code structure
2. Add proper TypeScript types
3. Include validation with Zod
4. Handle errors consistently
5. Add tests for new features
6. Update this README for new endpoints

## License

MIT
