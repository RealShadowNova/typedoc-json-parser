import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { SignatureParser, SourceParser } from '../misc';
import { Parser } from '../Parser';
import type { ProjectParser } from '../ProjectParser';
import { ClassParser } from './ClassParser';

/**
 * Parses data from a class method reflection.
 * @since 1.0.0
 */
export class ClassMethodParser extends Parser {
  /**
   * The id of the parent class parser.
   * @since 4.0.0
   */
  public readonly parentId: number;

  /**
   * The accessibility of this method.
   * @since 1.0.0
   */
  public readonly accessibility: ClassParser.Accessibility;

  /**
   * Whether this method is abstract.
   * @since 1.0.0
   */
  public readonly abstract: boolean;

  /**
   * Whether this method is static.
   * @since 1.0.0
   */
  public readonly static: boolean;

  /**
   * The signature parsers of this method.
   * @since 1.0.0
   */
  public readonly signatures: SignatureParser[];

  public constructor(data: ClassMethodParser.Data, project: ProjectParser) {
    super(data, project);

    const { parentId, accessibility, abstract, static: _static, signatures } = data;

    this.parentId = parentId;
    this.accessibility = accessibility;
    this.abstract = abstract;
    this.static = _static;
    this.signatures = signatures;
  }

  /**
   * The parent class parser.
   * @since 4.0.0
   */
  public get parent(): ClassParser {
    return this.project.find(this.parentId) as ClassParser;
  }

  /**
   * Convert this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): ClassMethodParser.JSON {
    return {
      ...super.toJSON(),
      parentId: this.parentId,
      accessibility: this.accessibility,
      abstract: this.abstract,
      static: this.static,
      signatures: this.signatures.map((signature) => signature.toJSON())
    };
  }

  /**
   * Generates a new {@link ClassMethodParser} instance from the given data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @param project The project this parser belongs to.
   * @returns The generated parser.
   */
  public static generateFromTypeDoc(reflection: JSONOutput.DeclarationReflection, parentId: number, project: ProjectParser): ClassMethodParser {
    const { kind, kindString = 'Unknown', id, name, sources = [], flags, signatures = [] } = reflection;

    if (kind !== ReflectionKind.Method) throw new Error(`Expected Method (${ReflectionKind.Method}), but received ${kindString} (${kind})`);

    return new ClassMethodParser(
      {
        id,
        name,
        source: sources.length ? SourceParser.generateFromTypeDoc(sources[0], project) : null,
        parentId,
        accessibility: flags.isPrivate
          ? ClassParser.Accessibility.Private
          : flags.isProtected
          ? ClassParser.Accessibility.Protected
          : ClassParser.Accessibility.Public,
        abstract: Boolean(flags.isAbstract),
        static: Boolean(flags.isStatic),
        signatures: signatures.map((signature) => SignatureParser.generateFromTypeDoc(signature, project))
      },
      project
    );
  }

  public static generateFromJSON(json: ClassMethodParser.JSON, project: ProjectParser): ClassMethodParser {
    const { id, name, source, parentId, accessibility, abstract, static: _static, signatures } = json;

    return new ClassMethodParser(
      {
        id,
        name,
        source: source ? SourceParser.generateFromJSON(source, project) : null,
        parentId,
        accessibility,
        abstract,
        static: _static,
        signatures: signatures.map((signature) => SignatureParser.generateFromJSON(signature, project))
      },
      project
    );
  }
}

export namespace ClassMethodParser {
  export interface Data extends Parser.Data {
    /**
     * The id of the parent class parser.
     * @since 4.0.0
     */
    parentId: number;

    /**
     * The accessibility of this method.
     * @since 1.0.0
     */
    accessibility: ClassParser.Accessibility;

    /**
     * Whether this method is abstract.
     * @since 1.0.0
     */
    abstract: boolean;

    /**
     * Whether this method is static.
     * @since 1.0.0
     */
    static: boolean;

    /**
     * The signature parsers of this method.
     * @since 1.0.0
     */
    signatures: SignatureParser[];
  }

  export interface JSON extends Parser.JSON {
    /**
     * The id of the parent class parser.
     * @since 4.0.0
     */
    parentId: number;

    /**
     * The accessibility of this method.
     * @since 1.0.0
     */
    accessibility: ClassParser.Accessibility;

    /**
     * Whether this method is abstract.
     * @since 1.0.0
     */
    abstract: boolean;

    /**
     * Whether this method is static.
     * @since 1.0.0
     */
    static: boolean;

    /**
     * The signature parsers of this method in a JSON compatible format.
     * @since 1.0.0
     */
    signatures: SignatureParser.JSON[];
  }
}
