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
export class AuthorGuard implements CanActivate {
   constructor(@Inject(DB) private readonly db: Database) {}

   async canActivate(context: ExecutionContext) {
      const request = context
         .switchToHttp()
         .getRequest<Request & { user: AuthUserType }>();

      const id = parseInt(request.params.id, 10);
      const userId = request.user.id;

      const vendor = await this.db.query.vendors.findFirst({
         where: eq(vendors.id, id),
      });

      if (!vendor) {
         return true;
      }

      return vendor.author_id === userId;
   }
}
