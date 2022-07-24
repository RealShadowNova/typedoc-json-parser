import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { CommentParser, SourceParser } from '../misc';
import { Parser } from '../Parser';
import type { ProjectParser } from '../ProjectParser';
import { TypeParser } from '../type-parsers';

/**
 * Parses data from an interface property reflection.
 * @since 1.0.0
 */
export class InterfacePropertyParser extends Parser {
  /**
   * Whether this interface property is readonly.
   * @since 1.0.0
   */
  public readonly readonly: boolean;

  /**
   * The type of this property.
   * @since 1.0.0
   */
  public readonly type: TypeParser;

  public constructor(data: InterfacePropertyParser.Data, project: ProjectParser) {
    super(data, project);

    const { readonly, type } = data;

    this.readonly = readonly;
    this.type = type;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): InterfacePropertyParser.JSON {
    return {
      ...super.toJSON(),
      readonly: this.readonly,
      type: this.type.toJSON()
    };
  }

  /**
   * Generates a new {@link InterfacePropertyParser} instance from the given data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @param project The project this parser belongs to.
   * @returns The generated parser.
   */
  public static generateFromTypeDoc(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): InterfacePropertyParser {
    const { kind, kindString = 'Unknown', id, name, comment = { summary: [] }, sources = [], type, flags } = reflection;

    if (kind !== ReflectionKind.Property) throw new Error(`Expected Property (${ReflectionKind.Property}), but received ${kindString} (${kind})`);

    return new InterfacePropertyParser(
      {
        id,
        name,
        comment: CommentParser.generateFromTypeDoc(comment, project),
        source: sources.length ? SourceParser.generateFromTypeDoc(sources[0], project) : null,
        readonly: Boolean(flags.isReadonly),
        type: TypeParser.generateFromTypeDoc(type!)
      },
      project
    );
  }

  public static generateFromJSON(json: InterfacePropertyParser.JSON, project: ProjectParser): InterfacePropertyParser {
    const { id, name, comment, source, readonly, type } = json;

    return new InterfacePropertyParser(
      {
        id,
        name,
        comment: CommentParser.generateFromJSON(comment, project),
        source: source ? SourceParser.generateFromJSON(source, project) : null,
        readonly,
        type: TypeParser.generateFromJSON(type)
      },
      project
    );
  }
}

export namespace InterfacePropertyParser {
  export interface Data extends Parser.Data {
    /**
     * Whether this interface property is readonly.
     * @since 1.0.0
     */
    readonly: boolean;

    /**
     * The type of this property.
     * @since 1.0.0
     */
    type: TypeParser;
  }

  export interface JSON extends Parser.JSON {
    /**
     * Whether this interface property is readonly.
     * @since 1.0.0
     */
    readonly: boolean;

    /**
     * The type of this property in a JSON compatible format.
     * @since 1.0.0
     */
    type: TypeParser.JSON;
  }
}
