import {
   CanActivate,
   ExecutionContext,
   Inject,
   Injectable,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Request } from 'express';
import { DB } from 'src/db/db.module';
import { orders } from 'src/db/schemas';
import type { Database } from 'src/db/types/db';
import { AuthUserType } from 'src/types/auth';

@Injectable()
export class AuthorGuard implements CanActivate {
   constructor(@Inject(DB) private readonly db: Database) {}

   async canActivate(context: ExecutionContext) {
      const request = context
         .switchToHttp()
         .getRequest<Request & { user: AuthUserType }>();

      const id = request.params['id'];
      if (request.user.role === 'admin') return true;

      const order = await this.db.query.orders.findFirst({
         where: eq(orders.customer_id, +id),
      });
      if (order) {
         return true;
      }

      return false;
   }
}
