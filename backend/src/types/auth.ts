import { Role, Status } from '../db/schemas';

export type AuthUserType = {
   id: number;
   name: string;
   email: string;
   role: Role;
   status: Status;
};

export enum RoleEnum {
   super_admin = 'super_admin',
   admin = 'admin',
   vendor = 'vendor',
   customer = 'customer',
}

export enum StatusEnum {
   active = 'active',
   inactive = 'inactive',
   banned = 'banned',
}
