import type { JSONOutput } from 'typedoc';
import { ClassMethodParser, ClassParser } from '../../../../src/';
import { signatureJson, signatureReflection } from '../misc/SignatureParser.test';
import { sourceJson, sourceReflection } from '../misc/SourceParser.test';

export const classMethodReflection: JSONOutput.DeclarationReflection = {
  id: 1,
  name: 'method',
  kind: 2048,
  kindString: 'Method',
  flags: { isPublic: true },
  sources: [sourceReflection],
  signatures: [signatureReflection]
};

export const classMethodJson: ClassMethodParser.Json = {
  id: 1,
  name: 'method',
  source: sourceJson,
  parentId: 2,
  accessibility: ClassParser.Accessibility.Public,
  static: false,
  abstract: false,
  signatures: [signatureJson]
};

describe('ClassMethodParser', () => {
  describe('is a class', () => {
    test('GIVEN typeof ClassMethodParser THEN returns function', () => {
      expect(typeof ClassMethodParser).toBe('function');
    });

    test('GIVEN typeof ...prototype THEN returns object', () => {
      expect(typeof ClassMethodParser.prototype).toBe('object');
    });
  });

  describe('can create instance', () => {
    describe('generateFromTypeDoc', () => {
      test('GIVEN classMethodReflection THEN returns ClassMethodParser', () => {
        expect(ClassMethodParser.generateFromTypeDoc(classMethodReflection, classMethodJson.parentId)).toBeInstanceOf(ClassMethodParser);
      });

      const parser = ClassMethodParser.generateFromTypeDoc(classMethodReflection, classMethodJson.parentId);

      describe('properties', () => {
        describe('id', () => {
          test('GIVEN ClassMethodParser#id THEN returns id', () => {
            expect(parser.id).toBe(classMethodJson.id);
          });
        });

        describe('name', () => {
          test('GIVEN ClassMethodParser#name THEN returns name', () => {
            expect(parser.name).toBe(classMethodJson.name);
          });
        });

        describe('source', () => {
          test('GIVEN ClassMethodParser#source THEN returns source', () => {
            expect(parser.source).toEqual(classMethodJson.source);
          });
        });

        describe('parentId', () => {
          test('GIVEN ClassMethodParser#parentId THEN returns parentId', () => {
            expect(parser.parentId).toBe(classMethodJson.parentId);
          });
        });

        describe('accessibility', () => {
          test('GIVEN ClassMethodParser#accessibility THEN returns accessibility', () => {
            expect(parser.accessibility).toBe(classMethodJson.accessibility);
          });
        });

        describe('static', () => {
          test('GIVEN ClassMethodParser#static THEN returns static', () => {
            expect(parser.static).toBe(classMethodJson.static);
          });
        });

        describe('abstract', () => {
          test('GIVEN ClassMethodParser#abstract THEN returns abstract', () => {
            expect(parser.abstract).toBe(classMethodJson.abstract);
          });
        });

        describe('signatures', () => {
          test('GIVEN ClassMethodParser#signatures THEN returns signatures', () => {
            expect(parser.signatures).toEqual(classMethodJson.signatures);
          });
        });
      });

      describe('methods', () => {
        describe('isPublic', () => {
          test('GIVEN ClassMethodParser#isPublic THEN returns true', () => {
            expect(parser.isPublic()).toBe(true);
          });
        });

        describe('isProtected', () => {
          test('GIVEN ClassMethodParser#isProtected THEN returns false', () => {
            expect(parser.isProtected()).toBe(false);
          });
        });

        describe('isPrivate', () => {
          test('GIVEN ClassMethodParser#isPrivate THEN returns false', () => {
            expect(parser.isPrivate()).toBe(false);
          });
        });

        describe('toJSON', () => {
          test('GIVEN ClassMethodParser#toJSON THEN returns json', () => {
            expect(parser.toJSON()).toEqual(classMethodJson);
          });
        });
      });
    });

    describe('generateFromJson', () => {
      test('GIVEN classMethodJson THEN returns ClassMethodParser', () => {
        expect(ClassMethodParser.generateFromJson(classMethodJson)).toBeInstanceOf(ClassMethodParser);
      });

      const parser = ClassMethodParser.generateFromJson(classMethodJson);

      describe('properties', () => {
        describe('id', () => {
          test('GIVEN ClassMethodParser#id THEN returns id', () => {
            expect(parser.id).toBe(classMethodJson.id);
          });
        });

        describe('name', () => {
          test('GIVEN ClassMethodParser#name THEN returns name', () => {
            expect(parser.name).toBe(classMethodJson.name);
          });
        });

        describe('source', () => {
          test('GIVEN ClassMethodParser#source THEN returns source', () => {
            expect(parser.source).toEqual(classMethodJson.source);
          });
        });

        describe('parentId', () => {
          test('GIVEN ClassMethodParser#parentId THEN returns parentId', () => {
            expect(parser.parentId).toBe(classMethodJson.parentId);
          });
        });

        describe('accessibility', () => {
          test('GIVEN ClassMethodParser#accessibility THEN returns accessibility', () => {
            expect(parser.accessibility).toBe(classMethodJson.accessibility);
          });
        });

        describe('static', () => {
          test('GIVEN ClassMethodParser#static THEN returns static', () => {
            expect(parser.static).toBe(classMethodJson.static);
          });
        });

        describe('abstract', () => {
          test('GIVEN ClassMethodParser#abstract THEN returns abstract', () => {
            expect(parser.abstract).toBe(classMethodJson.abstract);
          });
        });

        describe('signatures', () => {
          test('GIVEN ClassMethodParser#signatures THEN returns signatures', () => {
            expect(parser.signatures).toEqual(classMethodJson.signatures);
          });
        });
      });

      describe('methods', () => {
        describe('isPublic', () => {
          test('GIVEN ClassMethodParser#isPublic THEN returns true', () => {
            expect(parser.isPublic()).toBe(true);
          });
        });

        describe('isProtected', () => {
          test('GIVEN ClassMethodParser#isProtected THEN returns false', () => {
            expect(parser.isProtected()).toBe(false);
          });
        });

        describe('isPrivate', () => {
          test('GIVEN ClassMethodParser#isPrivate THEN returns false', () => {
            expect(parser.isPrivate()).toBe(false);
          });
        });

        describe('toJSON', () => {
          test('GIVEN ClassMethodParser#toJSON THEN returns json', () => {
            expect(parser.toJSON()).toEqual(classMethodJson);
          });
        });
      });
    });
  });
});
