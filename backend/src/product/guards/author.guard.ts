import {
   CanActivate,
   ExecutionContext,
   Inject,
   Injectable,
} from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { Request } from 'express';
import { DB } from 'src/db/db.module';
import { products } from 'src/db/schemas';
import type { Database } from 'src/db/types/db';
import type { AuthUserType } from 'src/types/auth';

@Injectable()
export class AuthorGuard implements CanActivate {
   constructor(@Inject(DB) private readonly db: Database) {}

   async canActivate(context: ExecutionContext) {
      const request = context
         .switchToHttp()
         .getRequest<Request & { user: AuthUserType }>();
      const slug = request.params['slug'];

      const product = await this.db.query.products.findFirst({
         where: eq(products.slug, slug),
      });
      if (!product) {
         return true;
      }
      if (product.vendor_id !== request.user.id) {
         return false;
      }

      return true;
   }
}
