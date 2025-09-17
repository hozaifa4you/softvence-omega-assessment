## Omega Shop Backend

#### Setup

```sh
# Install dependencies
npm install
# Set up environment variables
cp .env.example .env
```

Update the `.env` file with your database credentials and so more.

#### Database migration

```sh
# Generate a new migration
npx drizzle-kit generate --name=<migration_name>

# Apply migrations to the database
npx drizzle-kit migrate
```
