import { EnumMemberParser } from '../../../../src/';

describe('EnumMemberParser', () => {
  describe('is a class', () => {
    test('GIVEN typeof EnumMemberParser THEN returns function', () => {
      expect(typeof EnumMemberParser).toBe('function');
    });

    test('GIVEN typeof ...prototype THEN returns object', () => {
      expect(typeof EnumMemberParser.prototype).toBe('object');
    });
  });
});
