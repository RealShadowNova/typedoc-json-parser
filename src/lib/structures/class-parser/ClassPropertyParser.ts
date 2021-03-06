import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { CommentParser, SourceParser } from '../misc';
import { Parser } from '../Parser';
import type { ProjectParser } from '../ProjectParser';
import { TypeParser } from '../type-parsers';
import { ClassParser } from './ClassParser';

/**
 * Parses data from a class property reflection.
 * @since 1.0.0
 */
export class ClassPropertyParser extends Parser {
  /**
   * The accessibility of this property.
   * @since 1.0.0
   */
  public readonly accessibility: ClassParser.Accessibility;

  /**
   * Whether this property is abstract.
   * @since 1.0.0
   */
  public readonly abstract: boolean;

  /**
   * Whether this property is static.
   * @since 1.0.0
   */
  public readonly static: boolean;

  /**
   * Whether this property is readonly.
   * @since 1.0.0
   */
  public readonly readonly: boolean;

  /**
   * Whether this property is optional.
   * @since 1.0.0
   */
  public readonly optional: boolean;

  /**
   * The type parser of this property.
   * @since 1.0.0
   */
  public readonly type: TypeParser | null;

  public constructor(data: ClassPropertyParser.Data, project: ProjectParser) {
    super(data, project);

    const { accessibility, abstract, static: _static, readonly, optional, type } = data;

    this.accessibility = accessibility;
    this.abstract = abstract;
    this.static = _static;
    this.readonly = readonly;
    this.optional = optional;
    this.type = type;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): ClassPropertyParser.JSON {
    return {
      ...super.toJSON(),
      accessibility: this.accessibility,
      abstract: this.abstract,
      static: this.static,
      readonly: this.readonly,
      optional: this.optional,
      type: this.type ? this.type.toJSON() : null
    };
  }

  /**
   * Generates a new {@link ClassPropertyParser} instance from the given data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @param project The project this parser belongs to.
   * @returns The generated parser.
   */
  public static generateFromTypeDoc(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): ClassPropertyParser {
    const { kind, kindString = 'Unknown', id, name, comment = {}, sources = [], type, flags } = reflection;

    if (kind !== ReflectionKind.Property && kind !== ReflectionKind.Accessor) {
      throw new Error(
        `Expected Property (${ReflectionKind.Property}) or Accessor (${ReflectionKind.Accessor}), but received ${kindString} (${kind})`
      );
    }

    if (kind === ReflectionKind.Accessor) {
      const [getter] = reflection.getSignature ?? [];

      if (getter === undefined) throw new Error(`Expected Accessor (${ReflectionKind.Accessor}) with a getter, but there was none`);

      const { id, name, comment = {}, type, flags } = getter;

      return new ClassPropertyParser(
        {
          id,
          name,
          comment: CommentParser.generateFromTypeDoc(comment, project),
          source: sources.length ? SourceParser.generateFromTypeDoc(sources[0], project) : null,
          accessibility: flags.isPrivate
            ? ClassParser.Accessibility.Private
            : flags.isProtected
            ? ClassParser.Accessibility.Protected
            : ClassParser.Accessibility.Public,
          abstract: Boolean(flags.isAbstract),
          static: Boolean(flags.isStatic),
          readonly: Boolean(flags.isReadonly),
          optional: Boolean(flags.isOptional),
          type: type ? TypeParser.generateFromTypeDoc(type) : null
        },
        project
      );
    }

    return new ClassPropertyParser(
      {
        id,
        name,
        comment: CommentParser.generateFromTypeDoc(comment, project),
        source: sources.length ? SourceParser.generateFromTypeDoc(sources[0], project) : null,
        accessibility: flags.isPrivate
          ? ClassParser.Accessibility.Private
          : flags.isProtected
          ? ClassParser.Accessibility.Protected
          : ClassParser.Accessibility.Public,
        abstract: Boolean(flags.isAbstract),
        static: Boolean(flags.isStatic),
        readonly: Boolean(flags.isReadonly),
        optional: Boolean(flags.isOptional),
        type: type ? TypeParser.generateFromTypeDoc(type) : null
      },
      project
    );
  }

  public static generateFromJSON(json: ClassPropertyParser.JSON, project: ProjectParser): ClassPropertyParser {
    const { id, name, comment, source, accessibility, abstract, static: _static, readonly, optional, type } = json;

    return new ClassPropertyParser(
      {
        id,
        name,
        comment: CommentParser.generateFromJSON(comment, project),
        source: source ? SourceParser.generateFromJSON(source, project) : null,
        accessibility,
        abstract,
        static: _static,
        readonly,
        optional,
        type: type ? TypeParser.generateFromJSON(type) : null
      },
      project
    );
  }
}

export namespace ClassPropertyParser {
  export interface Data extends Parser.Data {
    /**
     * The accessibility of this property.
     * @since 1.0.0
     */
    accessibility: ClassParser.Accessibility;

    /**
     * Whether this property is abstract.
     * @since 1.0.0
     */
    abstract: boolean;

    /**
     * Whether this property is static.
     * @since 1.0.0
     */
    static: boolean;

    /**
     * Whether this property is readonly.
     * @since 1.0.0
     */
    readonly: boolean;

    /**
     * Whether this property is optional.
     * @since 1.0.0
     */
    optional: boolean;

    /**
     * The type parser of this property.
     * @since 1.0.0
     */
    type: TypeParser | null;
  }

  export interface JSON extends Parser.JSON {
    /**
     * The accessibility of this property.
     * @since 1.0.0
     */
    accessibility: ClassParser.Accessibility;

    /**
     * Whether this property is abstract.
     * @since 1.0.0
     */
    abstract: boolean;

    /**
     * Whether this property is static.
     * @since 1.0.0
     */
    static: boolean;

    /**
     * Whether this property is readonly.
     * @since 1.0.0
     */
    readonly: boolean;

    /**
     * Whether this property is optional.
     * @since 1.0.0
     */
    optional: boolean;

    /**
     * The type parser of this property in a JSON compatible format.
     * @since 1.0.0
     */
    type: TypeParser.JSON | null;
  }
}
