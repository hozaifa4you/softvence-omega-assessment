# Auth Module API Documentation

This document describes the authentication API endpoints for the backend service.

## Endpoints

### 1. Register User

-  **URL:** `/auth/register`
-  **Method:** `POST`
-  **Description:** Register a new user.
-  **Request Body:**
   ```json
   {
      "email": "user@example.com",
      "password": "yourPassword",
      "name": "John Doe"
   }
   ```
-  **Response:**
   ```json
   {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
   }
   ```

### 2. Login

-  **URL:** `/auth/login`
-  **Method:** `POST`
-  **Description:** Authenticate user and return JWT token.
-  **Request Body:**
   ```json
   {
      "email": "user@example.com",
      "password": "yourPassword"
   }
   ```
-  **Response:**
   ```json
   {
      "access_token": "<jwt_token>"
   }
   ```

### 3. Get Profile

-  **URL:** `/auth/profile`
-  **Method:** `GET`
-  **Description:** Get authenticated user's profile. Requires JWT token in `Authorization` header.
-  **Headers:**
   `Authorization: Bearer <jwt_token>`
-  **Response:**
   ```json
   {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
   }
   ```

## Example Usage

#### Register

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"yourPassword","name":"John Doe"}'
```

#### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"yourPassword"}'
```

#### Get Profile

```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <jwt_token>"
```

## Authentication Flow

1. **Register** a new user account with email, password, and name
2. **Login** with email and password to receive a JWT token
3. **Use the JWT token** in the Authorization header for protected endpoints
4. **Access profile** and other protected resources using the token

## Error Responses

Common error responses for authentication endpoints:

-  **400 Bad Request:** Invalid request body or missing required fields
-  **401 Unauthorized:** Invalid credentials or missing/invalid JWT token
-  **409 Conflict:** Email already exists (for registration)

Example error response:

```json
{
   "statusCode": 401,
   "message": "Invalid credentials",
   "error": "Unauthorized"
}
```
