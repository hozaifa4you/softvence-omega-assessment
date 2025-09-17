import { Roles, ROLE_KEY } from './roles.decorator';
import { SetMetadata } from '@nestjs/common';
import { RoleEnum } from '../../types/auth';
import { Role } from '../../db/schemas';

// Mock SetMetadata to verify it's called correctly
jest.mock('@nestjs/common', () => ({
   SetMetadata: jest.fn(),
}));

const mockSetMetadata = SetMetadata as jest.Mock;

describe('Roles Decorator', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   describe('ROLE_KEY constant', () => {
      it('should export the correct role key', () => {
         expect(ROLE_KEY).toBe('roles');
      });
   });

   describe('Roles decorator function', () => {
      it('should call SetMetadata with correct parameters for single role', () => {
         const role = RoleEnum.admin as Role;
         Roles(role);

         expect(mockSetMetadata).toHaveBeenCalledWith(ROLE_KEY, [role]);
      });

      it('should call SetMetadata with correct parameters for multiple roles', () => {
         const roles = [RoleEnum.admin, RoleEnum.vendor] as Role[];
         Roles(roles[0], roles[1]);

         expect(mockSetMetadata).toHaveBeenCalledWith(ROLE_KEY, roles);
      });

      it('should handle all role types', () => {
         const testRoles = [
            RoleEnum.super_admin,
            RoleEnum.admin,
            RoleEnum.vendor,
            RoleEnum.customer,
         ] as Role[];

         testRoles.forEach((role) => {
            mockSetMetadata.mockClear();
            Roles(role);
            expect(mockSetMetadata).toHaveBeenCalledWith(ROLE_KEY, [role]);
         });
      });

      it('should preserve order of multiple roles', () => {
         const role1 = RoleEnum.admin as Role;
         const role2 = RoleEnum.vendor as Role;
         const role3 = RoleEnum.customer as Role;

         Roles(role1, role2, role3);

         expect(mockSetMetadata).toHaveBeenCalledWith(ROLE_KEY, [
            role1,
            role2,
            role3,
         ]);
      });

      it('should handle duplicate roles', () => {
         const role = RoleEnum.admin as Role;
         Roles(role, role, role);

         expect(mockSetMetadata).toHaveBeenCalledWith(ROLE_KEY, [
            role,
            role,
            role,
         ]);
      });

      it('should require at least one role', () => {
         // TypeScript should enforce this, but we can test the behavior
         const role = RoleEnum.admin as Role;
         Roles(role);

         expect(mockSetMetadata).toHaveBeenCalledTimes(1);
      });
   });

   describe('integration with SetMetadata', () => {
      it('should use the correct metadata key', () => {
         const role = RoleEnum.admin as Role;
         Roles(role);

         expect(mockSetMetadata).toHaveBeenCalledWith(
            'roles',
            expect.any(Array),
         );
      });

      it('should pass roles as array to SetMetadata', () => {
         const role1 = RoleEnum.admin as Role;
         const role2 = RoleEnum.vendor as Role;

         Roles(role1, role2);

         const [key, value] = mockSetMetadata.mock.calls[0];
         expect(key).toBe(ROLE_KEY);
         expect(Array.isArray(value)).toBe(true);
         expect(value).toEqual([role1, role2]);
      });

      it('should return the result of SetMetadata', () => {
         const mockDecorator = jest.fn();
         mockSetMetadata.mockReturnValue(mockDecorator);

         const role = RoleEnum.admin as Role;
         const result = Roles(role);

         expect(result).toBe(mockDecorator);
      });
   });

   describe('decorator usage patterns', () => {
      it('should work with single super_admin role', () => {
         const role = RoleEnum.super_admin as Role;
         Roles(role);

         expect(mockSetMetadata).toHaveBeenCalledWith(ROLE_KEY, [role]);
      });

      it('should work with admin and vendor combination', () => {
         const admin = RoleEnum.admin as Role;
         const vendor = RoleEnum.vendor as Role;
         Roles(admin, vendor);

         expect(mockSetMetadata).toHaveBeenCalledWith(ROLE_KEY, [
            admin,
            vendor,
         ]);
      });

      it('should work with all roles', () => {
         const superAdmin = RoleEnum.super_admin as Role;
         const admin = RoleEnum.admin as Role;
         const vendor = RoleEnum.vendor as Role;
         const customer = RoleEnum.customer as Role;

         Roles(superAdmin, admin, vendor, customer);

         expect(mockSetMetadata).toHaveBeenCalledWith(ROLE_KEY, [
            superAdmin,
            admin,
            vendor,
            customer,
         ]);
      });
   });

   describe('type safety', () => {
      it('should enforce Role type for parameters', () => {
         // This is enforced by TypeScript at compile time
         // We can verify the enum values are correctly typed
         const validRoles = [
            RoleEnum.super_admin,
            RoleEnum.admin,
            RoleEnum.vendor,
            RoleEnum.customer,
         ];

         validRoles.forEach((role) => {
            expect(typeof role).toBe('string');
         });
      });

      it('should require at least one role parameter', () => {
         // This is enforced by TypeScript with the spread operator
         // The function signature requires [Role, ...Role[]]
         const role = RoleEnum.admin as Role;
         Roles(role);

         expect(mockSetMetadata).toHaveBeenCalledWith(ROLE_KEY, [role]);
      });
   });

   describe('metadata structure', () => {
      it('should create metadata that RolesGuard can read', () => {
         const roles = [RoleEnum.admin, RoleEnum.vendor] as Role[];
         Roles(roles[0], roles[1]);

         const [key, value] = mockSetMetadata.mock.calls[0];

         // Verify the metadata structure matches what RolesGuard expects
         expect(key).toBe('roles');
         expect(Array.isArray(value)).toBe(true);
         expect(value.length).toBe(2);
         expect(value).toContain(roles[0]);
         expect(value).toContain(roles[1]);
      });

      it('should maintain role array structure for guard consumption', () => {
         const role = RoleEnum.customer as Role;
         Roles(role);

         const [, value] = mockSetMetadata.mock.calls[0];

         // Even single role should be in array format
         expect(Array.isArray(value)).toBe(true);
         expect(value.length).toBe(1);
         expect(value[0]).toBe(role);
      });
   });
});
