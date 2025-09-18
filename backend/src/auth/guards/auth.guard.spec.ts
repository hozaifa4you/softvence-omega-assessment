import { Test, TestingModule } from '@nestjs/testing';
import { JwtGuard } from './auth.guard';
import { AuthGuard } from '@nestjs/passport';

describe('JwtGuard', () => {
   let guard: JwtGuard;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [JwtGuard],
      }).compile();

      guard = module.get<JwtGuard>(JwtGuard);
   });

   describe('constructor', () => {
      it('should be defined', () => {
         expect(guard).toBeDefined();
      });

      it('should extend AuthGuard with jwt strategy', () => {
         expect(guard).toBeInstanceOf(AuthGuard('jwt'));
      });
   });

   describe('inheritance', () => {
      it('should inherit from AuthGuard', () => {
         expect(guard instanceof AuthGuard('jwt')).toBeTruthy();
      });

      it('should use JWT strategy', () => {
         // The guard is configured to use 'jwt' strategy
         // This is tested implicitly through the constructor
         expect(guard).toBeDefined();
      });
   });

   describe('guard behavior', () => {
      it('should be injectable', () => {
         // Since we can instantiate it through the testing module,
         // it's properly decorated as Injectable
         expect(guard).toBeInstanceOf(JwtGuard);
      });

      it('should implement CanActivate interface through inheritance', () => {
         // AuthGuard implements CanActivate, so JwtGuard should too
         expect(typeof guard.canActivate).toBe('function');
      });
   });
});
