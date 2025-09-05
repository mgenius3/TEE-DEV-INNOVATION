# JWT Authentication API - Service/Controller Architecture

A RESTful API built with Node.js, TypeScript, and MySQL that provides user authentication using JSON Web Tokens (JWT). This project follows a clean architecture pattern with separate layers for controllers, services, and models.

## Architecture Overview

The application follows a layered architecture pattern:

```
├── Controllers (HTTP handling)
├── Services (Business logic)
├── Models (Data access)
├── Middleware (Auth, validation, error handling)
└── Routes (Endpoint definitions)
```

### Layer Responsibilities

- **Controllers**: Handle HTTP requests/responses, validation, and error formatting
- **Services**: Contain business logic and orchestrate data operations
- **Models**: Handle database operations and data persistence
- **Middleware**: Cross-cutting concerns like authentication and error handling
- **Routes**: Define API endpoints and apply middleware

## Features

- User registration with email validation
- User login with JWT token generation
- Protected routes using JWT middleware
- User profile management (get, update, delete)
- Password hashing with bcrypt
- Input validation with express-validator
- TypeScript for type safety
- MySQL database with connection pooling
- Clean separation of concerns with service/controller pattern

## API Endpoints

### Authentication Routes

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/login
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Protected User Routes

#### GET /users/me
Get the current user's profile (requires JWT token).

**Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Response (200):**
```json
{
  "message": "User profile retrieved successfully",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T00:00:00.000Z"
  }
}
```

#### PUT /users/me
Update the current user's profile (requires JWT token).

**Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Request Body (both fields optional):**
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

**Response (200):**
```json
{
  "message": "User profile updated successfully",
  "user": {
    "id": 1,
    "email": "john.smith@example.com",
    "name": "John Smith",
    "created_at": "2025-01-01T00:00:00.000Z",
    "updated_at": "2025-01-01T12:30:00.000Z"
  }
}
```

#### DELETE /users/me
Delete the current user's account (requires JWT token).

**Headers:**
```
Authorization: Bearer your_jwt_token_here
```

**Response (200):**
```json
{
  "message": "User account deleted successfully"
}
```

### Health Check

#### GET /health
Check if the API is running.

**Response (200):**
```json
{
  "message": "API is running!"
}
```

## Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd tee_dev_jwt-auth-api
```

### 2. Install dependencies
```bash
npm install
```

### 3. Database Setup
Create a MySQL database:
```sql
CREATE DATABASE tee_dev_jwt_auth_db;
```

### 4. Environment Configuration
Copy the example environment file and update it with your configuration:
```bash
cp  .env
```

Edit the `.env` file with your database credentials:
```env
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=8889 #set according to your MYSQL DB PORT
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=tee_dev_jwt_auth_db

# JWT Configuration
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRES_IN=24h
```

### 5. Build the application
```bash
npm run build
```

### 6. Start the server

For development (with auto-reload):
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## Project Structure

```
src/
├── config/
│   └── database.ts              # Database connection configuration
├── controllers/
│   ├── auth.ts                  # Authentication HTTP handlers
│   └── user.ts                  # User management HTTP handlers
├── services/
│   ├── auth.ts                  # Authentication business logic
│   └── user.ts                  # User management business logic
├── middleware/
│   ├── auth.ts                  # JWT authentication middleware
│   └── errorHandler.ts          # Global error handling
├── models/
│   └── User.ts                  # User model and database operations
├── routes/
│   ├── auth.ts                  # Authentication routes
│   └── users.ts                 # User-related routes
├── utils/
│   └── jwt.ts                   # JWT utility functions
└── server.ts                    # Main application entry point
```

## Architecture Benefits

### Service Layer Advantages
- **Business Logic Separation**: All business rules are contained in services
- **Reusability**: Services can be used by different controllers or even background jobs
- **Testability**: Business logic can be tested independently of HTTP concerns
- **Maintainability**: Changes to business rules only affect the service layer

### Controller Layer Advantages
- **HTTP Concerns**: Handles request/response formatting and HTTP status codes
- **Validation**: Manages input validation and error responses
- **Thin Controllers**: Controllers remain lightweight and focused on HTTP handling

### Error Handling Strategy
- **Service Errors**: Services throw descriptive errors (e.g., 'USER_NOT_FOUND', 'EMAIL_ALREADY_EXISTS')
- **Controller Translation**: Controllers translate service errors to appropriate HTTP responses
- **Consistent Responses**: All API responses follow the same format

## Database Schema

The application automatically creates the following table:

```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Security Features

- **Password Hashing**: Uses bcrypt with salt rounds for secure password storage
- **JWT Authentication**: Stateless authentication with configurable expiration
- **Input Validation**: Server-side validation using express-validator
- **SQL Injection Protection**: Uses parameterized queries with mysql2
- **CORS**: Cross-Origin Resource Sharing enabled
- **Environment Variables**: Sensitive data stored in environment variables

## Error Handling

The API includes comprehensive error handling for:
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Database errors (500)

Service-level errors are translated to appropriate HTTP responses by controllers.

## Testing with Postman

1. Import the Postman collection (see `postman-collection.json`)
2. Set up environment variables in Postman:
   - `base_url`: `http://localhost:3000`
   - `token`: (will be set automatically after login)

The collection includes requests for:
- User registration
- User login
- Get user profile
- Update user profile
- Delete user account



## Dependencies

### Runtime Dependencies
- `express`: Web framework
- `cors`: Cross-Origin Resource Sharing
- `dotenv`: Environment variable management
- `mysql2`: MySQL client with Promise support
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT token generation and validation
- `express-validator`: Input validation

### Development Dependencies
- `typescript`: TypeScript compiler
- `ts-node-dev`: Development server with auto-reload
- `@types/*`: TypeScript definitions

