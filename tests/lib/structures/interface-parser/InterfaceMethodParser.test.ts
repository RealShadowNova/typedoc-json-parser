import { InterfaceMethodParser } from '../../../../src/';

describe('InterfaceMethodParser', () => {
  describe('is a class', () => {
    test('GIVEN typeof InterfaceMethodParser THEN returns function', () => {
      expect(typeof InterfaceMethodParser).toBe('function');
    });

    test('GIVEN typeof ...prototype THEN returns object', () => {
      expect(typeof InterfaceMethodParser.prototype).toBe('object');
    });
  });
});
