import { FunctionParser } from '../../../src/';

describe('FunctionParser', () => {
  describe('is a class', () => {
    test('GIVEN typeof FunctionParser THEN returns function', () => {
      expect(typeof FunctionParser).toBe('function');
    });

    test('GIVEN typeof ...prototype THEN returns object', () => {
      expect(typeof FunctionParser.prototype).toBe('object');
    });
  });
});
