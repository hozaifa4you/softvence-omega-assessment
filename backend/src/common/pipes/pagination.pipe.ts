import {
   ArgumentMetadata,
   BadRequestException,
   Injectable,
   PipeTransform,
} from '@nestjs/common';

export interface PaginationQuery {
   page: number;
   pageSize: number;
   skip: number;
   take: number;
}

@Injectable()
export class PaginationPipe implements PipeTransform<any, PaginationQuery> {
   private readonly DEFAULT_PAGE = 1;
   private readonly DEFAULT_PAGE_SIZE = 10;
   private readonly MAX_PAGE_SIZE = 100;

   transform(value: any, _metadata: ArgumentMetadata): PaginationQuery {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const query: Record<string, any> = value || {};

      let page = this.DEFAULT_PAGE;
      if (typeof query.page === 'string' || typeof query.page === 'number') {
         const parsedPage = parseInt(String(query.page), 10);
         if (isNaN(parsedPage) || parsedPage < 1) {
            throw new BadRequestException(
               'Page must be a positive integer starting from 1',
            );
         }
         page = parsedPage;
      }

      let pageSize = this.DEFAULT_PAGE_SIZE;
      if (
         typeof query.pageSize === 'string' ||
         typeof query.pageSize === 'number'
      ) {
         const parsedPageSize = parseInt(String(query.pageSize), 10);
         if (isNaN(parsedPageSize) || parsedPageSize < 1) {
            throw new BadRequestException(
               'Page size must be a positive integer',
            );
         }
         if (parsedPageSize > this.MAX_PAGE_SIZE) {
            throw new BadRequestException(
               `Page size cannot exceed ${this.MAX_PAGE_SIZE}`,
            );
         }
         pageSize = parsedPageSize;
      }

      const skip = (page - 1) * pageSize;
      const take = pageSize;

      return {
         page,
         pageSize,
         skip,
         take,
      };
   }
}
