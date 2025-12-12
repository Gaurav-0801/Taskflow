# TaskFlow API Documentation

## Base URL

```
http://localhost:3001
```

## Authentication

All protected endpoints require authentication via JWT token stored in HTTP-only cookies. The token is automatically sent with each request.

### Authentication Flow

1. **Sign Up** - Create a new account
2. **Sign In** - Authenticate and receive JWT token
3. **Protected Endpoints** - Include `auth_token` cookie automatically
4. **Sign Out** - Clear authentication token

---

## Endpoints

### Authentication

#### POST /api/auth/signup

Create a new user account.

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
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `400` - Validation error
- `409` - User already exists

---

#### POST /api/auth/signin

Authenticate user and receive JWT token.

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
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `400` - Validation error
- `401` - Invalid credentials

---

#### POST /api/auth/signout

Sign out and clear authentication token.

**Response (200):**
```json
{
  "message": "Signed out successfully"
}
```

---

#### GET /api/auth/me

Get current authenticated user.

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `401` - Unauthorized
- `404` - User not found

---

### Tasks

#### GET /api/tasks

Get all tasks for the authenticated user.

**Response (200):**
```json
{
  "tasks": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Complete project",
      "description": "Finish the task management app",
      "status": "in-progress",
      "priority": "high",
      "due_date": "2024-01-15",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Errors:**
- `401` - Unauthorized

---

#### POST /api/tasks

Create a new task.

**Request Body:**
```json
{
  "title": "Complete project",
  "description": "Finish the task management app",
  "status": "pending",
  "priority": "high",
  "due_date": "2024-01-15"
}
```

**Response (201):**
```json
{
  "task": {
    "id": 1,
    "user_id": 1,
    "title": "Complete project",
    "description": "Finish the task management app",
    "status": "pending",
    "priority": "high",
    "due_date": "2024-01-15",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `400` - Validation error
- `401` - Unauthorized

---

#### PUT /api/tasks/:id

Update an existing task.

**Request Body:**
```json
{
  "title": "Updated title",
  "status": "completed",
  "priority": "medium"
}
```

**Response (200):**
```json
{
  "task": {
    "id": 1,
    "user_id": 1,
    "title": "Updated title",
    "description": "Finish the task management app",
    "status": "completed",
    "priority": "medium",
    "due_date": "2024-01-15",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `400` - Validation error
- `401` - Unauthorized
- `404` - Task not found

---

#### DELETE /api/tasks/:id

Delete a task.

**Response (200):**
```json
{
  "message": "Task deleted successfully"
}
```

**Errors:**
- `401` - Unauthorized
- `404` - Task not found

---

### Profile

#### GET /api/profile

Get user profile.

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `401` - Unauthorized
- `404` - User not found

---

#### PUT /api/profile

Update user profile.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "email": "jane@example.com",
    "name": "Jane Doe",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- `400` - Validation error
- `401` - Unauthorized
- `409` - Email already in use

---

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message"
}
```

For validation errors:

```json
{
  "error": "Validation error",
  "details": [
    {
      "path": ["email"],
      "message": "Invalid email address"
    }
  ]
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `500` - Internal Server Error

## Data Types

### Task Status
- `pending`
- `in-progress`
- `completed`

### Task Priority
- `low`
- `medium`
- `high`

