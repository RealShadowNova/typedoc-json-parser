import type { JSONOutput } from 'typedoc';
import { SignatureParser } from '../../../../src/';
import { intrinsicTypeJson, intrinsicTypeReflection } from '../type-parsers/IntrinsicTypeParser.test';
import { commentJson, commentReflection } from './CommentParser.test';
import { parameterJson, parameterReflection } from './ParameterParser.test';
import { typeParameterJson, typeParameterReflection } from './TypeParameterParser.test';

export const signatureReflection: JSONOutput.SignatureReflection = {
  id: 1,
  name: 'signature',
  kind: 4096,
  kindString: 'Call Signature',
  flags: {},
  comment: commentReflection,
  typeParameter: [typeParameterReflection],
  parameters: [parameterReflection],
  type: intrinsicTypeReflection
};

export const signatureJson: SignatureParser.Json = {
  id: 1,
  name: 'signature',
  comment: commentJson,
  typeParameters: [typeParameterJson],
  parameters: [parameterJson],
  returnType: intrinsicTypeJson
};

describe('SignatureParser', () => {
  describe('is a class', () => {
    test('GIVEN typeof SignatureParser THEN returns function', () => {
      expect(typeof SignatureParser).toBe('function');
    });

    test('GIVEN typeof ...prototype THEN returns object', () => {
      expect(typeof SignatureParser.prototype).toBe('object');
    });
  });

  describe('can create instance', () => {
    describe('generateFromTypeDoc', () => {
      test('GIVEN reflection THEN returns SignatureParser', () => {
        expect(SignatureParser.generateFromTypeDoc(signatureReflection)).toBeInstanceOf(SignatureParser);
      });

      const parser = SignatureParser.generateFromTypeDoc(signatureReflection);

      describe('properties', () => {
        describe('id', () => {
          test('GIVEN SignatureParser#id THEN returns id', () => {
            expect(parser.id).toBe(signatureJson.id);
          });
        });

        describe('name', () => {
          test('GIVEN SignatureParser#name THEN returns name', () => {
            expect(parser.name).toBe(signatureJson.name);
          });
        });

        describe('comment', () => {
          test('GIVEN SignatureParser#comment THEN returns comment', () => {
            expect(parser.comment).toEqual(signatureJson.comment);
          });
        });

        describe('typeParameters', () => {
          test('GIVEN SignatureParser#typeParameters THEN returns typeParameters', () => {
            expect(parser.typeParameters).toEqual(signatureJson.typeParameters);
          });
        });

        describe('parameters', () => {
          test('GIVEN SignatureParser#parameters THEN returns parameters', () => {
            expect(parser.parameters).toEqual(signatureJson.parameters);
          });
        });

        describe('returnType', () => {
          test('GIVEN SignatureParser#returnType THEN returns returnType', () => {
            expect(parser.returnType).toEqual(signatureJson.returnType);
          });
        });
      });

      describe('methods', () => {
        describe('toJSON', () => {
          test('GIVEN SignatureParser#toJSON THEN returns signatureJson', () => {
            expect(parser.toJSON()).toEqual(signatureJson);
          });
        });
      });
    });

    describe('generateFromJson', () => {
      test('GIVEN json THEN returns SignatureParser', () => {
        expect(SignatureParser.generateFromJson(signatureJson)).toBeInstanceOf(SignatureParser);
      });

      const parser = SignatureParser.generateFromJson(signatureJson);

      describe('properties', () => {
        describe('id', () => {
          test('GIVEN SignatureParser#id THEN returns id', () => {
            expect(parser.id).toBe(signatureJson.id);
          });
        });

        describe('name', () => {
          test('GIVEN SignatureParser#name THEN returns name', () => {
            expect(parser.name).toBe(signatureJson.name);
          });
        });

        describe('comment', () => {
          test('GIVEN SignatureParser#comment THEN returns comment', () => {
            expect(parser.comment).toEqual(signatureJson.comment);
          });
        });

        describe('typeParameters', () => {
          test('GIVEN SignatureParser#typeParameters THEN returns typeParameters', () => {
            expect(parser.typeParameters).toEqual(signatureJson.typeParameters);
          });
        });

        describe('parameters', () => {
          test('GIVEN SignatureParser#parameters THEN returns parameters', () => {
            expect(parser.parameters).toEqual(signatureJson.parameters);
          });
        });

        describe('returnType', () => {
          test('GIVEN SignatureParser#returnType THEN returns returnType', () => {
            expect(parser.returnType).toEqual(signatureJson.returnType);
          });
        });
      });

      describe('methods', () => {
        describe('toJSON', () => {
          test('GIVEN SignatureParser#toJSON THEN returns signatureReflection', () => {
            expect(parser.toJSON()).toEqual(signatureJson);
          });
        });
      });
    });
  });
});
