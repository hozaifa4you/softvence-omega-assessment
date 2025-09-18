import {
   CanActivate,
   ExecutionContext,
   Inject,
   Injectable,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Request } from 'express';
import { DB } from 'src/db/db.module';
import { vendors } from 'src/db/schemas';
import type { Database } from 'src/db/types/db';
import type { AuthUserType } from 'src/types/auth';

@Injectable()
export class ExistGuard implements CanActivate {
   constructor(@Inject(DB) private readonly db: Database) {}

   async canActivate(context: ExecutionContext) {
      const request = context
         .switchToHttp()
         .getRequest<Request & { user: AuthUserType }>();

      const userId = request.user.id;

      const vendor = await this.db
         .select()
         .from(vendors)
         .where(eq(vendors.author_id, userId))
         .limit(1);

      return vendor.length === 0;
   }
}
