import { Role } from '@/db/schemas';
import { SetMetadata } from '@nestjs/common';

export const ROLE_KEY = 'roles';
export const Roles = (...roles: [Role, ...Role[]]) =>
   SetMetadata(ROLE_KEY, roles);
