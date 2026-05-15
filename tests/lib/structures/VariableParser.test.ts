import { VariableParser } from '../../../src/';

describe('VariableParser', () => {
  describe('is a class', () => {
    test('GIVEN typeof VariableParser THEN returns function', () => {
      expect(typeof VariableParser).toBe('function');
    });

    test('GIVEN typeof ...prototype THEN returns object', () => {
      expect(typeof VariableParser.prototype).toBe('object');
    });
  });
});
