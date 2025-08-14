# Club Link API Test Endpoint

This document describes the test API endpoint `/api/test-db` that provides basic CRUD operations for testing the database connection and operations.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up your environment variables:

   ```bash
   # Create a .env file with your database connection
   POSTGRES_URL=postgresql://username:password@localhost:5432/club_link
   ```

3. Run database migrations:

   ```bash
   npm run db:migrate
   ```

4. Seed the database with test data:
   ```bash
   npm run db:seed
   ```

## Running the API

### Development Mode

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm start
```

## Test API Endpoint: `/api/test-db`

### GET /api/test-db

Retrieves all users from the database.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "role": "member",
      "clerkId": "clerk_user_id",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "count": 1
}
```

### POST /api/test-db

Creates a new user.

**Request Body:**

```json
{
  "email": "newuser@example.com",
  "role": "member",
  "clerkId": "clerk_user_id"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "newuser@example.com",
    "role": "member",
    "clerkId": "clerk_user_id",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "User created successfully"
}
```

### PUT /api/test-db?id=:id

Updates an existing user by ID.

**Query Parameters:**

- `id`: The UUID of the user to update

**Request Body:**

```json
{
  "email": "updated@example.com",
  "role": "admin"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "updated@example.com",
    "role": "admin",
    "clerkId": "clerk_user_id",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "User updated successfully"
}
```

### DELETE /api/test-db?id=:id

Deletes a user by ID.

**Query Parameters:**

- `id`: The UUID of the user to delete

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "member",
    "clerkId": "clerk_user_id",
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z"
  },
  "message": "User deleted successfully"
}
```

## Testing the API

### Database Management

```bash
# Seed the database with test data
npm run db:seed

# Reset the database (clear all data)
npm run db:reset

# Run database smoke test
npm run db:smoke
```

### Using the Test Script

Run the automated test script to verify all CRUD operations:

```bash
npm run test:api
```

### Using cURL

```bash
# Get all users
curl http://localhost:3000/api/test-db

# Create a user
curl -X POST http://localhost:3000/api/test-db \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","role":"member","clerkId":"test123"}'

# Update a user (replace UUID with actual user ID)
curl -X PUT "http://localhost:3000/api/test-db?id=UUID" \
  -H "Content-Type: application/json" \
  -d '{"email":"updated@example.com"}'

# Delete a user (replace UUID with actual user ID)
curl -X DELETE "http://localhost:3000/api/test-db?id=UUID"
```

### Using Postman or Similar Tools

1. Set the base URL to `http://localhost:3000`
2. Use the endpoints above with appropriate HTTP methods
3. For POST and PUT requests, set Content-Type header to `application/json`

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message",
  "details": "Additional error details (if applicable)"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Validation

The API uses Zod schemas to validate input data:

- **Email**: Must be a valid email format
- **Role**: Must be one of: `admin`, `owner`, `member`
- **Clerk ID**: Must be a non-empty string

## Notes

- This is a test endpoint for development purposes
- All operations are performed on the `users` table
- The `updatedAt` field is automatically updated on PUT operations
- UUIDs are automatically generated for new users
- Timestamps are automatically set for `createdAt` and `updatedAt`
