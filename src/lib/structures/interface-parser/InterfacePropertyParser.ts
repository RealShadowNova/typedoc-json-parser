import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { CommentParser, SourceParser } from '../misc';
import { Parser } from '../Parser';
import type { ProjectParser } from '../ProjectParser';
import { TypeParser } from '../type-parsers';
import type { InterfaceParser } from './InterfaceParser';

/**
 * Parses data from an interface property reflection.
 * @since 1.0.0
 */
export class InterfacePropertyParser extends Parser {
  /**
   * The id of the parent interface parser.
   * @since 4.0.0
   */
  public readonly parentId: number;

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

    const { parentId, readonly, type } = data;

    this.parentId = parentId;
    this.readonly = readonly;
    this.type = type;
  }

  /**
   * The parent interface parser.
   * @since 4.0.0
   */
  public get parent(): InterfaceParser {
    return this.project.find(this.parentId) as InterfaceParser;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): InterfacePropertyParser.JSON {
    return {
      ...super.toJSON(),
      parentId: this.parentId,
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
  public static generateFromTypeDoc(reflection: JSONOutput.DeclarationReflection, parentId: number, project: ProjectParser): InterfacePropertyParser {
    const { kind, kindString = 'Unknown', id, name, comment = { summary: [] }, sources = [], type, flags } = reflection;

    if (kind !== ReflectionKind.Property) throw new Error(`Expected Property (${ReflectionKind.Property}), but received ${kindString} (${kind})`);

    return new InterfacePropertyParser(
      {
        id,
        name,
        comment: CommentParser.generateFromTypeDoc(comment, project),
        source: sources.length ? SourceParser.generateFromTypeDoc(sources[0], project) : null,
        parentId,
        readonly: Boolean(flags.isReadonly),
        type: TypeParser.generateFromTypeDoc(type!)
      },
      project
    );
  }

  public static generateFromJSON(json: InterfacePropertyParser.JSON, project: ProjectParser): InterfacePropertyParser {
    const { id, name, comment, source, parentId, readonly, type } = json;

    return new InterfacePropertyParser(
      {
        id,
        name,
        comment: CommentParser.generateFromJSON(comment, project),
        source: source ? SourceParser.generateFromJSON(source, project) : null,
        parentId,
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
     * The id of the parent interface parser.
     * @since 4.0.0
     */
    parentId: number;

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
     * The id of the parent interface parser.
     * @since 4.0.0
     */
    parentId: number;

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
