# Product Module API Documentation

This document describes the product management API endpoints for the backend service.

## Endpoints

### 1. Create Product

-  **URL:** `/products`
-  **Method:** `POST`
-  **Description:** Create a new product.
-  **Access:** Vendors only
-  **Headers:**
   ```
   Authorization: Bearer <vendor_jwt_token>
   Content-Type: application/json
   ```
-  **Request Body:**
   ```json
   {
      "name": "Wireless Bluetooth Headphones",
      "description": "High-quality wireless headphones with noise cancellation and 20-hour battery life. Perfect for music lovers and professionals.",
      "price": 149.99,
      "offerPrice": 129.99,
      "discount": 13.33,
      "sku": "WBH-001-BLK",
      "stock": 50,
      "status": "active",
      "vendor_id": 2,
      "category_id": 1
   }
   ```
-  **Response:**
   ```json
   {
      "id": 1,
      "name": "Wireless Bluetooth Headphones",
      "slug": "wireless-bluetooth-headphones",
      "description": "High-quality wireless headphones with noise cancellation and 20-hour battery life. Perfect for music lovers and professionals.",
      "price": "149.99",
      "offerPrice": "129.99",
      "discount": "13.33",
      "sku": "WBH-001-BLK",
      "stock": 50,
      "status": "active",
      "vendor_id": 2,
      "category_id": 1,
      "created_at": "2025-09-18T10:00:00.000Z",
      "updated_at": "2025-09-18T10:00:00.000Z"
   }
   ```

### 2. Get All Products

-  **URL:** `/products`
-  **Method:** `GET`
-  **Description:** Retrieve all products with pagination.
-  **Access:** Public (no authentication required)
-  **Query Parameters:**
   -  `page` (optional): Page number (default: 1)
   -  `pageSize` (optional): Items per page (default: 10, max: 100)
-  **Response:**
   ```json
   {
      "data": [
         {
            "id": 1,
            "name": "Wireless Bluetooth Headphones",
            "slug": "wireless-bluetooth-headphones",
            "description": "High-quality wireless headphones with noise cancellation and 20-hour battery life.",
            "price": "149.99",
            "offerPrice": "129.99",
            "discount": "13.33",
            "sku": "WBH-001-BLK",
            "stock": 50,
            "status": "active",
            "vendor_id": 2,
            "category_id": 1,
            "created_at": "2025-09-18T10:00:00.000Z",
            "category": {
               "id": 1,
               "name": "Electronics",
               "slug": "electronics"
            }
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

### 3. Get Products by Vendor

-  **URL:** `/products/vendors/:vendorId`
-  **Method:** `GET`
-  **Description:** Retrieve all products for a specific vendor.
-  **Access:** Public (no authentication required)
-  **Response:**
   ```json
   [
      {
         "id": 1,
         "name": "Wireless Bluetooth Headphones",
         "slug": "wireless-bluetooth-headphones",
         "description": "High-quality wireless headphones with noise cancellation and 20-hour battery life.",
         "price": "149.99",
         "offerPrice": "129.99",
         "discount": "13.33",
         "sku": "WBH-001-BLK",
         "stock": 50,
         "status": "active",
         "vendor_id": 2,
         "category_id": 1,
         "created_at": "2025-09-18T10:00:00.000Z",
         "updated_at": "2025-09-18T10:00:00.000Z"
      }
   ]
   ```

### 4. Get Product by Slug

-  **URL:** `/products/:slug`
-  **Method:** `GET`
-  **Description:** Retrieve a specific product by its slug.
-  **Access:** Public (no authentication required)
-  **Response:**
   ```json
   {
      "id": 1,
      "name": "Wireless Bluetooth Headphones",
      "slug": "wireless-bluetooth-headphones",
      "description": "High-quality wireless headphones with noise cancellation and 20-hour battery life. Perfect for music lovers and professionals.",
      "price": "149.99",
      "offerPrice": "129.99",
      "discount": "13.33",
      "sku": "WBH-001-BLK",
      "stock": 50,
      "status": "active",
      "vendor_id": 2,
      "category_id": 1,
      "created_at": "2025-09-18T10:00:00.000Z",
      "updated_at": "2025-09-18T10:00:00.000Z",
      "category": {
         "id": 1,
         "name": "Electronics",
         "slug": "electronics"
      },
      "vendor": {
         "id": 2,
         "name": "Tech Store Inc",
         "email": "vendor@techstore.com"
      }
   }
   ```

### 5. Update Product

-  **URL:** `/products/:slug`
-  **Method:** `PUT`
-  **Description:** Update an existing product.
-  **Access:**
   -  Admin: Can update any product
   -  Vendor: Can only update their own products
-  **Headers:**
   ```
   Authorization: Bearer <jwt_token>
   Content-Type: application/json
   ```
-  **Request Body:**
   ```json
   {
      "name": "Premium Wireless Bluetooth Headphones",
      "price": 159.99,
      "offerPrice": 139.99,
      "stock": 75,
      "status": "active"
   }
   ```
-  **Response:**
   ```json
   {
      "id": 1,
      "name": "Premium Wireless Bluetooth Headphones",
      "slug": "wireless-bluetooth-headphones",
      "description": "High-quality wireless headphones with noise cancellation and 20-hour battery life. Perfect for music lovers and professionals.",
      "price": "159.99",
      "offerPrice": "139.99",
      "discount": "13.33",
      "sku": "WBH-001-BLK",
      "stock": 75,
      "status": "active",
      "vendor_id": 2,
      "category_id": 1,
      "created_at": "2025-09-18T10:00:00.000Z",
      "updated_at": "2025-09-18T10:15:00.000Z"
   }
   ```

### 6. Delete Product

-  **URL:** `/products/:slug`
-  **Method:** `DELETE`
-  **Description:** Delete a product.
-  **Access:**
   -  Admin: Can delete any product
   -  Vendor: Can only delete their own products
-  **Headers:**
   ```
   Authorization: Bearer <jwt_token>
   ```
-  **Response:** `204 No Content`

## Example Usage

#### Create Product (Vendor only)

```bash
curl -X POST http://localhost:3000/products \
  -H "Authorization: Bearer <vendor_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Wireless Bluetooth Headphones",
    "description": "High-quality wireless headphones with noise cancellation.",
    "price": 149.99,
    "offerPrice": 129.99,
    "discount": 13.33,
    "sku": "WBH-001-BLK",
    "stock": 50,
    "status": "active",
    "vendor_id": 2,
    "category_id": 1
  }'
```

#### Get All Products (Public)

```bash
curl -X GET "http://localhost:3000/products?page=1&pageSize=20"
```

#### Get Products by Vendor (Public)

```bash
curl -X GET http://localhost:3000/products/vendors/2
```

#### Get Product by Slug (Public)

```bash
curl -X GET http://localhost:3000/products/wireless-bluetooth-headphones
```

#### Update Product (Admin/Vendor)

```bash
curl -X PUT http://localhost:3000/products/wireless-bluetooth-headphones \
  -H "Authorization: Bearer <jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Wireless Bluetooth Headphones",
    "price": 159.99,
    "stock": 75
  }'
```

#### Delete Product (Admin/Vendor)

```bash
curl -X DELETE http://localhost:3000/products/wireless-bluetooth-headphones \
  -H "Authorization: Bearer <jwt_token>"
```

## Access Control

The product endpoints have different access levels:

### Public Access:

-  `GET /products` - View all products with pagination
-  `GET /products/vendors/:vendorId` - View products by vendor
-  `GET /products/:slug` - View specific product

### Vendor Access Required:

-  `POST /products` - Create new products

### Admin OR Vendor (Author) Access:

-  `PUT /products/:slug` - Update products
   -  **Admin:** Can update any product
   -  **Vendor:** Can only update their own products
-  `DELETE /products/:slug` - Delete products
   -  **Admin:** Can delete any product
   -  **Vendor:** Can only delete their own products

## Data Models

### Product Object

```json
{
   "id": 1,
   "name": "Wireless Bluetooth Headphones",
   "slug": "wireless-bluetooth-headphones",
   "description": "High-quality wireless headphones with noise cancellation.",
   "price": "149.99",
   "offerPrice": "129.99",
   "discount": "13.33",
   "sku": "WBH-001-BLK",
   "stock": 50,
   "status": "active",
   "vendor_id": 2,
   "category_id": 1,
   "created_at": "2025-09-18T10:00:00.000Z",
   "updated_at": "2025-09-18T10:00:00.000Z"
}
```

### Product Status Values

-  `active` - Product is available for purchase
-  `inactive` - Product is temporarily unavailable
-  `out_of_stock` - Product is out of stock

## Data Validation

### Create/Update Product Requirements:

#### Required Fields (Create):

-  **name:** String, 5-255 characters
-  **description:** String, 10-1000 characters
-  **price:** Positive number with max 2 decimal places
-  **sku:** String, 8-16 characters (must be unique)
-  **stock:** Positive integer
-  **vendor_id:** Positive integer
-  **category_id:** Positive integer

#### Optional Fields:

-  **offerPrice:** Positive number with max 2 decimal places
-  **discount:** Positive number with max 2 decimal places
-  **status:** One of `active`, `inactive`, `out_of_stock` (default: `active`)

#### Update Validation:

-  All fields are optional in updates
-  Same validation rules apply when fields are provided
-  `vendor_id` cannot be changed
-  SKU must remain unique if updated

### Pagination Parameters:

-  **page:** Positive integer (optional, default: 1)
-  **pageSize:** Positive integer (optional, default: 10, max: 100)

## Business Logic

### Product Creation Process:

1. **Validates category exists**
2. **Validates SKU is unique**
3. **Generates unique slug** from product name
4. **Creates product** with all provided data
5. **Returns complete product** object

### Authorization Logic:

-  **Author Guard:** Vendors can only modify their own products
-  **Admin Override:** Admins can modify any product
-  **Public Access:** Anyone can view products

### Automatic Fields:

-  **slug:** Auto-generated from name (unique, URL-friendly)
-  **created_at:** Automatically set on creation
-  **updated_at:** Automatically updated on modification

## Error Responses

Common error responses for product endpoints:

-  **400 Bad Request:** Invalid request body, validation errors, or business logic violations
-  **401 Unauthorized:** Missing or invalid JWT token (for protected endpoints)
-  **403 Forbidden:** Insufficient permissions (vendor trying to modify others' products)
-  **404 Not Found:** Product, category, or vendor not found
-  **409 Conflict:** SKU already exists

Example error responses:

#### Validation Error

```json
{
   "statusCode": 400,
   "message": [
      "name must be longer than or equal to 5 characters",
      "price must be a positive number"
   ],
   "error": "Bad Request"
}
```

#### SKU Conflict Error

```json
{
   "statusCode": 409,
   "message": "Product with this SKU already exists",
   "error": "Conflict"
}
```

#### Authorization Error

```json
{
   "statusCode": 403,
   "message": "You can only modify your own products",
   "error": "Forbidden"
}
```

#### Invalid Category Error

```json
{
   "statusCode": 400,
   "message": "Invalid category_id",
   "error": "Bad Request"
}
```

## Features

### Advanced Features:

-  **Slug-based URLs:** SEO-friendly product URLs
-  **Category Association:** Products linked to categories
-  **Vendor Management:** Multi-vendor support
-  **Stock Management:** Track product inventory
-  **Pricing Options:** Regular price, offer price, and discount
-  **Status Management:** Control product availability
-  **Pagination:** Efficient data retrieval for large catalogs
-  **Author Protection:** Vendors can only modify their own products
