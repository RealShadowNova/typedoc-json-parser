import { InterfaceParser } from '../../../../src/';

describe('InterfaceParser', () => {
  describe('is a class', () => {
    test('GIVEN typeof InterfaceParser THEN returns function', () => {
      expect(typeof InterfaceParser).toBe('function');
    });

    test('GIVEN typeof ...prototype THEN returns object', () => {
      expect(typeof InterfaceParser.prototype).toBe('object');
    });
  });
});
