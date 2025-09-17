import { DB } from '@/db/db.module';
import { Inject, Injectable } from '@nestjs/common';
import type { Database } from '@/db/types/db';

@Injectable()
export class AuthService {
   constructor(@Inject(DB) private readonly db: typeof Database) {}
}
