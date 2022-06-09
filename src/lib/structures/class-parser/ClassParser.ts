import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { CommentParser, SourceParser } from '../misc';
import { Parser } from '../Parser';
import type { ProjectParser } from '../ProjectParser';
import { TypeParser } from '../type-parsers';
import { ClassConstructorParser } from './ClassConstructorParser';
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
   * The constructor parser of this class.
   * @since 1.0.0
   */
  public readonly construct: ClassConstructorParser;

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

    const { external, abstract, extendsType, implementsType, construct, properties, methods } = data;

    this.external = external;
    this.abstract = abstract;
    this.extendsType = extendsType;
    this.implementsType = implementsType;
    this.construct = construct;
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
      construct: this.construct.toJSON(),
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
  public static generateFromTypeDoc(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): ClassParser {
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

    const construct = children.find((child) => child.kind === ReflectionKind.Constructor);

    if (construct === undefined) throw new Error(`Expected Class (${ReflectionKind.Class}) with a constructor, but there was none`);

    const properties = children
      .filter((child) => child.kind === ReflectionKind.Property || (child.kind === ReflectionKind.Accessor && child.getSignature))
      .map((child) => ClassPropertyParser.generateFromTypeDoc(child, project));
    const methods = children
      .filter((child) => child.kind === ReflectionKind.Method)
      .map((child) => ClassMethodParser.generateFromTypeDoc(child, project));

    return new ClassParser(
      {
        id,
        name,
        comment: CommentParser.generateFromTypeDoc(comment, project),
        source: sources.length ? SourceParser.generateFromTypeDoc(sources[0], project) : null,
        external: Boolean(flags.isExternal),
        abstract: Boolean(flags.isAbstract),
        extendsType: extendedTypes.length ? TypeParser.generateFromTypeDoc(extendedTypes[0]) : null,
        implementsType: implementedTypes.map((implementedType) => TypeParser.generateFromTypeDoc(implementedType)),
        construct: ClassConstructorParser.generateFromTypeDoc(construct, project),
        properties,
        methods
      },
      project
    );
  }

  public static generateFromJSON(json: ClassParser.JSON, project: ProjectParser): ClassParser {
    const { id, name, comment, source, external, abstract, extendsType, implementsType, construct, properties, methods } = json;

    return new ClassParser(
      {
        id,
        name,
        comment: CommentParser.generateFromJSON(comment, project),
        source: source ? SourceParser.generateFromJSON(source, project) : null,
        external,
        abstract,
        extendsType: extendsType ? TypeParser.generateFromJSON(extendsType) : null,
        implementsType: implementsType.map((implementedType) => TypeParser.generateFromJSON(implementedType)),
        construct: ClassConstructorParser.generateFromJSON(construct, project),
        properties: properties.map((property) => ClassPropertyParser.generateFromJSON(property, project)),
        methods: methods.map((method) => ClassMethodParser.generateFromJSON(method, project))
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
     * The constructor parser of this class.
     * @since 1.0.0
     */
    construct: ClassConstructorParser;

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
     * The constructor parser of this class in a JSON compatible format.
     * @since 1.0.0
     */
    construct: ClassConstructorParser.JSON;

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
