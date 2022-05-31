import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { CommentParser, SourceParser } from '../misc';
import { Parser } from '../Parser';
import type { ProjectParser } from '../ProjectParser';
import { TypeParser } from '../type-parsers';
import { ClassMethodParser } from './ClassMethodParser';
import { ClassPropertyParser } from './ClassPropertyParser';

/**
 * Parses data from a class reflection.
 * @since 1.0.0
 */
export class ClassParser extends Parser {
  /**
   * Whether this class is external.
   * @since 1.0.0
   */
  public readonly external: boolean;

  /**
   * Whether this class is abstract.
   * @since 1.0.0
   */
  public readonly abstract: boolean;

  /**
   * The `extends` type of this class.
   * @since 1.0.0
   */
  public readonly extendsType: TypeParser | null;

  /**
   * The `implements` type of this class.
   * @since 1.0.0
   */
  public readonly implementsType: TypeParser[];

  /**
   * The property parsers of this class.
   * @since 1.0.0
   */
  public readonly properties: ClassPropertyParser[];

  /**
   * The method parsers of this class.
   * @since 1.0.0
   */
  public readonly methods: ClassMethodParser[];

  public constructor(data: ClassParser.Data, project: ProjectParser) {
    super(data, project);

    const { external, abstract, extendsType, implementsType, properties, methods } = data;

    this.external = external;
    this.abstract = abstract;
    this.extendsType = extendsType;
    this.implementsType = implementsType;
    this.properties = properties;
    this.methods = methods;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): ClassParser.JSON {
    return {
      ...super.toJSON(),
      external: this.external,
      abstract: this.abstract,
      extendsType: this.extendsType ? this.extendsType.toJSON() : null,
      implementsType: this.implementsType.map((implementsType) => implementsType.toJSON()),
      properties: this.properties,
      methods: this.methods
    };
  }

  /**
   * Generates a new {@link ClassParser} instance from the given data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @param project The project this parser belongs to.
   * @returns The generated parser.
   */
  public static generate(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): ClassParser {
    const {
      kind,
      kindString = 'Unknown',
      id,
      name,
      comment = {},
      sources = [],
      flags,
      children = [],
      extendedTypes = [],
      implementedTypes = []
    } = reflection;

    if (kind !== ReflectionKind.Class) throw new Error(`Expected Project (${ReflectionKind.Project}), but received ${kindString} (${kind})`);

    const properties = children
      .filter((child) => child.kind === ReflectionKind.Property || (child.kind === ReflectionKind.Accessor && child.getSignature))
      .map((child) => ClassPropertyParser.generate(child, project));
    const methods = children.filter((child) => child.kind === ReflectionKind.Method).map((child) => ClassMethodParser.generate(child, project));

    return new ClassParser(
      {
        id,
        name,
        comment: CommentParser.generate(comment, project),
        source: sources.length ? SourceParser.generate(sources[0], project) : null,
        external: Boolean(flags.isExternal),
        abstract: Boolean(flags.isAbstract),
        extendsType: extendedTypes.length ? TypeParser.generate(extendedTypes[0], project) : null,
        implementsType: implementedTypes.map((implementedType) => TypeParser.generate(implementedType, project)),
        properties,
        methods
      },
      project
    );
  }
}

export namespace ClassParser {
  export interface Data extends Parser.Data {
    /**
     * Whether this class is external.
     * @since 1.0.0
     */
    external: boolean;

    /**
     * Whether this class is abstract.
     * @since 1.0.0
     */
    abstract: boolean;

    /**
     * The `extends` type of this class.
     * @since 1.0.0
     */
    extendsType: TypeParser | null;

    /**
     * The `implements` type of this class.
     * @since 1.0.0
     */
    implementsType: TypeParser[];

    /**
     * The property parsers of this class.
     * @since 1.0.0
     */
    properties: ClassPropertyParser[];

    /**
     * The method parsers of this class.
     * @since 1.0.0
     */
    methods: ClassMethodParser[];
  }

  export interface JSON extends Parser.JSON {
    /**
     * Whether this class is external in a JSON compatible format.
     * @since 1.0.0
     */
    external: boolean;

    /**
     * Whether this class is abstract in a JSON compatible format.
     * @since 1.0.0
     */
    abstract: boolean;

    /**
     * The `extends` type of this class in a JSON compatible format.
     * @since 1.0.0
     */
    extendsType: TypeParser.JSON | null;

    /**
     * The `implements` type of this class in a JSON compatible format.
     * @since 1.0.0
     */
    implementsType: TypeParser.JSON[];

    /**
     * The property parsers of this class in a JSON compatible format.
     * @since 1.0.0
     */
    properties: ClassPropertyParser.JSON[];

    /**
     * The method parsers of this class in a JSON compatible format.
     * @since 1.0.0
     */
    methods: ClassMethodParser.JSON[];
  }

  /**
   * The accessibility types of a class.
   * @since 1.0.0
   */
  export enum Accessibility {
    Public = 'public',

    Protected = 'protected',

    Private = 'private'
  }
}
