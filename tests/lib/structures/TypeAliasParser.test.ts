import { TypeAliasParser } from '../../../src/';

describe('TypeAliasParser', () => {
  describe('is a class', () => {
    test('GIVEN typeof TypeAliasParser THEN returns function', () => {
      expect(typeof TypeAliasParser).toBe('function');
    });

    test('GIVEN typeof ...prototype THEN returns object', () => {
      expect(typeof TypeAliasParser.prototype).toBe('object');
    });
  });
});
