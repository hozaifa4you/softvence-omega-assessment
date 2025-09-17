import { SetMetadata } from '@nestjs/common';
import { Role } from '../../db/schemas';

export const ROLE_KEY = 'roles';
export const Roles = (...roles: [Role, ...Role[]]) =>
   SetMetadata(ROLE_KEY, roles);
