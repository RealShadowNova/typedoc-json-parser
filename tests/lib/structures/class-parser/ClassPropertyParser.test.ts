import { ClassPropertyParser } from '../../../../src/';

describe('ClassPropertyParser', () => {
  describe('is a class', () => {
    test('GIVEN typeof ClassPropertyParser THEN returns function', () => {
      expect(typeof ClassPropertyParser).toBe('function');
    });

    test('GIVEN typeof ...prototype THEN returns object', () => {
      expect(typeof ClassPropertyParser.prototype).toBe('object');
    });
  });
});
