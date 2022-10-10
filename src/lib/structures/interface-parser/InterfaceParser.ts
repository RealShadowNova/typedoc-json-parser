import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { CommentParser, SourceParser } from '../misc';
import { Parser } from '../Parser';
import type { ProjectParser } from '../ProjectParser';
import { InterfaceMethodParser } from './InterfaceMethodParser';
import { InterfacePropertyParser } from './InterfacePropertyParser';

/**
 * Parses data from an interface reflection.
 * @since 1.0.0
 */
export class InterfaceParser extends Parser {
  /**
   * The comment parser of this interface.
   * @since 1.0.0
   */
  public readonly comment: CommentParser;

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

  /**
   * The method parsers of this interface.
   * @since 3.1.0
   */
  public readonly methods: InterfaceMethodParser[];

  public constructor(data: InterfaceParser.Data, project: ProjectParser) {
    super(data, project);

    const { comment, external, properties, methods } = data;

    this.comment = comment;
    this.external = external;
    this.properties = properties;
    this.methods = methods;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): InterfaceParser.JSON {
    return {
      ...super.toJSON(),
      comment: this.comment.toJSON(),
      external: this.external,
      properties: this.properties.map((parser) => parser.toJSON()),
      methods: this.methods.map((parser) => parser.toJSON())
    };
  }

  /**
   * Generates a new {@link InterfaceParser} instance from the given data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @param project The project this parser belongs to.
   * @returns The generated parser.
   */
  public static generateFromTypeDoc(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): InterfaceParser {
    const { kind, kindString = 'Unknown', id, name, comment = { summary: [] }, sources = [], flags, children = [] } = reflection;

    if (kind !== ReflectionKind.Interface) throw new Error(`Expected Interface (${ReflectionKind.Interface}), but received ${kindString} (${kind})`);

    const properties = children
      .filter((child) => child.kind === ReflectionKind.Property)
      .map((child) => InterfacePropertyParser.generateFromTypeDoc(child, id, project));

    const methods = children
      .filter((child) => child.kind === ReflectionKind.Method)
      .map((child) => InterfaceMethodParser.generateFromTypeDoc(child, id, project));

    return new InterfaceParser(
      {
        id,
        name,
        comment: CommentParser.generateFromTypeDoc(comment, project),
        source: sources.length ? SourceParser.generateFromTypeDoc(sources[0], project) : null,
        external: Boolean(flags.isExternal),
        properties,
        methods
      },
      project
    );
  }

  public static generateFromJSON(json: InterfaceParser.JSON, project: ProjectParser): InterfaceParser {
    const { id, name, comment, source, external, properties, methods } = json;

    return new InterfaceParser(
      {
        id,
        name,
        comment: CommentParser.generateFromJSON(comment, project),
        source: source ? SourceParser.generateFromJSON(source, project) : null,
        external,
        properties: properties.map((parser) => InterfacePropertyParser.generateFromJSON(parser, project)),
        methods: methods.map((parser) => InterfaceMethodParser.generateFromJSON(parser, project))
      },
      project
    );
  }
}

export namespace InterfaceParser {
  export interface Data extends Parser.Data {
    /**
     * The comment parser of this interface.
     * @since 1.0.0
     */
    comment: CommentParser;

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

    /**
     * The method parsers of this interface.
     * @since 3.1.0
     */
    methods: InterfaceMethodParser[];
  }

  export interface JSON extends Parser.JSON {
    /**
     * The comment parser of this interface.
     * @since 1.0.0
     */
    comment: CommentParser.JSON;

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

    /**
     * The method parsers of this interface in a JSON compatible format.
     * @since 3.1.0
     */
    methods: InterfaceMethodParser.JSON[];
  }
}
