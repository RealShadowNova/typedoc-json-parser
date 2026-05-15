import { ClassParser } from '../../../../src/';

describe('ClassParser', () => {
  describe('is a class', () => {
    test('GIVEN typeof ClassParser THEN returns function', () => {
      expect(typeof ClassParser).toBe('function');
    });

    test('GIVEN typeof ...prototype THEN returns object', () => {
      expect(typeof ClassParser.prototype).toBe('object');
    });
  });
});
