import type { JSONOutput } from 'typedoc';
import { IntrinsicTypeParser, TypeParser } from '../../../../src';

export const intrinsicTypeReflection: JSONOutput.IntrinsicType = {
  type: 'intrinsic',

  name: 'string'
};

export const intrinsicTypeJson: IntrinsicTypeParser.Json = {
  kind: TypeParser.Kind.Intrinsic,

  type: 'string'
};

describe('IntrinsicTypeParser', () => {
  describe('is a class', () => {
    test('GIVEN typeof IntrinsicTypeParser THEN returns function', () => {
      expect(typeof IntrinsicTypeParser).toBe('function');
    });

    test('GIVEN typeof ...prototype THEN returns object', () => {
      expect(typeof IntrinsicTypeParser.prototype).toBe('object');
    });
  });

  describe('can create instance', () => {
    describe('generateFromTypeDoc', () => {
      test('GIVEN reflection THEN returns IntrinsicTypeParser', () => {
        expect(TypeParser.generateFromTypeDoc(intrinsicTypeReflection)).toBeInstanceOf(IntrinsicTypeParser);
      });

      const parser = TypeParser.generateFromTypeDoc(intrinsicTypeReflection) as IntrinsicTypeParser;

      describe('properties', () => {
        describe('kind', () => {
          test('GIVEN IntrinsicTypeParser#kind THEN returns kind', () => {
            expect(parser.kind).toBe(intrinsicTypeJson.kind);
          });
        });

        describe('type', () => {
          test('GIVEN IntrinsicTypeParser#type THEN returns type', () => {
            expect(parser.type).toBe(intrinsicTypeJson.type);
          });
        });
      });
    });

    describe('generateFromJson', () => {
      test('GIVEN json THEN returns IntrinsicTypeParser', () => {
        expect(TypeParser.generateFromJson(intrinsicTypeJson)).toBeInstanceOf(IntrinsicTypeParser);
      });

      const parser = TypeParser.generateFromJson(intrinsicTypeJson) as IntrinsicTypeParser;

      describe('properties', () => {
        describe('kind', () => {
          test('GIVEN IntrinsicTypeParser#kind THEN returns kind', () => {
            expect(parser.kind).toBe(intrinsicTypeJson.kind);
          });
        });

        describe('type', () => {
          test('GIVEN IntrinsicTypeParser#type THEN returns type', () => {
            expect(parser.type).toBe(intrinsicTypeJson.type);
          });
        });
      });

      describe('methods', () => {
        describe('toJSON', () => {
          test('GIVEN IntrinsicTypeParser#toJSON THEN returns json', () => {
            expect(parser.toJSON()).toEqual(intrinsicTypeJson);
          });
        });

        describe('toString', () => {
          test('GIVEN IntrinsicTypeParser#toString THEN returns string', () => {
            expect(parser.toString()).toBe('string');
          });
        });
      });
    });
  });
});
