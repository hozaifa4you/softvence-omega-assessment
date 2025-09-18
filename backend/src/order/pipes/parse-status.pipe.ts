import {
   ArgumentMetadata,
   BadRequestException,
   Injectable,
   PipeTransform,
} from '@nestjs/common';
import type { OrderStatus } from 'src/db/schemas';

@Injectable()
export class ParseStatusPipe implements PipeTransform<string, OrderStatus> {
   private readonly validStatuses: OrderStatus[] = [
      'pending',
      'completed',
      'canceled',
   ];

   transform(value: string, _metadata: ArgumentMetadata): OrderStatus {
      if (!value) {
         throw new BadRequestException('Status parameter is required');
      }

      const status = value.toLowerCase().trim() as OrderStatus;

      if (!this.isValidStatus(status)) {
         throw new BadRequestException(
            `Invalid status '${value}'. Valid statuses are: ${this.validStatuses.join(', ')}`,
         );
      }

      return status;
   }

   private isValidStatus(status: string): status is OrderStatus {
      return this.validStatuses.includes(status as OrderStatus);
   }
}
