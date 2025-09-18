# Category Module API Documentation

This document describes the category management API endpoints for the backend service.

## Endpoints

### 1. Create Category

-  **URL:** `/categories`
-  **Method:** `POST`
-  **Description:** Create a new category.
-  **Access:** Admin only
-  **Headers:**
   ```
   Authorization: Bearer <jwt_token>
   Content-Type: application/json
   ```
-  **Request Body:**
   ```json
   {
      "name": "Electronics"
   }
   ```
-  **Response:**
   ```json
   {
      "id": 1,
      "name": "Electronics",
      "slug": "electronics",
      "created_at": "2025-09-18T10:00:00.000Z",
      "updated_at": "2025-09-18T10:00:00.000Z"
   }
   ```

### 2. Get All Categories

-  **URL:** `/categories`
-  **Method:** `GET`
-  **Description:** Retrieve all categories.
-  **Access:** All authenticated users
-  **Headers:**
   ```
   Authorization: Bearer <jwt_token>
   ```
-  **Response:**
   ```json
   [
      {
         "id": 1,
         "name": "Electronics",
         "slug": "electronics",
         "created_at": "2025-09-18T10:00:00.000Z",
         "updated_at": "2025-09-18T10:00:00.000Z"
      },
      {
         "id": 2,
         "name": "Clothing",
         "slug": "clothing",
         "created_at": "2025-09-18T10:05:00.000Z",
         "updated_at": "2025-09-18T10:05:00.000Z"
      }
   ]
   ```

### 3. Get Category by Slug

-  **URL:** `/categories/:slug`
-  **Method:** `GET`
-  **Description:** Retrieve a specific category by its slug.
-  **Access:** All authenticated users
-  **Headers:**
   ```
   Authorization: Bearer <jwt_token>
   ```
-  **Response:**
   ```json
   {
      "id": 1,
      "name": "Electronics",
      "slug": "electronics",
      "created_at": "2025-09-18T10:00:00.000Z",
      "updated_at": "2025-09-18T10:00:00.000Z"
   }
   ```

### 4. Update Category

-  **URL:** `/categories/:slug`
-  **Method:** `PUT`
-  **Description:** Update an existing category by its slug.
-  **Access:** Admin only
-  **Headers:**
   ```
   Authorization: Bearer <jwt_token>
   Content-Type: application/json
   ```
-  **Request Body:**
   ```json
   {
      "name": "Consumer Electronics"
   }
   ```
-  **Response:**
   ```json
   {
      "id": 1,
      "name": "Consumer Electronics",
      "slug": "electronics",
      "created_at": "2025-09-18T10:00:00.000Z",
      "updated_at": "2025-09-18T10:15:00.000Z"
   }
   ```

### 5. Delete Category

-  **URL:** `/categories/:id`
-  **Method:** `DELETE`
-  **Description:** Delete a category by its ID.
-  **Access:** Admin only
-  **Headers:**
   ```
   Authorization: Bearer <jwt_token>
   ```
-  **Response:** `204 No Content`

## Example Usage

#### Create Category (Admin only)

```bash
curl -X POST http://localhost:3000/categories \
  -H "Authorization: Bearer <admin_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Electronics"}'
```

#### Get All Categories (Authenticated users)

```bash
curl -X GET http://localhost:3000/categories \
  -H "Authorization: Bearer <jwt_token>"
```

#### Get Category by Slug (Authenticated users)

```bash
curl -X GET http://localhost:3000/categories/electronics \
  -H "Authorization: Bearer <jwt_token>"
```

#### Update Category (Admin only)

```bash
curl -X PUT http://localhost:3000/categories/electronics \
  -H "Authorization: Bearer <admin_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Consumer Electronics"}'
```

#### Delete Category (Admin only)

```bash
curl -X DELETE http://localhost:3000/categories/1 \
  -H "Authorization: Bearer <admin_jwt_token>"
```

## Access Control

The category endpoints have different access levels:

-  **Admin Access Required:**

   -  `POST /categories` - Create new categories
   -  `PUT /categories/:slug` - Update existing categories
   -  `DELETE /categories/:id` - Delete categories

-  **Authenticated User Access:**
   -  `GET /categories` - View all categories
   -  `GET /categories/:slug` - View specific category

## Data Validation

### Category Name Requirements:

-  **Type:** String
-  **Length:** 3-100 characters
-  **Required:** Yes

### Automatic Fields:

-  **slug:** Auto-generated from name (unique, URL-friendly)
-  **created_at:** Automatically set on creation
-  **updated_at:** Automatically updated on modification

## Error Responses

Common error responses for category endpoints:

-  **400 Bad Request:** Invalid request body or validation errors
-  **401 Unauthorized:** Missing or invalid JWT token
-  **403 Forbidden:** Insufficient permissions (non-admin trying admin operations)
-  **404 Not Found:** Category not found
-  **409 Conflict:** Category name/slug already exists

Example error response:

```json
{
   "statusCode": 403,
   "message": "Forbidden resource",
   "error": "Forbidden"
}
```

Example validation error:

```json
{
   "statusCode": 400,
   "message": ["name must be longer than or equal to 3 characters"],
   "error": "Bad Request"
}
```
