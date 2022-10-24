import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { CommentParser, ParameterParser, SourceParser } from '../misc';
import { Parser } from '../Parser';

export class ClassConstructorParser extends Parser {
  /**
   * The comment parser of this constructor.
   * @since 1.0.0
   */
  public readonly comment: CommentParser;

  /**
   * The id of the parent class parser.
   * @since 4.0.0
   */
  public readonly parentId: number;

  /**
   * The parameter parsers of this constructor.
   * @since 1.0.0
   */
  public readonly parameters: ParameterParser[];

  public constructor(data: ClassConstructorParser.Data) {
    super(data);

    const { comment, parentId, parameters } = data;

    this.comment = comment;
    this.parentId = parentId;
    this.parameters = parameters;
  }

  /**
   * Converts this parser to a Json compatible format.
   * @since 1.0.0
   * @returns The Json compatible format of this parser.
   */
  public toJSON(): ClassConstructorParser.Json {
    return {
      ...super.toJSON(),
      comment: this.comment.toJSON(),
      parentId: this.parentId,
      parameters: this.parameters.map((parameter) => parameter.toJSON())
    };
  }

  /**
   * Generates a new {@link ClassConstructorParser} instance from the given data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @returns The generated parser.
   */
  public static generateFromTypeDoc(reflection: JSONOutput.DeclarationReflection, parentId: number): ClassConstructorParser {
    const { kind, kindString = 'Unknown', id, name, comment = { summary: [] }, sources = [], signatures = [] } = reflection;

    if (kind !== ReflectionKind.Constructor) {
      throw new Error(`Expected Constructor (${ReflectionKind.Constructor}), but received ${kindString} (${kind})`);
    }

    const signature = signatures.find((signature) => signature.kind === ReflectionKind.ConstructorSignature);

    if (signature === undefined) throw new Error(`Expected Constructor (${ReflectionKind.Constructor}) with a signature, but there was none`);

    const { parameters = [] } = signature;

    return new ClassConstructorParser({
      id,
      name,
      comment: CommentParser.generateFromTypeDoc(comment),
      source: sources.length ? SourceParser.generateFromTypeDoc(sources[0]) : null,
      parentId,
      parameters: parameters.map((parameter) => ParameterParser.generateFromTypeDoc(parameter))
    });
  }

  /**
   * Generates a new {@link ClassConstructorParser} instance from the given data.
   * @param json The json to generate the parser from.
   * @returns The generated parser.
   */
  public static generateFromJson(json: ClassConstructorParser.Json): ClassConstructorParser {
    const { id, name, comment, source, parentId, parameters } = json;

    return new ClassConstructorParser({
      id,
      name,
      comment: CommentParser.generateFromJson(comment),
      source: source ? SourceParser.generateFromJson(source) : null,
      parentId,
      parameters: parameters.map((parameter) => ParameterParser.generateFromJson(parameter))
    });
  }
}

export namespace ClassConstructorParser {
  export interface Data extends Parser.Data {
    /**
     * The comment parser of this constructor.
     * @since 1.0.0
     */
    comment: CommentParser;

    /**
     * The id of the parent class parser.
     * @since 4.0.0
     */
    parentId: number;

    /**
     * The parameter parsers of this constructor.
     * @since 1.0.0
     */
    parameters: ParameterParser[];
  }

  export interface Json extends Parser.Json {
    /**
     * The comment parser of this constructor.
     * @since 1.0.0
     */
    comment: CommentParser.Data;

    /**
     * The id of the parent class parser.
     * @since 4.0.0
     */
    parentId: number;

    /**
     * The parameter parsers of this constructor.
     * @since 1.0.0
     */
    parameters: ParameterParser.Json[];
  }
}
