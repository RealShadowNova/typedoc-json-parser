import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { TypeParser } from '../type-parsers';
import { CommentParser } from './CommentParser';

/**
 * Parses data from a parameter reflection.
 * @since 1.0.0
 */
export class ParameterParser {
  /**
   * The identifier of this parser.
   * @since 1.0.0
   */
  public readonly id: number;

  /**
   * The name of this parameter.
   * @since 1.0.0
   */
  public readonly name: string;

  /**
   * The comment of this parameter.
   * @since 5.3.0
   */
  public readonly comment: CommentParser;

  /**
   * Whether this parameter is optional.
   * @since 7.1.0
   */
  public readonly optional: boolean;

  /**
   * The type of this parameter.
   * @since 1.0.0
   */
  public readonly type: TypeParser;

  public constructor(data: ParameterParser.Data) {
    const { id, name, comment, optional, type } = data;

    this.id = id;
    this.name = name;
    this.comment = comment;
    this.optional = optional;
    this.type = type;
  }

  /**
   * Converts this parser to a Json compatible format.
   * @since 1.0.0
   * @returns The Json compatible format of this parser.
   */
  public toJSON(): ParameterParser.Json {
    return {
      id: this.id,
      name: this.name,
      comment: this.comment.toJSON(),
      optional: this.optional,
      type: this.type.toJSON()
    };
  }

  /**
   * Generates a new {@link ParameterParser} instance from the given data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @returns The generated parser.
   */
  public static generateFromTypeDoc(reflection: JSONOutput.DeclarationReflection): ParameterParser {
    const { kind, kindString = 'Unknown', id, name, comment = { summary: [] }, flags, type } = reflection;

    if (kind !== ReflectionKind.Parameter) {
      throw new Error(`Expected Parameter (${ReflectionKind.Parameter}), but received ${kindString} (${kind})`);
    }

    return new ParameterParser({
      id,
      name,
      comment: CommentParser.generateFromTypeDoc(comment),
      optional: flags.isOptional ?? false,
      type: TypeParser.generateFromTypeDoc(type!)
    });
  }

  /**
   * Generates a new {@link ClassConstructorParser} instance from the given data.
   * @param json The json to generate the parser from.
   * @returns The generated parser.
   */
  public static generateFromJson(json: ParameterParser.Json): ParameterParser {
    const { id, name, comment, optional, type } = json;

    return new ParameterParser({
      id,
      name,
      comment: CommentParser.generateFromJson(comment),
      optional,
      type: TypeParser.generateFromJson(type)
    });
  }
}

export namespace ParameterParser {
  export interface Data {
    /**
     * The identifier of this parser.
     * @since 1.0.0
     */
    id: number;

    /**
     * The name of this parameter.
     * @since 1.0.0
     */
    name: string;

    /**
     * The comment of this parameter.
     * @since 5.3.0
     */
    comment: CommentParser;

    /**
     * Whether this parameter is optional.
     * @since 7.1.0
     */
    optional: boolean;

    /**
     * The type of this parameter.
     * @since 1.0.0
     */
    type: TypeParser;
  }

  export interface Json {
    /**
     * The identifier of this parser.
     * @since 1.0.0
     */
    id: number;

    /**
     * The name of this parameter.
     * @since 1.0.0
     */
    name: string;

    /**
     * The comment of this parameter.
     * @since 5.3.0
     */
    comment: CommentParser.Json;

    /**
     * Whether this parameter is optional.
     * @since 7.1.0
     */
    optional: boolean;

    /**
     * The type of this parameter in a Json compatible format.
     * @since 1.0.0
     */
    type: TypeParser.Json;
  }
}
