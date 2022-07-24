import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../types';
import { CommentParser, SourceParser, TypeParameterParser } from './misc/';
import { Parser } from './Parser';
import type { ProjectParser } from './ProjectParser';
import { TypeParser } from './type-parsers';

/**
 * Parses data from a type alias reflection.
 * @since 1.0.0
 */
export class TypeAliasParser extends Parser {
  /**
   * Whether this type alias is external.
   * @since 1.0.0
   */
  public readonly external: boolean;

  /**
   * The type parameters of this type alias.
   * @since 1.0.0
   */
  public readonly typeParameters: TypeParameterParser[];

  /**
   * The type of this type alias.
   * @since 1.0.0
   */
  public readonly type: TypeParser;

  public constructor(data: TypeAliasParser.Data, project: ProjectParser) {
    super(data, project);

    const { external, typeParameters, type } = data;

    this.external = external;
    this.typeParameters = typeParameters;
    this.type = type;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): TypeAliasParser.JSON {
    return {
      ...super.toJSON(),
      external: this.external,
      typeParameters: this.typeParameters.map((typeParameter) => typeParameter.toJSON()),
      type: this.type.toJSON()
    };
  }

  /**
   * Generates a new {@link TypeAliasParser} instance from the given data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @param project The project this parser belongs to.
   * @returns The generated parser.
   */
  public static generateFromTypeDoc(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): TypeAliasParser {
    const { kind, kindString = 'Unknown', id, name, comment = { summary: [] }, sources = [], flags, type, typeParameters = [] } = reflection;

    if (kind !== ReflectionKind.TypeAlias) throw new Error(`Expected TypeAlias (${ReflectionKind.TypeAlias}), but received ${kindString} (${kind})`);

    return new TypeAliasParser(
      {
        id,
        name,
        comment: CommentParser.generateFromTypeDoc(comment, project),
        source: sources.length ? SourceParser.generateFromTypeDoc(sources[0], project) : null,
        external: Boolean(flags.isExternal),
        typeParameters: typeParameters.map((typeParameter) => TypeParameterParser.generateFromTypeDoc(typeParameter, project)),
        type: TypeParser.generateFromTypeDoc(type!)
      },
      project
    );
  }

  public static generateFromJSON(json: TypeAliasParser.JSON, project: ProjectParser): TypeAliasParser {
    const { id, name, comment, source, external, typeParameters, type } = json;

    return new TypeAliasParser(
      {
        id,
        name,
        comment: CommentParser.generateFromJSON(comment, project),
        source: source ? SourceParser.generateFromJSON(source, project) : null,
        external,
        typeParameters: typeParameters.map((typeParameter) => TypeParameterParser.generateFromJSON(typeParameter, project)),
        type: TypeParser.generateFromJSON(type)
      },
      project
    );
  }
}

export namespace TypeAliasParser {
  export interface Data extends Parser.Data {
    /**
     * Whether this type alias is external.
     * @since 1.0.0
     */
    external: boolean;

    /**
     * The type parameters of this type alias.
     * @since 1.0.0
     */
    typeParameters: TypeParameterParser[];

    /**
     * The type of this type alias.
     * @since 1.0.0
     */
    type: TypeParser;
  }

  export interface JSON extends Parser.JSON {
    /**
     * Whether this type alias is external.
     * @since 1.0.0
     */
    external: boolean;

    /**
     * The type parameters of this type alias in a JSON compatible format.
     * @since 1.0.0
     */
    typeParameters: TypeParameterParser.JSON[];

    /**
     * The type of this type alias in a JSON compatible format.
     */
    type: TypeParser.JSON;
  }
}
