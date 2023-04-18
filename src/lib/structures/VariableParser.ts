import type { JSONOutput } from 'typedoc';
import { ReflectionKind, reflectionKindToString } from '../types';
import { Parser } from './Parser';
import { CommentParser, SourceParser } from './misc';
import { TypeParser } from './type-parsers';

/**
 * Parses data from a variable reflection.
 * @since 1.0.0
 */
export class VariableParser extends Parser {
  /**
   * The comment parser of this variable.
   * @since 1.0.0
   */
  public readonly comment: CommentParser;

  /**
   * Whether this variable is external.
   * @since 1.0.0
   */
  public readonly external: boolean;

  /**
   * The type of this variable.
   * @since 1.0.0
   */
  public readonly type: TypeParser;

  /**
   * The value of this variable.
   * @since 1.0.0
   */
  public readonly value: string;

  public constructor(data: VariableParser.Data) {
    super(data);

    const { comment, external, type, value } = data;

    this.comment = comment;
    this.external = external;
    this.type = type;
    this.value = value;
  }

  /**
   * Converts this parser to a Json compatible format.
   * @since 1.0.0
   * @returns The Json compatible format of this parser.
   */
  public override toJSON(): VariableParser.Json {
    return {
      ...super.toJSON(),
      comment: this.comment.toJSON(),
      external: this.external,
      type: this.type.toJSON(),
      value: this.value
    };
  }

  /**
   * Generates a new {@link VariableParser} instance from the given data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @param  The  this parser belongs to.
   * @returns The generated parser.
   */
  public static generateFromTypeDoc(reflection: JSONOutput.DeclarationReflection): VariableParser {
    const { kind, id, name, comment = { summary: [] }, sources = [], flags, type, defaultValue } = reflection;

    if (kind !== ReflectionKind.Variable) {
      throw new Error(`Expected Variable (${ReflectionKind.Variable}), but received ${reflectionKindToString(kind)} (${kind})`);
    }

    return new VariableParser({
      id,
      name,
      comment: CommentParser.generateFromTypeDoc(comment),
      source: sources.length ? SourceParser.generateFromTypeDoc(sources[0]) : null,
      external: Boolean(flags.isExternal),
      type: TypeParser.generateFromTypeDoc(type!),
      value: defaultValue!
    });
  }

  /**
   * Generates a new {@link VariableParser} instance from the given data.
   * @param json The json to generate the parser from.
   * @returns The generated parser.
   */
  public static generateFromJson(json: VariableParser.Json): VariableParser {
    const { id, name, comment, source, external, type, value } = json;

    return new VariableParser({
      id,
      name,
      comment: CommentParser.generateFromJson(comment),
      source: source ? SourceParser.generateFromJson(source) : null,
      external,
      type: TypeParser.generateFromJson(type),
      value
    });
  }
}

export namespace VariableParser {
  export interface Data extends Parser.Data {
    /**
     * The comment parser of this variable.
     * @since 1.0.0
     */
    comment: CommentParser;

    /**
     * Whether this variable is external.
     * @since 1.0.0
     */
    external: boolean;

    /**
     * The type of this variable.
     * @since 1.0.0
     */
    type: TypeParser;

    /**
     * The value of this variable.
     * @since 1.0.0
     */
    value: string;
  }

  export interface Json extends Parser.Json {
    /**
     * The comment parser of this constant.
     * @since 1.0.0
     */
    comment: CommentParser.Json;

    /**
     * Whether this variable is external.
     * @since 1.0.0
     */
    external: boolean;

    /**
     * The type of this variable in a Json compatible format.
     * @since 1.0.0
     */
    type: TypeParser.Json;

    /**
     * The value of this variable.
     * @since 1.0.0
     */
    value: string;
  }
}
