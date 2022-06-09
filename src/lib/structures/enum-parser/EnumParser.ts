import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { CommentParser, SourceParser } from '../misc';
import { Parser } from '../Parser';
import type { ProjectParser } from '../ProjectParser';
import { EnumPropertyParser } from './EnumPropertyParser';

/**
 * Parses data from an enum reflection.
 * @since 1.0.0
 */
export class EnumParser extends Parser {
  /**
   * Whether this enum is external.
   * @since 1.0.0
   */
  public readonly external: boolean;

  /**
   * The property parsers of this enum.
   * @since 1.0.0
   */
  public readonly properties: EnumPropertyParser[];

  public constructor(data: EnumParser.Data, project: ProjectParser) {
    super(data, project);

    const { external, properties } = data;

    this.external = external;
    this.properties = properties;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): EnumParser.JSON {
    return {
      ...super.toJSON(),
      external: this.external,
      properties: this.properties
    };
  }

  /**
   * Generates a new {@link EnumParser} instance from the given JSON data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @param project The project this parser belongs to.
   * @returns The generated parser.
   */
  public static generateFromTypeDoc(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): EnumParser {
    const { kind, kindString = 'Unknown', id, name, comment = {}, sources = [], flags, children = [] } = reflection;

    if (kind !== ReflectionKind.Enum) throw new Error(`Expected Enum (${ReflectionKind.Enum}), but received ${kindString} (${kind})`);

    const properties = children
      .filter((child) => child.kind === ReflectionKind.EnumMember)
      .map((child) => EnumPropertyParser.generateFromTypeDoc(child, project));

    return new EnumParser(
      {
        id,
        name,
        comment: CommentParser.generateFromTypeDoc(comment, project),
        source: sources.length ? SourceParser.generateFromTypeDoc(sources[0], project) : null,
        external: Boolean(flags.isExternal),
        properties
      },
      project
    );
  }

  public static generateFromJSON(json: EnumParser.JSON, project: ProjectParser): EnumParser {
    const { id, name, comment, source, external, properties } = json;

    return new EnumParser(
      {
        id,
        name,
        comment: CommentParser.generateFromJSON(comment, project),
        source: source ? SourceParser.generateFromJSON(source, project) : null,
        external,
        properties: properties.map((property) => EnumPropertyParser.generateFromJSON(property, project))
      },
      project
    );
  }
}

export namespace EnumParser {
  export interface Data extends Parser.Data {
    /**
     * Whether this enum is external.
     * @since 1.0.0
     */
    external: boolean;

    /**
     * The property parsers of this enum.
     * @since 1.0.0
     */
    properties: EnumPropertyParser[];
  }

  export interface JSON extends Parser.JSON {
    /**
     * Whether this enum is external.
     * @since 1.0.0
     */
    external: boolean;

    /**
     * The property parsers of this enum in a JSON compatible format.
     */
    properties: EnumPropertyParser.JSON[];
  }
}
