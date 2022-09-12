import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { CommentParser, SignatureParser, SourceParser } from '../misc';
import { Parser } from '../Parser';
import type { ProjectParser } from '../ProjectParser';
import type { InterfaceParser } from './InterfaceParser';

/**
 * Parses data from an interface method reflection.
 * @since 3.1.0
 */
export class InterfaceMethodParser extends Parser {
  /**
   * The id of the parent interface parser.
   * @since 4.0.0
   */
  public readonly parentId: number;

  /**
   * The signature parsers of this method.
   * @since 3.1.0
   */
  public readonly signatures: SignatureParser[];

  public constructor(data: InterfaceMethodParser.Data, project: ProjectParser) {
    super(data, project);

    const { parentId, signatures } = data;

    this.parentId = parentId;
    this.signatures = signatures;
  }

  /**
   * The parent interface parser.
   * @since 4.0.0
   */
  public get parent(): InterfaceParser {
    return this.project.find(this.parentId) as InterfaceParser;
  }

  /**
   * Convert this parser to a JSON compatible format.
   * @since 3.1.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): InterfaceMethodParser.JSON {
    return {
      ...super.toJSON(),
      parentId: this.parentId,
      signatures: this.signatures.map((signature) => signature.toJSON())
    };
  }

  /**
   * Generates a new {@link InterfaceMethodParser} instance from the given data.
   * @since 3.1.0
   * @param reflection The reflection to generate the parser from.
   * @param project The project this parser belongs to.
   * @returns The generated parser.
   */
  public static generateFromTypeDoc(reflection: JSONOutput.DeclarationReflection, parentId: number, project: ProjectParser): InterfaceMethodParser {
    const { kind, kindString = 'Unknown', id, name, comment = { summary: [] }, sources = [], signatures = [] } = reflection;

    if (kind !== ReflectionKind.Method) throw new Error(`Expected Method (${ReflectionKind.Method}), but received ${kindString} (${kind})`);

    return new InterfaceMethodParser(
      {
        id,
        name,
        comment: CommentParser.generateFromTypeDoc(comment, project),
        source: sources.length ? SourceParser.generateFromTypeDoc(sources[0], project) : null,
        parentId,
        signatures: signatures.map((signature) => SignatureParser.generateFromTypeDoc(signature, project))
      },
      project
    );
  }

  public static generateFromJSON(json: InterfaceMethodParser.JSON, project: ProjectParser): InterfaceMethodParser {
    const { id, name, comment, source, parentId, signatures } = json;

    return new InterfaceMethodParser(
      {
        id,
        name,
        comment: CommentParser.generateFromJSON(comment, project),
        source: source ? SourceParser.generateFromJSON(source, project) : null,
        parentId,
        signatures: signatures.map((signature) => SignatureParser.generateFromJSON(signature, project))
      },
      project
    );
  }
}

export namespace InterfaceMethodParser {
  export interface Data extends Parser.Data {
    /**
     * The id of the parent interface parser.
     * @since 4.0.0
     */
    parentId: number;

    /**
     * The signature parsers of this method.
     * @since 3.1.0
     */
    signatures: SignatureParser[];
  }

  export interface JSON extends Parser.JSON {
    /**
     * The id of the parent interface parser.
     * @since 4.0.0
     */
    parentId: number;

    /**
     * The signature parsers of this method in a JSON compatible format.
     * @since 3.1.0
     */
    signatures: SignatureParser.JSON[];
  }
}
