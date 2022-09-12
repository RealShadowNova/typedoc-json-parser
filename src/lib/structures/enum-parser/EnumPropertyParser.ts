import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { CommentParser, SourceParser } from '../misc';
import { Parser } from '../Parser';
import type { ProjectParser } from '../ProjectParser';
import { TypeParser } from '../type-parsers';
import type { EnumParser } from './EnumParser';

/**
 * Parses data from an enum property reflection.
 * @since 1.0.0
 */
export class EnumPropertyParser extends Parser {
  /**
   * The id of the parent enum parser.
   * @since 4.0.0
   */
  public readonly parentId: number;

  /**
   * The value of this enum property.
   * @since 1.0.0
   */
  public readonly value: string;

  public constructor(data: EnumPropertyParser.Data, project: ProjectParser) {
    super(data, project);

    const { parentId, value } = data;

    this.parentId = parentId;
    this.value = value;
  }

  public get parent(): EnumParser {
    return this.project.find(this.parentId) as EnumParser;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): EnumPropertyParser.JSON {
    return {
      ...super.toJSON(),
      parentId: this.parentId,
      value: this.value
    };
  }

  /**
   * Converts this parser to a string representation.
   * @since 4.0.0
   * @returns The string representation of this parser.
   */
  public toString(): string {
    return EnumPropertyParser.formatMessage(this);
  }

  /**
   * Formats this type parser to a string.
   * @since 4.0.0
   * @param parser The parser to format.
   * @returns The string representation of this parser.
   */
  public static formatMessage = (parser: EnumPropertyParser): string => {
    return `${parser.name} = ${parser.value}`;
  };

  /**
   * Generates a new {@link EnumPropertyParser} instance from the given data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @param project The project this parser belongs to.
   * @returns The generated parser.
   */
  public static generateFromTypeDoc(reflection: JSONOutput.DeclarationReflection, parentId: number, project: ProjectParser): EnumPropertyParser {
    const { kind, kindString = 'Unknown', id, name, comment = { summary: [] }, sources = [], type } = reflection;

    if (kind !== ReflectionKind.EnumMember) {
      throw new Error(`Expected EnumMember (${ReflectionKind.EnumMember}), but received ${kindString} (${kind})`);
    }

    return new EnumPropertyParser(
      {
        id,
        name,
        comment: CommentParser.generateFromTypeDoc(comment, project),
        source: sources.length ? SourceParser.generateFromTypeDoc(sources[0], project) : null,
        parentId,
        value: TypeParser.generateFromTypeDoc(type!).toString()
      },
      project
    );
  }

  public static generateFromJSON(json: EnumPropertyParser.JSON, project: ProjectParser): EnumPropertyParser {
    const { id, name, comment, source, parentId, value } = json;

    return new EnumPropertyParser(
      {
        id,
        name,
        comment: CommentParser.generateFromJSON(comment, project),
        source: source ? SourceParser.generateFromJSON(source, project) : null,
        parentId,
        value
      },
      project
    );
  }
}

export namespace EnumPropertyParser {
  export interface Data extends Parser.Data {
    /**
     * The id of the parent enum parser.
     * @since 4.0.0
     */
    parentId: number;

    /**
     * The value of this enum property.
     * @since 1.0.0
     */
    value: string;
  }

  export interface JSON extends Parser.JSON {
    /**
     * The id of the parent enum parser.
     * @since 4.0.0
     */
    parentId: number;

    /**
     * The value of this enum property.
     * @since 1.0.0
     */
    value: string;
  }
}
