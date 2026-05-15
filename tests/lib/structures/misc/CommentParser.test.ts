import type { JSONOutput } from 'typedoc';
import { CommentParser } from '../../../../src/';

export const commentReflection: JSONOutput.Comment = {
  summary: [{ kind: 'text', text: 'This is a description.' }],
  blockTags: [{ tag: '@tag', content: [{ kind: 'text', text: 'This is a tag.' }] }],
  modifierTags: ['modifier']
};

export const commentJson: CommentParser.Json = {
  description: 'This is a description.',
  blockTags: [{ name: 'tag', text: 'This is a tag.' }],
  modifierTags: ['modifier']
};

describe('CommentParser', () => {
  describe('is a class', () => {
    test('GIVEN typeof CommentParser THEN returns function', () => {
      expect(typeof CommentParser).toBe('function');
    });

    test('GIVEN typeof ...prototype THEN returns object', () => {
      expect(typeof CommentParser.prototype).toBe('object');
    });
  });

  describe('can create instance', () => {
    describe('generateFromTypeDoc', () => {
      test('GIVEN comment THEN returns CommentParser', () => {
        expect(CommentParser.generateFromTypeDoc(commentReflection)).toBeInstanceOf(CommentParser);
      });

      const parser = CommentParser.generateFromJson(commentJson);

      describe('properties', () => {
        describe('description', () => {
          test('GIVEN CommentParser#description THEN returns description', () => {
            expect(parser.description).toBe(commentJson.description);
          });
        });

        describe('blockTags', () => {
          test('GIVEN CommentParser#blockTags THEN returns blockTags', () => {
            expect(parser.blockTags).toBe(commentJson.blockTags);
          });
        });

        describe('modifierTags', () => {
          test('GIVEN CommentParser#modifierTags THEN returns modifierTags', () => {
            expect(parser.modifierTags).toBe(commentJson.modifierTags);
          });
        });
      });

      describe('accessors', () => {
        describe('see', () => {
          test('GIVEN CommentParser#see THEN returns empty array', () => {
            expect(parser.see).toEqual([]);
          });
        });

        describe('example', () => {
          test('GIVEN CommentParser#example THEN returns empty array', () => {
            expect(parser.example).toEqual([]);
          });
        });

        describe('deprecated', () => {
          test('GIVEN CommentParser#deprecated THEN returns null', () => {
            expect(parser.deprecated).toBe(false);
          });
        });
      });

      describe('methods', () => {
        describe('toJSON', () => {
          test('GIVEN CommentParser#toJSON THEN returns json', () => {
            expect(parser.toJSON()).toEqual(commentJson);
          });
        });
      });
    });

    describe('generateFromJson', () => {
      test('GIVEN valid json THEN returns instance', () => {
        expect(CommentParser.generateFromJson(commentJson)).toBeInstanceOf(CommentParser);
      });

      const parser = CommentParser.generateFromJson(commentJson);

      describe('properties', () => {
        describe('description', () => {
          test('GIVEN CommentParser#description THEN returns description', () => {
            expect(parser.description).toBe(commentJson.description);
          });
        });

        describe('blockTags', () => {
          test('GIVEN CommentParser#blockTags THEN returns blockTags', () => {
            expect(parser.blockTags).toBe(commentJson.blockTags);
          });
        });

        describe('modifierTags', () => {
          test('GIVEN CommentParser#modifierTags THEN returns modifierTags', () => {
            expect(parser.modifierTags).toBe(commentJson.modifierTags);
          });
        });
      });

      describe('accessors', () => {
        describe('see', () => {
          test('GIVEN CommentParser#see THEN returns empty array', () => {
            expect(parser.see).toEqual([]);
          });
        });

        describe('example', () => {
          test('GIVEN CommentParser#example THEN returns empty array', () => {
            expect(parser.example).toEqual([]);
          });
        });

        describe('deprecated', () => {
          test('GIVEN CommentParser#deprecated THEN returns null', () => {
            expect(parser.deprecated).toBe(false);
          });
        });
      });

      describe('methods', () => {
        describe('toJSON', () => {
          test('GIVEN CommentParser#toJSON THEN returns json', () => {
            expect(parser.toJSON()).toEqual(commentJson);
          });
        });
      });
    });
  });
});
