import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../types';
import { CommentParser, SourceParser } from './misc';
import { Parser } from './Parser';
import type { ProjectParser } from './ProjectParser';
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

  public constructor(data: VariableParser.Data, project: ProjectParser) {
    super(data, project);

    const { comment, external, type, value } = data;

    this.comment = comment;
    this.external = external;
    this.type = type;
    this.value = value;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): VariableParser.JSON {
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
   * @param project The project this parser belongs to.
   * @returns The generated parser.
   */
  public static generateFromTypeDoc(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): VariableParser {
    const { kind, kindString = 'Unknown', id, name, comment = { summary: [] }, sources = [], flags, type, defaultValue } = reflection;

    if (kind !== ReflectionKind.Variable) throw new Error(`Expected Variable (${ReflectionKind.Variable}), but received ${kindString} (${kind})`);

    return new VariableParser(
      {
        id,
        name,
        comment: CommentParser.generateFromTypeDoc(comment, project),
        source: sources.length ? SourceParser.generateFromTypeDoc(sources[0], project) : null,
        external: Boolean(flags.isExternal),
        type: TypeParser.generateFromTypeDoc(type!, project),
        value: defaultValue!
      },
      project
    );
  }

  public static generateFromJSON(json: VariableParser.JSON, project: ProjectParser): VariableParser {
    const { id, name, comment, source, external, type, value } = json;

    return new VariableParser(
      {
        id,
        name,
        comment: CommentParser.generateFromJSON(comment, project),
        source: source ? SourceParser.generateFromJSON(source, project) : null,
        external,
        type: TypeParser.generateFromJSON(type, project),
        value
      },
      project
    );
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

  export interface JSON extends Parser.JSON {
    /**
     * The comment parser of this constant.
     * @since 1.0.0
     */
    comment: CommentParser.JSON;

    /**
     * Whether this variable is external.
     * @since 1.0.0
     */
    external: boolean;

    /**
     * The type of this variable in a JSON compatible format.
     * @since 1.0.0
     */
    type: TypeParser.JSON;

    /**
     * The value of this variable.
     * @since 1.0.0
     */
    value: string;
  }
}
