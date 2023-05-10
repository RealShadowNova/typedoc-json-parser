import type { JSONOutput } from 'typedoc';
import { ReflectionKind, reflectionKindToString } from '../../types';
import { Parser } from '../Parser';
import { CommentParser, SourceParser, TypeParameterParser } from '../misc';
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
   * The namespace parent id of this class, if any.
   * @since 7.3.0
   */
  public readonly namespaceParentId: number | null;

  /**
   * The comment parser of this class.
   * @since 1.0.0
   */
  public readonly comment: CommentParser;

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
   * The type parameter parsers of this class.
   * @since 6.0.0
   */
  public readonly typeParameters: TypeParameterParser[];

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

  public constructor(data: ClassParser.Data) {
    super(data);

    const { namespaceParentId, comment, external, abstract, extendsType, implementsType, typeParameters, construct, properties, methods } = data;

    this.namespaceParentId = namespaceParentId;
    this.comment = comment;
    this.external = external;
    this.abstract = abstract;
    this.extendsType = extendsType;
    this.implementsType = implementsType;
    this.typeParameters = typeParameters;
    this.construct = construct;
    this.properties = properties;
    this.methods = methods;
  }

  /**
   * Converts this parser to a Json compatible format.
   * @since 1.0.0
   * @returns The Json compatible format of this parser.
   */
  public override toJSON(): ClassParser.Json {
    return {
      ...super.toJSON(),
      namespaceParentId: this.namespaceParentId,
      comment: this.comment.toJSON(),
      external: this.external,
      abstract: this.abstract,
      extendsType: this.extendsType ? this.extendsType.toJSON() : null,
      implementsType: this.implementsType.map((implementsType) => implementsType.toJSON()),
      typeParameters: this.typeParameters.map((typeParameter) => typeParameter.toJSON()),
      construct: this.construct.toJSON(),
      properties: this.properties,
      methods: this.methods
    };
  }

  /**
   * Generates a new {@link ClassParser} instance from the given data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @returns The generated parser.
   */
  public static generateFromTypeDoc(reflection: JSONOutput.DeclarationReflection, namespaceParentId: number | null): ClassParser {
    const {
      kind,
      id,
      name,
      comment = { summary: [] },
      sources = [],
      flags,
      children = [],
      extendedTypes = [],
      implementedTypes = [],
      typeParameters = []
    } = reflection;

    if (kind !== ReflectionKind.Class) {
      throw new Error(`Expected Project (${ReflectionKind.Project}), but received ${reflectionKindToString(kind)} (${kind})`);
    }

    const construct = children.find((child) => child.kind === ReflectionKind.Constructor);

    if (construct === undefined) throw new Error(`Expected Class (${ReflectionKind.Class}) with a constructor, but there was none`);

    const properties = children
      .filter((child) => child.kind === ReflectionKind.Property || (child.kind === ReflectionKind.Accessor && child.getSignature))
      .map((child) => ClassPropertyParser.generateFromTypeDoc(child, id));

    const methods = children.filter((child) => child.kind === ReflectionKind.Method).map((child) => ClassMethodParser.generateFromTypeDoc(child, id));

    return new ClassParser({
      id,
      name,
      namespaceParentId,
      comment: CommentParser.generateFromTypeDoc(comment),
      source: sources.length ? SourceParser.generateFromTypeDoc(sources[0]) : null,
      external: Boolean(flags.isExternal),
      abstract: Boolean(flags.isAbstract),
      extendsType: extendedTypes.length ? TypeParser.generateFromTypeDoc(extendedTypes[0]) : null,
      implementsType: implementedTypes.map((implementedType) => TypeParser.generateFromTypeDoc(implementedType)),
      typeParameters: typeParameters.map((typeParameter) => TypeParameterParser.generateFromTypeDoc(typeParameter)),
      construct: ClassConstructorParser.generateFromTypeDoc(construct, id),
      properties,
      methods
    });
  }

  /**
   * Generates a new {@link ClassParser} instance from the given data.
   * @param json The json to generate the parser from.
   * @returns The generated parser.
   */
  public static generateFromJson(json: ClassParser.Json): ClassParser {
    const {
      id,
      name,
      namespaceParentId,
      comment,
      source,
      external,
      abstract,
      extendsType,
      implementsType,
      typeParameters,
      construct,
      properties,
      methods
    } = json;

    return new ClassParser({
      id,
      name,
      namespaceParentId,
      comment: CommentParser.generateFromJson(comment),
      source: source ? SourceParser.generateFromJson(source) : null,
      external,
      abstract,
      extendsType: extendsType ? TypeParser.generateFromJson(extendsType) : null,
      implementsType: implementsType.map((implementedType) => TypeParser.generateFromJson(implementedType)),
      typeParameters: typeParameters.map((typeParameter) => TypeParameterParser.generateFromJson(typeParameter)),
      construct: ClassConstructorParser.generateFromJson(construct),
      properties: properties.map((property) => ClassPropertyParser.generateFromJson(property)),
      methods: methods.map((method) => ClassMethodParser.generateFromJson(method))
    });
  }
}

export namespace ClassParser {
  export interface Data extends Parser.Data {
    /**
     * The namespace parent id of this class, if any.
     * @since 7.3.0
     */
    namespaceParentId: number | null;

    /**
     * The comment parser of this class.
     * @since 1.0.0
     */
    comment: CommentParser;

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
     * The type parameter parsers of this class.
     * @since 6.0.0
     */
    typeParameters: TypeParameterParser[];

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

  export interface Json extends Parser.Json {
    /**
     * The namespace parent id of this class, if any.
     * @since 7.3.0
     */
    namespaceParentId: number | null;

    /**
     * The comment parser of this class.
     * @since 1.0.0
     */
    comment: CommentParser.Json;

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
     * The `extends` type of this class in a json compatible format.
     * @since 1.0.0
     */
    extendsType: TypeParser.Json | null;

    /**
     * The `implements` type of this class in a json compatible format.
     * @since 1.0.0
     */
    implementsType: TypeParser.Json[];

    /**
     * The type parameter parsers of this class in a json compatible format.
     * @since 6.0.0
     */
    typeParameters: TypeParameterParser.Json[];

    /**
     * The constructor parser of this class in a json compatible format.
     * @since 1.0.0
     */
    construct: ClassConstructorParser.Json;

    /**
     * The property parsers of this class in a json compatible format.
     * @since 1.0.0
     */
    properties: ClassPropertyParser.Json[];

    /**
     * The method parsers of this class in a json compatible format.
     * @since 1.0.0
     */
    methods: ClassMethodParser.Json[];
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
