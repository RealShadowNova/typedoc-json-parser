import { NamespaceParser } from '../../../src/';

describe('NamespaceParser', () => {
  describe('is a class', () => {
    test('GIVEN typeof NamespaceParser THEN returns function', () => {
      expect(typeof NamespaceParser).toBe('function');
    });

    test('GIVEN typeof ...prototype THEN returns object', () => {
      expect(typeof NamespaceParser.prototype).toBe('object');
    });
  });
});
