import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { CommentParser, SourceParser } from '../misc';
import { Parser } from '../Parser';
import type { ProjectParser } from '../ProjectParser';
import { InterfacePropertyParser } from './InterfacePropertyParser';

/**
 * Parses data from an interface reflection.
 * @since 1.0.0
 */
export class InterfaceParser extends Parser {
  /**
   * Whether this interface is external.
   * @since 1.0.0
   */
  public readonly external: boolean;

  /**
   * The property parsers of this interface.
   * @since 1.0.0
   */
  public readonly properties: InterfacePropertyParser[];

  public constructor(data: InterfaceParser.Data, project: ProjectParser) {
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
  public toJSON(): InterfaceParser.JSON {
    return {
      ...super.toJSON(),
      external: this.external,
      properties: this.properties.map((parser) => parser.toJSON())
    };
  }

  /**
   * Generates a new {@link InterfaceParser} instance from the given data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @param project The project this parser belongs to.
   * @returns The generated parser.
   */
  public static generate(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): InterfaceParser {
    const { kind, kindString = 'Unknown', id, name, comment = {}, sources = [], flags, children = [] } = reflection;

    if (kind !== ReflectionKind.Interface) throw new Error(`Expected Interface (${ReflectionKind.Interface}), but received ${kindString} (${kind})`);

    const properties = children
      .filter((child) => child.kind === ReflectionKind.Property)
      .map((child) => InterfacePropertyParser.generate(child, project));

    return new InterfaceParser(
      {
        id,
        name,
        comment: CommentParser.generate(comment, project),
        source: sources.length ? SourceParser.generate(sources[0], project) : null,
        external: Boolean(flags.isExternal),
        properties
      },
      project
    );
  }
}

export namespace InterfaceParser {
  export interface Data extends Parser.Data {
    /**
     * Whether this interface is external.
     * @since 1.0.0
     */
    external: boolean;

    /**
     * The property parsers of this interface.
     * @since 1.0.0
     */
    properties: InterfacePropertyParser[];
  }

  export interface JSON extends Parser.JSON {
    /**
     * Whether this interface is external.
     * @since 1.0.0
     */
    external: boolean;

    /**
     * The property parsers of this interface in a JSON compatible format.
     * @since 1.0.0
     */
    properties: InterfacePropertyParser.JSON[];
  }
}
