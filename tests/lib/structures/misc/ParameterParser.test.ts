import type { JSONOutput } from 'typedoc';
import { ParameterParser } from '../../../../src/';
import { intrinsicTypeJson, intrinsicTypeReflection } from '../type-parsers/IntrinsicTypeParser.test';
import { commentJson, commentReflection } from './CommentParser.test';

export const parameterReflection: JSONOutput.ParameterReflection = {
  id: 1,
  name: 'parameter',
  kind: 32768,
  variant: 'param',
  flags: {
    isOptional: false,
    isRest: false
  },
  comment: commentReflection,
  type: intrinsicTypeReflection
};

export const parameterJson: ParameterParser.Json = {
  id: 1,
  name: 'parameter',
  comment: commentJson,
  type: intrinsicTypeJson,
  optional: false,
  rest: false
};

describe('ParameterParser', () => {
  describe('is a class', () => {
    test('GIVEN typeof ParameterParser THEN returns function', () => {
      expect(typeof ParameterParser).toBe('function');
    });

    test('GIVEN typeof ...prototype THEN returns object', () => {
      expect(typeof ParameterParser.prototype).toBe('object');
    });
  });

  describe('can create instance', () => {
    describe('generateFromTypeDoc', () => {
      test('GIVEN parameterReflection THEN returns parameterJson', () => {
        expect(ParameterParser.generateFromTypeDoc(parameterReflection)).toEqual(parameterJson);
      });

      const parser = ParameterParser.generateFromTypeDoc(parameterReflection);

      describe('properties', () => {
        describe('id', () => {
          test('GIVEN ParameterParser#id THEN returns id', () => {
            expect(parser.id).toBe(parameterJson.id);
          });
        });

        describe('name', () => {
          test('GIVEN ParameterParser#name THEN returns name', () => {
            expect(parser.name).toBe(parameterJson.name);
          });
        });

        describe('comment', () => {
          test('GIVEN ParameterParser#comment THEN returns comment', () => {
            expect(parser.comment).toEqual(parameterJson.comment);
          });
        });

        describe('type', () => {
          test('GIVEN ParameterParser#type THEN returns type', () => {
            expect(parser.type).toEqual(parameterJson.type);
          });
        });
      });

      describe('methods', () => {
        describe('toJSON', () => {
          test('GIVEN ParameterParser#toJSON THEN returns parameterJson', () => {
            expect(parser.toJSON()).toEqual(parameterJson);
          });
        });
      });
    });

    describe('generateFromJson', () => {
      test('GIVEN json THEN returns ParameterParser', () => {
        expect(ParameterParser.generateFromJson(parameterJson)).toBeInstanceOf(ParameterParser);
      });

      const parser = ParameterParser.generateFromJson(parameterJson);

      describe('properties', () => {
        describe('id', () => {
          test('GIVEN ParameterParser#id THEN returns id', () => {
            expect(parser.id).toBe(parameterJson.id);
          });
        });

        describe('name', () => {
          test('GIVEN ParameterParser#name THEN returns name', () => {
            expect(parser.name).toBe(parameterJson.name);
          });
        });

        describe('comment', () => {
          test('GIVEN ParameterParser#comment THEN returns comment', () => {
            expect(parser.comment).toEqual(parameterJson.comment);
          });
        });

        describe('type', () => {
          test('GIVEN ParameterParser#type THEN returns type', () => {
            expect(parser.type).toEqual(parameterJson.type);
          });
        });
      });

      describe('methods', () => {
        describe('toJSON', () => {
          test('GIVEN ParameterParser#toJSON THEN returns parameterJson', () => {
            expect(parser.toJSON()).toEqual(parameterJson);
          });
        });
      });
    });
  });
});
