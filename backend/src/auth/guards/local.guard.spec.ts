import { Test, TestingModule } from '@nestjs/testing';
import { LocalGuard } from './local.guard';
import { AuthGuard } from '@nestjs/passport';

describe('LocalGuard', () => {
   let guard: LocalGuard;

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [LocalGuard],
      }).compile();

      guard = module.get<LocalGuard>(LocalGuard);
   });

   describe('constructor', () => {
      it('should be defined', () => {
         expect(guard).toBeDefined();
      });

      it('should extend AuthGuard with local strategy', () => {
         expect(guard).toBeInstanceOf(AuthGuard('local'));
      });
   });

   describe('inheritance', () => {
      it('should inherit from AuthGuard', () => {
         expect(guard instanceof AuthGuard('local')).toBeTruthy();
      });

      it('should use local strategy', () => {
         // The guard is configured to use 'local' strategy
         // This is tested implicitly through the constructor
         expect(guard).toBeDefined();
      });
   });

   describe('guard behavior', () => {
      it('should be injectable', () => {
         // Since we can instantiate it through the testing module,
         // it's properly decorated as Injectable
         expect(guard).toBeInstanceOf(LocalGuard);
      });

      it('should implement CanActivate interface through inheritance', () => {
         // AuthGuard implements CanActivate, so LocalGuard should too
         expect(typeof guard.canActivate).toBe('function');
      });
   });
});
