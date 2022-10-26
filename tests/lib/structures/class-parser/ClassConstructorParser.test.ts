import type { JSONOutput } from 'typedoc';
import { ClassConstructorParser, ClassParser } from '../../../../src/';
import { commentJson, commentReflection } from '../misc/CommentParser.test';
import { parameterJson } from '../misc/ParameterParser.test';
import { signatureReflection } from '../misc/SignatureParser.test';
import { sourceJson, sourceReflection } from '../misc/SourceParser.test';

export const classConstructorReflection: JSONOutput.DeclarationReflection = {
  id: 1,
  name: 'constructor',
  kind: 512,
  kindString: 'Constructor',
  flags: { isPublic: true },
  comment: commentReflection,
  sources: [sourceReflection],
  signatures: [{ ...signatureReflection, kind: 16384 }]
};

export const classConstructorJson: ClassConstructorParser.Json = {
  id: 1,
  name: 'constructor',
  source: sourceJson,
  comment: commentJson,
  parentId: 2,
  accessibility: ClassParser.Accessibility.Public,
  parameters: [parameterJson]
};

describe('ClassConstructorParser', () => {
  describe('is a class', () => {
    test('GIVEN typeof ClassConstructorParser THEN returns function', () => {
      expect(typeof ClassConstructorParser).toBe('function');
    });

    test('GIVEN typeof ...prototype THEN returns object', () => {
      expect(typeof ClassConstructorParser.prototype).toBe('object');
    });
  });

  describe('can create instance', () => {
    describe('generateFromTypeDoc', () => {
      test('GIVEN classConstructorReflection THEN returns classConstructorJson', () => {
        expect(ClassConstructorParser.generateFromTypeDoc(classConstructorReflection, classConstructorJson.parentId)).toEqual(classConstructorJson);
      });

      const parser = ClassConstructorParser.generateFromTypeDoc(classConstructorReflection, classConstructorJson.parentId);

      describe('properties', () => {
        describe('id', () => {
          test('GIVEN ClassConstructorParser#id THEN returns id', () => {
            expect(parser.id).toBe(classConstructorJson.id);
          });
        });

        describe('name', () => {
          test('GIVEN ClassConstructorParser#name THEN returns name', () => {
            expect(parser.name).toBe(classConstructorJson.name);
          });
        });

        describe('source', () => {
          test('GIVEN ClassConstructorParser#source THEN returns source', () => {
            expect(parser.source).toEqual(classConstructorJson.source);
          });
        });

        describe('comment', () => {
          test('GIVEN ClassConstructorParser#comment THEN returns comment', () => {
            expect(parser.comment).toEqual(classConstructorJson.comment);
          });
        });

        describe('parentId', () => {
          test('GIVEN ClassConstructorParser#parentId THEN returns parentId', () => {
            expect(parser.parentId).toBe(classConstructorJson.parentId);
          });
        });

        describe('accessibility', () => {
          test('GIVEN ClassConstructorParser#accessibility THEN returns accessibility', () => {
            expect(parser.accessibility).toBe(classConstructorJson.accessibility);
          });
        });

        describe('parameters', () => {
          test('GIVEN ClassConstructorParser#parameters THEN returns parameters', () => {
            expect(parser.parameters).toEqual(classConstructorJson.parameters);
          });
        });
      });

      describe('methods', () => {
        describe('isPublic', () => {
          test('GIVEN ClassConstructorParser#isPublic THEN returns true', () => {
            expect(parser.isPublic()).toBe(true);
          });
        });

        describe('isProtected', () => {
          test('GIVEN ClassConstructorParser#isProtected THEN returns false', () => {
            expect(parser.isProtected()).toBe(false);
          });
        });

        describe('isPrivate', () => {
          test('GIVEN ClassConstructorParser#isPrivate THEN returns false', () => {
            expect(parser.isPrivate()).toBe(false);
          });
        });

        describe('toJSON', () => {
          test('GIVEN ClassConstructorParser#toJSON THEN returns classConstructorJson', () => {
            expect(parser.toJSON()).toEqual(classConstructorJson);
          });
        });
      });
    });

    describe('generateFromJson', () => {
      test('GIVEN classConstructorJson THEN returns ClassConstructorParser', () => {
        expect(ClassConstructorParser.generateFromJson(classConstructorJson)).toBeInstanceOf(ClassConstructorParser);
      });

      const parser = ClassConstructorParser.generateFromJson(classConstructorJson);

      describe('properties', () => {
        describe('id', () => {
          test('GIVEN ClassConstructorParser#id THEN returns id', () => {
            expect(parser.id).toBe(classConstructorJson.id);
          });
        });

        describe('name', () => {
          test('GIVEN ClassConstructorParser#name THEN returns name', () => {
            expect(parser.name).toBe(classConstructorJson.name);
          });
        });

        describe('source', () => {
          test('GIVEN ClassConstructorParser#source THEN returns source', () => {
            expect(parser.source).toEqual(classConstructorJson.source);
          });
        });

        describe('comment', () => {
          test('GIVEN ClassConstructorParser#comment THEN returns comment', () => {
            expect(parser.comment).toEqual(classConstructorJson.comment);
          });
        });

        describe('parentId', () => {
          test('GIVEN ClassConstructorParser#parentId THEN returns parentId', () => {
            expect(parser.parentId).toBe(classConstructorJson.parentId);
          });
        });

        describe('accessibility', () => {
          test('GIVEN ClassConstructorParser#accessibility THEN returns accessibility', () => {
            expect(parser.accessibility).toBe(classConstructorJson.accessibility);
          });
        });

        describe('parameters', () => {
          test('GIVEN ClassConstructorParser#parameters THEN returns parameters', () => {
            expect(parser.parameters).toEqual(classConstructorJson.parameters);
          });
        });
      });

      describe('methods', () => {
        describe('isPublic', () => {
          test('GIVEN ClassConstructorParser#isPublic THEN returns true', () => {
            expect(parser.isPublic()).toBe(true);
          });
        });

        describe('isProtected', () => {
          test('GIVEN ClassConstructorParser#isProtected THEN returns false', () => {
            expect(parser.isProtected()).toBe(false);
          });
        });

        describe('isPrivate', () => {
          test('GIVEN ClassConstructorParser#isPrivate THEN returns false', () => {
            expect(parser.isPrivate()).toBe(false);
          });
        });

        describe('toJSON', () => {
          test('GIVEN ClassConstructorParser#toJSON THEN returns classConstructorJson', () => {
            expect(parser.toJSON()).toEqual(classConstructorJson);
          });
        });
      });
    });
  });
});
