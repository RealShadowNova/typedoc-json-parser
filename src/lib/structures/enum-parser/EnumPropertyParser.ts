import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { CommentParser, SourceParser } from '../misc';
import { Parser } from '../Parser';
import type { ProjectParser } from '../ProjectParser';

/**
 * Parses data from an enum property reflection.
 * @since 1.0.0
 */
export class EnumPropertyParser extends Parser {
  /**
   * The value of this enum property.
   * @since 1.0.0
   */
  public readonly value: string;

  public constructor(data: EnumPropertyParser.Data, project: ProjectParser) {
    super(data, project);

    const { value } = data;

    this.value = value;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): EnumPropertyParser.JSON {
    return {
      ...super.toJSON(),
      value: this.value
    };
  }

  /**
   * Generates a new {@link EnumPropertyParser} instance from the given data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @param project The project this parser belongs to.
   * @returns The generated parser.
   */
  public static generate(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): EnumPropertyParser {
    const { kind, kindString = 'Unknown', id, name, comment = {}, sources = [], defaultValue } = reflection;

    if (kind !== ReflectionKind.EnumMember) {
      throw new Error(`Expected EnumMember (${ReflectionKind.EnumMember}), but received ${kindString} (${kind})`);
    }

    return new EnumPropertyParser(
      {
        id,
        name,
        comment: CommentParser.generate(comment, project),
        source: sources.length ? SourceParser.generate(sources[0], project) : null,
        value: defaultValue!
      },
      project
    );
  }

  public static generateFromJSON(json: EnumPropertyParser.JSON, project: ProjectParser): EnumPropertyParser {
    const { id, name, comment, source, value } = json;

    return new EnumPropertyParser(
      {
        id,
        name,
        comment: CommentParser.generateFromJSON(comment, project),
        source: source ? SourceParser.generateFromJSON(source, project) : null,
        value
      },
      project
    );
  }
}

export namespace EnumPropertyParser {
  export interface Data extends Parser.Data {
    /**
     * The value of this enum property.
     * @since 1.0.0
     */
    value: string;
  }

  export interface JSON extends Parser.JSON {
    /**
     * The value of this enum property.
     * @since 1.0.0
     */
    value: string;
  }
}
