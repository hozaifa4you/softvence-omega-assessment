import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
   dialect: 'postgresql',
   schema: './src/db/schemas/**.schema.ts',
   out: './drizzle',
   dbCredentials: {
      url: process.env.DATABASE_URL as string,
   },
});
