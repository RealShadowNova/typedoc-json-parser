import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { CommentParser, ParameterParser, SourceParser } from '../misc';
import { Parser } from '../Parser';
import type { ProjectParser } from '../ProjectParser';
import type { ClassParser } from './ClassParser';

export class ClassConstructorParser extends Parser {
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

  public constructor(data: ClassConstructorParser.Data, project: ProjectParser) {
    super(data, project);

    const { parentId, parameters } = data;

    this.parentId = parentId;
    this.parameters = parameters;
  }

  /**
   * The parent class parser.
   * @since 4.0.0
   */
  public get parent(): ClassParser {
    return this.project.find(this.parentId) as ClassParser;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): ClassConstructorParser.JSON {
    return {
      ...super.toJSON(),
      parentId: this.parentId,
      parameters: this.parameters.map((parameter) => parameter.toJSON())
    };
  }

  /**
   * Generates a new {@link ClassConstructorParser} instance from the given data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @param project The project to generate the parser from.
   * @returns The generated parser.
   */
  public static generateFromTypeDoc(reflection: JSONOutput.DeclarationReflection, parentId: number, project: ProjectParser): ClassConstructorParser {
    const { kind, kindString = 'Unknown', id, name, comment = { summary: [] }, sources = [], signatures = [] } = reflection;

    if (kind !== ReflectionKind.Constructor) {
      throw new Error(`Expected Constructor (${ReflectionKind.Constructor}), but received ${kindString} (${kind})`);
    }

    const signature = signatures.find((signature) => signature.kind === ReflectionKind.ConstructorSignature);

    if (signature === undefined) throw new Error(`Expected Constructor (${ReflectionKind.Constructor}) with a signature, but there was none`);

    const { parameters = [] } = signature;

    return new ClassConstructorParser(
      {
        id,
        name,
        comment: CommentParser.generateFromTypeDoc(comment, project),
        source: sources.length ? SourceParser.generateFromTypeDoc(sources[0], project) : null,
        parentId,
        parameters: parameters.map((parameter) => ParameterParser.generateFromTypeDoc(parameter, project))
      },
      project
    );
  }

  public static generateFromJSON(data: ClassConstructorParser.JSON, project: ProjectParser): ClassConstructorParser {
    const { id, name, comment, source, parentId, parameters } = data;

    return new ClassConstructorParser(
      {
        id,
        name,
        comment: CommentParser.generateFromJSON(comment, project),
        source: source ? SourceParser.generateFromJSON(source, project) : null,
        parentId,
        parameters: parameters.map((parameter) => ParameterParser.generateFromJSON(parameter, project))
      },
      project
    );
  }
}

export namespace ClassConstructorParser {
  export interface Data extends Parser.Data {
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

  export interface JSON extends Parser.JSON {
    /**
     * The id of the parent class parser.
     * @since 4.0.0
     */
    parentId: number;

    /**
     * The parameter parsers of this constructor.
     * @since 1.0.0
     */
    parameters: ParameterParser.JSON[];
  }
}
