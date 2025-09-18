# Order Module API Documentation

This document describes the order management API endpoints for the backend service.

## Endpoints

### 1. Create Order

-  **URL:** `/orders`
-  **Method:** `POST`
-  **Description:** Create a new order with multiple products.
-  **Access:** Customers only
-  **Headers:**
   ```
   Authorization: Bearer <jwt_token>
   Content-Type: application/json
   ```
-  **Request Body:**
   ```json
   {
      "items": [
         {
            "product_id": 1,
            "qty": 2
         },
         {
            "product_id": 3,
            "qty": 1
         }
      ]
   }
   ```
-  **Response:**
   ```json
   {
      "id": 1,
      "amount": 5000,
      "status": "pending",
      "customer_id": 1,
      "vendor_ids": [2, 3],
      "created_at": "2025-09-18T10:00:00.000Z",
      "updated_at": "2025-09-18T10:00:00.000Z",
      "items": [
         {
            "id": 1,
            "qty": 2,
            "total": 3000,
            "product_id": 1,
            "order_id": 1
         },
         {
            "id": 2,
            "qty": 1,
            "total": 2000,
            "product_id": 3,
            "order_id": 1
         }
      ]
   }
   ```

### 2. Get All Orders (Admin)

-  **URL:** `/orders`
-  **Method:** `GET`
-  **Description:** Retrieve all orders with pagination.
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
            "amount": 5000,
            "status": "pending",
            "customer_id": 1,
            "vendor_ids": [2, 3],
            "created_at": "2025-09-18T10:00:00.000Z",
            "updated_at": "2025-09-18T10:00:00.000Z"
         }
      ],
      "meta": {
         "page": 1,
         "pageSize": 10,
         "total": 25,
         "totalPages": 3
      }
   }
   ```

### 3. Get Customer Orders

-  **URL:** `/orders/customers/:customerId`
-  **Method:** `GET`
-  **Description:** Retrieve orders for a specific customer.
-  **Access:**
   -  Admin: Can view any customer's orders
   -  Customer: Can only view their own orders
-  **Headers:**
   ```
   Authorization: Bearer <jwt_token>
   ```
-  **Response:**
   ```json
   [
      {
         "id": 1,
         "amount": 5000,
         "status": "pending",
         "customer_id": 1,
         "vendor_ids": [2, 3],
         "created_at": "2025-09-18T10:00:00.000Z",
         "updated_at": "2025-09-18T10:00:00.000Z",
         "items": [
            {
               "id": 1,
               "qty": 2,
               "total": 3000,
               "product_id": 1,
               "order_id": 1,
               "product": {
                  "id": 1,
                  "name": "Laptop",
                  "price": "1500.00"
               }
            }
         ]
      }
   ]
   ```

### 4. Get Order by ID

-  **URL:** `/orders/:id`
-  **Method:** `GET`
-  **Description:** Retrieve a specific order by its ID.
-  **Access:**
   -  Admin: Can view any order
   -  Customer: Can only view their own orders
-  **Headers:**
   ```
   Authorization: Bearer <jwt_token>
   ```
-  **Response:**
   ```json
   {
      "id": 1,
      "amount": 5000,
      "status": "pending",
      "customer_id": 1,
      "vendor_ids": [2, 3],
      "created_at": "2025-09-18T10:00:00.000Z",
      "updated_at": "2025-09-18T10:00:00.000Z",
      "items": [
         {
            "id": 1,
            "qty": 2,
            "total": 3000,
            "product_id": 1,
            "order_id": 1,
            "product": {
               "id": 1,
               "name": "Laptop",
               "price": "1500.00"
            }
         }
      ]
   }
   ```

### 5. Update Order Status

-  **URL:** `/orders/:id/status`
-  **Method:** `PATCH`
-  **Description:** Update the status of an order.
-  **Access:** Admin only
-  **Headers:**
   ```
   Authorization: Bearer <admin_jwt_token>
   ```
-  **Query Parameters:**
   -  `status` (required): New order status (`pending`, `completed`, `canceled`)
-  **Response:**
   ```json
   {
      "id": 1,
      "amount": 5000,
      "status": "completed",
      "customer_id": 1,
      "vendor_ids": [2, 3],
      "created_at": "2025-09-18T10:00:00.000Z",
      "updated_at": "2025-09-18T10:15:00.000Z"
   }
   ```

## Example Usage

#### Create Order (Customer only)

```bash
curl -X POST http://localhost:3000/orders \
  -H "Authorization: Bearer <customer_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"product_id": 1, "qty": 2},
      {"product_id": 3, "qty": 1}
    ]
  }'
```

#### Get All Orders (Admin only)

```bash
curl -X GET "http://localhost:3000/orders?page=1&pageSize=20" \
  -H "Authorization: Bearer <admin_jwt_token>"
```

#### Get Customer Orders

```bash
curl -X GET http://localhost:3000/orders/customers/1 \
  -H "Authorization: Bearer <jwt_token>"
```

#### Get Order by ID

```bash
curl -X GET http://localhost:3000/orders/1 \
  -H "Authorization: Bearer <jwt_token>"
```

#### Update Order Status (Admin only)

```bash
curl -X PATCH "http://localhost:3000/orders/1/status?status=completed" \
  -H "Authorization: Bearer <admin_jwt_token>"
```

## Access Control

The order endpoints have different access levels:

### Admin Access Required:

-  `GET /orders` - View all orders with pagination
-  `PATCH /orders/:id/status` - Update order status

### Customer Access Required:

-  `POST /orders` - Create new orders

### Admin OR Customer Access:

-  `GET /orders/customers/:customerId` - View customer orders
   -  **Admin:** Can view any customer's orders
   -  **Customer:** Can only view their own orders (access denied if trying to view others)
-  `GET /orders/:id` - View specific order
   -  **Admin:** Can view any order
   -  **Customer:** Can only view their own orders

## Data Models

### Order Object

```json
{
   "id": 1,
   "amount": 5000,
   "status": "pending",
   "customer_id": 1,
   "vendor_ids": [2, 3],
   "created_at": "2025-09-18T10:00:00.000Z",
   "updated_at": "2025-09-18T10:00:00.000Z"
}
```

### Order Item Object

```json
{
   "id": 1,
   "qty": 2,
   "total": 3000,
   "product_id": 1,
   "order_id": 1
}
```

### Order Status Values

-  `pending` - Order is created but not yet processed
-  `completed` - Order has been fulfilled
-  `canceled` - Order has been canceled

## Data Validation

### Create Order Requirements:

-  **items:** Array (required, cannot be empty)
   -  **product_id:** Positive integer (required)
   -  **qty:** Positive integer (required)

### Pagination Parameters:

-  **page:** Positive integer (optional, default: 1)
-  **pageSize:** Positive integer (optional, default: 10, max: 100)

### Status Update Requirements:

-  **status:** Must be one of: `pending`, `completed`, `canceled`

## Business Logic

### Order Creation Process:

1. **Validates customer exists**
2. **Validates all products exist**
3. **Calculates total amount** based on product prices and quantities
4. **Identifies vendors** from the products in the order
5. **Creates order and order items** in a database transaction
6. **Returns complete order** with items

### Amount Calculation:

-  Amounts are stored in **cents** (multiply by 100)
-  Individual item totals: `product_price * quantity`
-  Order total: Sum of all item totals

## Error Responses

Common error responses for order endpoints:

-  **400 Bad Request:** Invalid request body, validation errors, or business logic violations
-  **401 Unauthorized:** Missing or invalid JWT token
-  **403 Forbidden:**
   -  Insufficient permissions (wrong role)
   -  Customer trying to access other customer's orders
-  **404 Not Found:** Order, customer, or products not found

Example error responses:

#### Validation Error

```json
{
   "statusCode": 400,
   "message": ["items should not be empty"],
   "error": "Bad Request"
}
```

#### Access Denied Error

```json
{
   "statusCode": 403,
   "message": "Access denied: You can only view your own orders",
   "error": "Forbidden"
}
```

#### Business Logic Error

```json
{
   "statusCode": 400,
   "message": "One or more products not found",
   "error": "Bad Request"
}
```

#### Invalid Status Error

```json
{
   "statusCode": 400,
   "message": "Invalid status 'invalid'. Valid statuses are: pending, completed, canceled",
   "error": "Bad Request"
}
```
