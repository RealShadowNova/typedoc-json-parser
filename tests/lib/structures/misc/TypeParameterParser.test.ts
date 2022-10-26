import type { JSONOutput } from 'typedoc';
import { TypeParameterParser } from '../../../../src/';
import { intrinsicTypeJson, intrinsicTypeReflection } from '../type-parsers/IntrinsicTypeParser.test';

export const typeParameterReflection: JSONOutput.TypeParameterReflection = {
  id: 1,
  name: 'T',
  kind: 131072,
  kindString: 'Type Parameter',
  flags: {},
  type: intrinsicTypeReflection,
  default: intrinsicTypeReflection
};

export const typeParameterJson: TypeParameterParser.Json = {
  id: 1,
  name: 'T',
  constraint: intrinsicTypeJson,
  default: intrinsicTypeJson
};

describe('TypeParameterParser', () => {
  describe('is a class', () => {
    test('GIVEN typeof TypeParameterParser THEN returns function', () => {
      expect(typeof TypeParameterParser).toBe('function');
    });

    test('GIVEN typeof ...prototype THEN returns object', () => {
      expect(typeof TypeParameterParser.prototype).toBe('object');
    });
  });

  describe('can create instance', () => {
    describe('generateFromTypeDoc', () => {
      test('GIVEN reflection THEN returns TypeParameterParser', () => {
        expect(TypeParameterParser.generateFromTypeDoc(typeParameterReflection)).toBeInstanceOf(TypeParameterParser);
      });

      const parser = TypeParameterParser.generateFromTypeDoc(typeParameterReflection);

      describe('properties', () => {
        describe('id', () => {
          test('GIVEN TypeParameterParser#id THEN returns id', () => {
            expect(parser.id).toBe(typeParameterJson.id);
          });
        });

        describe('name', () => {
          test('GIVEN TypeParameterParser#name THEN returns name', () => {
            expect(parser.name).toBe(typeParameterJson.name);
          });
        });

        describe('constraint', () => {
          test('GIVEN TypeParameterParser#constraint THEN returns constraint', () => {
            expect(parser.constraint).toEqual(typeParameterJson.constraint);
          });
        });

        describe('default', () => {
          test('GIVEN TypeParameterParser#default THEN returns default', () => {
            expect(parser.default).toEqual(typeParameterJson.default);
          });
        });
      });

      describe('toJSON', () => {
        test('GIVEN TypeParameterParser#toJSON THEN returns JSON', () => {
          expect(parser.toJSON()).toEqual(typeParameterJson);
        });
      });
    });

    describe('generateFromJson', () => {
      test('GIVEN json THEN returns TypeParameterParser', () => {
        expect(TypeParameterParser.generateFromJson(typeParameterJson)).toBeInstanceOf(TypeParameterParser);
      });

      const parser = TypeParameterParser.generateFromJson(typeParameterJson);

      describe('properties', () => {
        describe('id', () => {
          test('GIVEN TypeParameterParser#id THEN returns id', () => {
            expect(parser.id).toBe(typeParameterJson.id);
          });
        });

        describe('name', () => {
          test('GIVEN TypeParameterParser#name THEN returns name', () => {
            expect(parser.name).toBe(typeParameterJson.name);
          });
        });

        describe('constraint', () => {
          test('GIVEN TypeParameterParser#constraint THEN returns constraint', () => {
            expect(parser.constraint).toEqual(typeParameterJson.constraint);
          });
        });

        describe('default', () => {
          test('GIVEN TypeParameterParser#default THEN returns default', () => {
            expect(parser.default).toEqual(typeParameterJson.default);
          });
        });
      });

      describe('toJSON', () => {
        test('GIVEN TypeParameterParser#toJSON THEN returns JSON', () => {
          expect(parser.toJSON()).toEqual(typeParameterJson);
        });
      });
    });
  });
});
