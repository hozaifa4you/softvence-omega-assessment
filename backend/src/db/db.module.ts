import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schemas';

export const DB = Symbol('db-connection');

@Module({
   providers: [
      {
         provide: DB,
         inject: [ConfigService],
         useFactory: (configService: ConfigService) => {
            const databaseURL = configService.get<string>('DATABASE_URL');

            const pool = new Pool({
               connectionString: databaseURL,
               ssl: true,
            });

            return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
         },
      },
   ],
   exports: [DB],
})
export class DbModule {}
