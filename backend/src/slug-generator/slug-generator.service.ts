import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DB } from 'src/db/db.module';
import type { Database } from 'src/db/types/db';
import * as schema from '../db/schemas';

type Table = 'products' | 'categories';

@Injectable()
export class SlugGeneratorService {
   constructor(@Inject(DB) private readonly dataSource: Database) {}

   async generateUniqueSlug(
      text: string,
      tableName: Table,
      columnName: string = 'slug',
   ): Promise<string> {
      const baseSlug = this.createSlug(text);
      let finalSlug = baseSlug;
      let counter = 1;

      while (await this.slugExists(finalSlug, tableName, columnName)) {
         finalSlug = `${baseSlug}-${counter}`;
         counter++;
      }

      return finalSlug;
   }

   generateShortCode(length: number = 6): string {
      const chars =
         'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      for (let i = 0; i < length; i++) {
         result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
   }

   async generateUniqueShortCode(
      tableName: Table,
      columnName: string = 'code',
      length: number = 6,
   ): Promise<string> {
      let code: string;
      do {
         code = this.generateShortCode(length);
      } while (await this.slugExists(code, tableName, columnName));
      return code;
   }

   private createSlug(text: string): string {
      return text
         .toLowerCase()
         .trim()
         .replace(/[^a-z0-9\s-]/g, '')
         .replace(/\s+/g, '-')
         .replace(/-+/g, '-');
   }

   private async slugExists(
      slug: string,
      tableName: Table,
      columnName: string,
   ): Promise<boolean> {
      try {
         const tableMap = {
            products: schema.products,
            categories: schema.categories,
         };

         const table = tableMap[tableName];
         if (!table) {
            return false;
         }

         let result: any[] = [];

         if (tableName === 'products' && columnName === 'slug') {
            result = await this.dataSource
               .select()
               .from(schema.products)
               .where(eq(schema.products.slug, slug))
               .limit(1);
         } else if (tableName === 'products' && columnName === 'sku') {
            result = await this.dataSource
               .select()
               .from(schema.products)
               .where(eq(schema.products.sku, slug))
               .limit(1);
         } else if (tableName === 'categories' && columnName === 'slug') {
            result = await this.dataSource
               .select()
               .from(schema.categories)
               .where(eq(schema.categories.slug, slug))
               .limit(1);
         } else {
            return false;
         }

         return result.length > 0;
      } catch (error) {
         console.error(
            `Error checking ${columnName} existence in ${tableName}:`,
            error,
         );
         return false;
      }
   }
}
