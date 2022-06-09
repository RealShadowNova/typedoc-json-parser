import { ProjectParser } from '../../../src/';

describe('ProjectParser', () => {
  describe('is a class', () => {
    test('GIVEN typeof ProjectParser THEN returns function', () => {
      expect(typeof ProjectParser).toBe('function');
    });

    test('GIVEN typeof ...prototype THEN returns object', () => {
      expect(typeof ProjectParser.prototype).toBe('object');
    });
  });
});
