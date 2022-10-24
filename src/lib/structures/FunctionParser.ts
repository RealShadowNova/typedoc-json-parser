import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../types';
import { CommentParser, SignatureParser, SourceParser } from './misc';
import { Parser } from './Parser';

/**
 * Parses data from a function reflection.
 * @since 1.0.0
 */
export class FunctionParser extends Parser {
  /**
   * The comment parser of this function.
   * @since 1.0.0
   */
  public readonly comment: CommentParser;

  /**
   * Whether this function is external.
   * @since 1.0.0
   */
  public readonly external: boolean;

  /**
   * The signature parsers of this function.
   * @since 1.0.0
   */
  public readonly signatures: SignatureParser[];

  public constructor(data: FunctionParser.Data) {
    super(data);

    const { comment, external, signatures } = data;

    this.comment = comment;
    this.external = external;
    this.signatures = signatures;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): FunctionParser.JSON {
    return {
      ...super.toJSON(),
      comment: this.comment.toJSON(),
      external: this.external,
      signatures: this.signatures.map((signature) => signature.toJSON())
    };
  }

  /**
   * Generates a new {@link FunctionParser} instance from the given data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @returns The generated parser.
   */
  public static generateFromTypeDoc(reflection: JSONOutput.DeclarationReflection): FunctionParser {
    const { kind, kindString = 'Unknown', id, name, comment = { summary: [] }, sources = [], flags, signatures = [] } = reflection;

    if (kind !== ReflectionKind.Function) throw new Error(`Expected Function (${ReflectionKind.Function}), but received ${kindString} (${kind})`);

    return new FunctionParser({
      id,
      name,
      comment: CommentParser.generateFromTypeDoc(comment),
      source: sources.length ? SourceParser.generateFromTypeDoc(sources[0]) : null,
      external: Boolean(flags.isExternal),
      signatures: signatures.map((signature) => SignatureParser.generateFromTypeDoc(signature))
    });
  }

  /**
   * Generates a new {@link FunctionParser} instance from the given data.
   * @param json The json to generate the parser from.
   * @returns The generated parser.
   */
  public static generateFromJSON(json: FunctionParser.JSON): FunctionParser {
    const { id, name, comment, source, external, signatures } = json;

    return new FunctionParser({
      id,
      name,
      comment: CommentParser.generateFromJSON(comment),
      source: source ? SourceParser.generateFromJSON(source) : null,
      external,
      signatures: signatures.map((signature) => SignatureParser.generateFromJSON(signature))
    });
  }
}

export namespace FunctionParser {
  export interface Data extends Parser.Data {
    /**
     * The comment parser of this function.
     * @since 1.0.0
     */
    comment: CommentParser;

    /**
     * Whether this function is external.
     * @since 1.0.0
     */
    external: boolean;

    /**
     * The signature parsers of this function.
     * @since 1.0.0
     */
    signatures: SignatureParser[];
  }

  export interface JSON extends Parser.JSON {
    /**
     * The comment parser of this function.
     * @since 1.0.0
     */
    comment: CommentParser.JSON;

    /**
     * Whether this function is external.
     * @since 1.0.0
     */
    external: boolean;

    /**
     * The signature parsers of this function in a JSON compatible format.
     * @since 1.0.0
     */
    signatures: SignatureParser.JSON[];
  }
}
