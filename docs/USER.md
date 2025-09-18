# User Module API Documentation

This document describes the user management API endpoints for the backend service.

## Endpoints

### 1. Get All Users

-  **URL:** `/users`
-  **Method:** `GET`
-  **Description:** Retrieve all users with pagination.
-  **Access:** Admin only
-  **Headers:**
   ```
   Authorization: Bearer <admin_jwt_token>
   ```
-  **Query Parameters:**
   -  `page` (optional): Page number (default: 1)
   -  `pageSize` (optional): Items per page (default: 10, max: 100)
-  **Response:**
   ```json
   {
      "data": [
         {
            "id": 1,
            "name": "John Doe",
            "email": "john@example.com",
            "role": "customer",
            "status": "active",
            "created_at": "2025-09-18T10:00:00.000Z",
            "updated_at": "2025-09-18T10:00:00.000Z"
         },
         {
            "id": 2,
            "name": "Jane Smith",
            "email": "jane@example.com",
            "role": "vendor",
            "status": "active",
            "created_at": "2025-09-18T10:05:00.000Z",
            "updated_at": "2025-09-18T10:05:00.000Z"
         },
         {
            "id": 3,
            "name": "Admin User",
            "email": "admin@example.com",
            "role": "admin",
            "status": "active",
            "created_at": "2025-09-18T09:00:00.000Z",
            "updated_at": "2025-09-18T09:00:00.000Z"
         }
      ],
      "pagination": {
         "page": 1,
         "pageSize": 10,
         "total": 25,
         "totalPages": 3,
         "hasNext": true,
         "hasPrev": false
      }
   }
   ```

## Example Usage

#### Get All Users (Admin only)

```bash
curl -X GET "http://localhost:3000/users?page=1&pageSize=20" \
  -H "Authorization: Bearer <admin_jwt_token>"
```

## Access Control

The user endpoints have strict access control:

### Admin Access Required:

-  `GET /users` - View all users with pagination

### Note on User Creation:

User registration is handled through the **Auth Module** endpoints:

-  `POST /auth/register` - Register new users (public)
-  See [AUTH.md](./AUTH.md) for complete authentication documentation

## Data Models

### User Object

```json
{
   "id": 1,
   "name": "John Doe",
   "email": "john@example.com",
   "role": "customer",
   "status": "active",
   "created_at": "2025-09-18T10:00:00.000Z",
   "updated_at": "2025-09-18T10:00:00.000Z"
}
```

### User Roles

-  `super_admin` - Super administrator with highest privileges
-  `admin` - Administrator with management privileges
-  `vendor` - Vendor who can manage products
-  `customer` - Regular customer who can place orders

### User Status Values

-  `active` - User account is active and functional
-  `inactive` - User account is temporarily disabled
-  `banned` - User account is permanently banned

## Data Validation

### Pagination Parameters:

-  **page:** Positive integer (optional, default: 1)
-  **pageSize:** Positive integer (optional, default: 10, max: 100)

### User Registration (via Auth Module):

-  **name:** String, 3-32 characters
-  **email:** Valid email format, 5-99 characters (must be unique)
-  **password:** String, 8-32 characters

## Security Features

### Password Security:

-  Passwords are hashed using **Argon2** algorithm
-  Original passwords are never stored or returned in responses
-  Password field is automatically excluded from all user queries

### Role-Based Access:

-  Only administrators can view user lists
-  User registration creates accounts with `customer` role by default
-  Role assignment for other roles (admin, vendor) requires separate processes

## Business Logic

### User Creation Process:

1. **Email uniqueness validation** - Ensures no duplicate accounts
2. **Password hashing** - Uses Argon2 for secure password storage
3. **Default role assignment** - New users get `customer` role
4. **Default status** - New users get `active` status
5. **Automatic timestamps** - Sets created_at and updated_at

### User Listing (Admin):

1. **Excludes password field** for security
2. **Supports pagination** for efficient data retrieval
3. **Returns complete user information** except sensitive data

## Error Responses

Common error responses for user endpoints:

-  **401 Unauthorized:** Missing or invalid JWT token
-  **403 Forbidden:** Insufficient permissions (non-admin trying to access user list)
-  **400 Bad Request:** Invalid pagination parameters

Example error responses:

#### Access Denied Error

```json
{
   "statusCode": 403,
   "message": "Forbidden resource",
   "error": "Forbidden"
}
```

#### Invalid Pagination Error

```json
{
   "statusCode": 400,
   "message": [
      "page must be a positive number",
      "pageSize must not be greater than 100"
   ],
   "error": "Bad Request"
}
```

#### Unauthorized Access

```json
{
   "statusCode": 401,
   "message": "Unauthorized",
   "error": "Unauthorized"
}
```

## Related Endpoints

For complete user management functionality, see these related modules:

### Authentication (AUTH Module):

-  **User Registration:** `POST /auth/register`
-  **User Login:** `POST /auth/login`
-  **Get Profile:** `GET /auth/profile`

### Orders (ORDER Module):

-  **Get User Orders:** `GET /orders/customers/:customerId`

### Products (PRODUCT Module):

-  **Get Vendor Products:** `GET /products/vendors/:vendorId`

## Module Scope

The User Module is focused on **administrative user management**:

-  **Primary Function:** Allow administrators to view all users
-  **Security Focus:** Strict admin-only access with password exclusion
-  **Integration:** Works with Auth module for user creation and authentication

For user-facing operations like registration, login, and profile management, refer to the **Auth Module** documentation.

## Features

### Administrative Features:

-  **User Listing:** Paginated view of all system users
-  **Role Visibility:** View user roles and status
-  **Security:** Password information never exposed
-  **Filtering:** Efficient pagination for large user bases

### Security Features:

-  **Admin-Only Access:** Protects user privacy
-  **Password Protection:** Automatic password field exclusion
-  **JWT Authentication:** Secure token-based access
-  **Role Verification:** Ensures only admins can access user data
