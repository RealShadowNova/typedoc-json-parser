import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../types';
import { CommentParser, SignatureParser, SourceParser } from './misc';
import { Parser } from './Parser';
import type { ProjectParser } from './ProjectParser';

/**
 * Parses data from a function reflection.
 * @since 1.0.0
 */
export class FunctionParser extends Parser {
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

  public constructor(data: FunctionParser.Data, project: ProjectParser) {
    super(data, project);

    const { external, signatures } = data;

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
      external: this.external,
      signatures: this.signatures.map((signature) => signature.toJSON())
    };
  }

  /**
   * Generates a new {@link FunctionParser} instance from the given data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @param project The project this parser belongs to.
   * @returns The generated parser.
   */
  public static generateFromTypeDoc(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): FunctionParser {
    const { kind, kindString = 'Unknown', id, name, comment = {}, sources = [], flags, signatures = [] } = reflection;

    if (kind !== ReflectionKind.Function) throw new Error(`Expected Function (${ReflectionKind.Function}), but received ${kindString} (${kind})`);

    return new FunctionParser(
      {
        id,
        name,
        comment: CommentParser.generateFromTypeDoc(comment, project),
        source: sources.length ? SourceParser.generateFromTypeDoc(sources[0], project) : null,
        external: Boolean(flags.isExternal),
        signatures: signatures.map((signature) => SignatureParser.generateFromTypeDoc(signature, project))
      },
      project
    );
  }

  public static generateFromJSON(json: FunctionParser.JSON, project: ProjectParser): FunctionParser {
    const { id, name, comment, source, external, signatures } = json;

    return new FunctionParser(
      {
        id,
        name,
        comment: CommentParser.generateFromJSON(comment, project),
        source: source ? SourceParser.generateFromJSON(source, project) : null,
        external,
        signatures: signatures.map((signature) => SignatureParser.generateFromJSON(signature, project))
      },
      project
    );
  }
}

export namespace FunctionParser {
  export interface Data extends Parser.Data {
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
