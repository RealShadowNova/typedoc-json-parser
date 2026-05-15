import { InterfacePropertyParser } from '../../../../src/';

describe('InterfacePropertyParser', () => {
  describe('is a class', () => {
    test('GIVEN typeof InterfacePropertyParser THEN returns function', () => {
      expect(typeof InterfacePropertyParser).toBe('function');
    });

    test('GIVEN typeof ...prototype THEN returns object', () => {
      expect(typeof InterfacePropertyParser.prototype).toBe('object');
    });
  });
});
