import * as schema from '../schemas';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export type Database = NodePgDatabase<typeof schema>;
