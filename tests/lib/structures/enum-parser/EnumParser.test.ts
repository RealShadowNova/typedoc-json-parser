import { EnumParser } from '../../../../src/';

describe('EnumParser', () => {
  describe('is a class', () => {
    test('GIVEN typeof EnumParser THEN returns function', () => {
      expect(typeof EnumParser).toBe('function');
    });

    test('GIVEN typeof ...prototype THEN returns object', () => {
      expect(typeof EnumParser.prototype).toBe('object');
    });
  });
});
