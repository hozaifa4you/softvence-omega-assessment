# API Setup Guide

This guide provides minimal steps to set up and run the backend API locally.

## Prerequisites

-  **Node.js** (v18 or higher)
-  **npm** or **yarn**
-  **PostgreSQL** database (local or cloud)

## Quick Start

### 1. Clone & Navigate

```bash
git clone <repository-url>
cd softvence-omega-assessment/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```bash
PORT=3333
APP_NAME=omega-shop-backend

# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

# JWT Configuration
JWT_SECRET="your_super_secret_jwt_key_here"
JWT_EXPIRATION="1d"
```

### 4. Database Setup

Run migrations to set up the database schema:

```bash
npm run db:migrate
```

### 5. Start the Server

```bash
# Development mode (with auto-reload)
npm run start:dev

# Production mode
npm run start:prod
```

The API will be available at: `http://localhost:3333/api/v1`

## Environment Variables

| Variable         | Description                  | Required | Default              |
| ---------------- | ---------------------------- | -------- | -------------------- |
| `PORT`           | Server port                  | No       | `3333`               |
| `APP_NAME`       | Application name             | No       | `omega-shop-backend` |
| `DATABASE_URL`   | PostgreSQL connection string | **Yes**  | -                    |
| `JWT_SECRET`     | Secret key for JWT tokens    | **Yes**  | -                    |
| `JWT_EXPIRATION` | JWT token expiration time    | No       | `1d`                 |

## Database Configuration

### PostgreSQL Connection String Format:

```
postgresql://[username]:[password]@[host]:[port]/[database_name]
```

### Examples:

```bash
# Local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/omega_shop"

# Cloud PostgreSQL (e.g., Heroku)
DATABASE_URL="postgresql://user:pass@host:5432/dbname?sslmode=require"
```

## Available Scripts

| Script               | Description                               |
| -------------------- | ----------------------------------------- |
| `npm run start:dev`  | Start development server with auto-reload |
| `npm run start:prod` | Start production server                   |
| `npm run build`      | Build the application                     |
| `npm run db:migrate` | Run database migrations                   |
| `npm run db:studio`  | Open Drizzle Studio (database GUI)        |
| `npm run lint`       | Run ESLint                                |
| `npm run test`       | Run unit tests                            |
| `npm run test:e2e`   | Run end-to-end tests                      |

## API Endpoints

The API uses the base URL: `http://localhost:3333/api/v1`

### Core Modules:

-  **Authentication:** `/api/v1/auth/*`
-  **Users:** `/api/v1/users/*`
-  **Categories:** `/api/v1/categories/*`
-  **Products:** `/api/v1/products/*`
-  **Orders:** `/api/v1/orders/*`
-  **Chat:** `/api/v1/chats/*`

### WebSocket:

-  **Chat WebSocket:** `ws://localhost:3333/chat`

## Database Management

### View Database (Drizzle Studio):

```bash
npm run db:studio
```

Opens a web-based database browser at `https://local.drizzle.studio`

### Reset Database (if needed):

```bash
# Warning: This will delete all data
# Manual process: Drop and recreate database, then run migrations
npm run db:migrate
```

## Development Tips

### Hot Reload:

The development server automatically reloads when you make changes to the code.

### Database Changes:

If you modify the database schema, generate new migrations:

```bash
# After modifying schema files
npm run db:migrate
```

### API Testing:

Use tools like:

-  **Postman** or **Insomnia** for REST API testing
-  **Socket.IO Client** for WebSocket testing
-  **cURL** commands (see individual module docs)

## Troubleshooting

### Common Issues:

#### Database Connection Error:

```
Error: Connection refused
```

**Solution:** Verify PostgreSQL is running and DATABASE_URL is correct.

#### Port Already in Use:

```
Error: EADDRINUSE: address already in use :::3333
```

**Solution:** Change PORT in `.env` or kill the process using the port.

#### JWT Token Error:

```
Error: Unauthorized
```

**Solution:** Verify JWT_SECRET is set and tokens are properly formatted.

#### Migration Error:

```
Error: relation does not exist
```

**Solution:** Run `npm run db:migrate` to apply database migrations.

### Database Setup Help:

#### Local PostgreSQL Installation:

```bash
# macOS (using Homebrew)
brew install postgresql
brew services start postgresql
createdb omega_shop

# Ubuntu/Debian
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb omega_shop
```

#### Quick Database URL:

```bash
# For local development (adjust username/password)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/omega_shop"
```

## Testing the Setup

### 1. Health Check:

```bash
curl http://localhost:3333/api/v1
```

### 2. Register a User:

```bash
curl -X POST http://localhost:3333/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### 3. Login:

```bash
curl -X POST http://localhost:3333/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Production Deployment

### Environment:

-  Set `NODE_ENV=production`
-  Use strong JWT_SECRET (32+ characters)
-  Configure production database
-  Set appropriate CORS settings

### Build:

```bash
npm run build
npm run start:prod
```

## Documentation

-  **[Authentication](./AUTH.md)** - User registration, login, profile
-  **[Users](./USER.md)** - User management (admin)
-  **[Categories](./CATEGORY.md)** - Product categories
-  **[Products](./PRODUCT.md)** - Product management
-  **[Orders](./ORDER.md)** - Order processing
-  **[Chat](./CHAT.md)** - Real-time messaging

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the specific module documentation
3. Verify your environment configuration
4. Ensure database migrations are applied

## Technology Stack

-  **Framework:** NestJS
-  **Database:** PostgreSQL with Drizzle ORM
-  **Authentication:** JWT with Passport
-  **Real-time:** Socket.IO WebSockets
-  **Validation:** Class Validator
-  **Password Hashing:** Argon2
