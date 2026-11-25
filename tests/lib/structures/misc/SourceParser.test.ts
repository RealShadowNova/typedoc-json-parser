import type { JSONOutput } from 'typedoc';
import { SourceParser } from '../../../../src/';

export const sourceReflection: JSONOutput.SourceReference = {
  fileName: 'path/to/FileName.ts',
  line: 1,
  character: 1,
  url: 'https://example.com'
};

export const sourceJson: SourceParser.Json = {
  file: 'FileName.ts',
  path: 'path/to',
  line: 1,
  url: 'https://example.com'
};

describe('SourceParser', () => {
  describe('is a class', () => {
    test('GIVEN typeof SourceParser THEN returns function', () => {
      expect(typeof SourceParser).toBe('function');
    });

    test('GIVEN typeof ...prototype THEN returns object', () => {
      expect(typeof SourceParser.prototype).toBe('object');
    });
  });

  describe('can create instance', () => {
    describe('generateFromTypeDoc', () => {
      test('GIVEN reflection THEN returns SourceParser', () => {
        expect(SourceParser.generateFromTypeDoc(sourceReflection)).toBeInstanceOf(SourceParser);
      });

      const parser = SourceParser.generateFromTypeDoc(sourceReflection);

      describe('properties', () => {
        describe('line', () => {
          test('GIVEN SourceParser#line THEN returns line', () => {
            expect(parser.line).toBe(sourceJson.line);
          });
        });

        describe('file', () => {
          test('GIVEN SourceParser#file THEN returns file', () => {
            expect(parser.file).toBe(sourceJson.file);
          });
        });

        describe('path', () => {
          test('GIVEN SourceParser#path THEN returns path', () => {
            expect(parser.path).toBe(sourceJson.path);
          });
        });

        describe('url', () => {
          test('GIVEN SourceParser#url THEN returns url', () => {
            expect(parser.url).toBe(sourceJson.url);
          });
        });
      });

      describe('methods', () => {
        describe('toJSON', () => {
          test('GIVEN SourceParser#toJSON THEN returns json', () => {
            expect(parser.toJSON()).toEqual(sourceJson);
          });
        });
      });
    });

    describe('generateFromJson', () => {
      test('GIVEN json THEN returns SourceParser', () => {
        expect(SourceParser.generateFromJson(sourceJson)).toBeInstanceOf(SourceParser);
      });

      const parser = SourceParser.generateFromJson(sourceJson);

      describe('properties', () => {
        describe('line', () => {
          test('GIVEN SourceParser#line THEN returns line', () => {
            expect(parser.line).toBe(sourceJson.line);
          });
        });

        describe('file', () => {
          test('GIVEN SourceParser#file THEN returns file', () => {
            expect(parser.file).toBe(sourceJson.file);
          });
        });

        describe('path', () => {
          test('GIVEN SourceParser#path THEN returns path', () => {
            expect(parser.path).toBe(sourceJson.path);
          });
        });

        describe('url', () => {
          test('GIVEN SourceParser#url THEN returns url', () => {
            expect(parser.url).toBe(sourceJson.url);
          });
        });
      });

      describe('methods', () => {
        describe('toJSON', () => {
          test('GIVEN SourceParser#toJSON THEN returns json', () => {
            expect(parser.toJSON()).toEqual(sourceJson);
          });
        });
      });
    });
  });
});
