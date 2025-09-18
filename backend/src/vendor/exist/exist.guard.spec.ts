import { ExistGuard } from './exist.guard';

describe('ExistGuard', () => {
   it('should be defined', () => {
      expect(new ExistGuard()).toBeDefined();
   });
});
