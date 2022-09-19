import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import type { ProjectParser } from '../ProjectParser';
import { TypeParser } from '../type-parsers';

/**
 * Parses data from a type parameter reflection.
 * @since 1.0.0
 */
export class TypeParameterParser {
  /**
   * The project this parser belongs to.
   * @since 1.0.0
   */
  public readonly project: ProjectParser;

  /**
   * The identifier of this parser.
   * @since 1.0.0
   */
  public readonly id: number;

  /**
   * The name of this type parameter.
   * @since 1.0.0
   */
  public readonly name: string;

  /**
   * The type of this type parameter.
   * @since 1.0.0
   */
  public readonly type: TypeParser | null;

  /**
   * The default value of this type parameter.
   * @since 1.0.0
   */
  public readonly default: TypeParser | null;

  public constructor(data: TypeParameterParser.Data, project: ProjectParser) {
    const { id, name, type, default: defaultValue } = data;

    this.id = id;
    this.name = name;
    this.type = type;
    this.default = defaultValue;

    this.project = project;
  }

  /**
   * Converts this type parameter to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this type parameter.
   */
  public toJSON(): TypeParameterParser.JSON {
    return {
      id: this.id,
      name: this.name,
      type: this.type ? this.type.toJSON() : null,
      default: this.default ? this.default.toJSON() : null
    };
  }

  /**
   * Generates a new {@link TypeParameterParser} instance from the given data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @param project The project this parser belongs to.
   * @returns The generated parser.
   */
  public static generateFromTypeDoc(reflection: JSONOutput.TypeParameterReflection, project: ProjectParser): TypeParameterParser {
    const { kind, kindString = 'Unknown', id, name, type, default: _default } = reflection;

    if (kind !== ReflectionKind.TypeParameter) {
      throw new Error(`Expected TypeParameter (${ReflectionKind.TypeParameter}), but received ${kindString} (${kind})`);
    }

    return new TypeParameterParser(
      {
        id,
        name,
        type: type ? TypeParser.generateFromTypeDoc(type, project) : null,
        default: _default ? TypeParser.generateFromTypeDoc(_default, project) : null
      },
      project
    );
  }

  public static generateFromJSON(json: TypeParameterParser.JSON, project: ProjectParser): TypeParameterParser {
    const { id, name, type, default: _default } = json;

    return new TypeParameterParser(
      {
        id,
        name,
        type: type ? TypeParser.generateFromJSON(type, project) : null,
        default: _default ? TypeParser.generateFromJSON(_default, project) : null
      },
      project
    );
  }
}

export namespace TypeParameterParser {
  export interface Data {
    /**
     * The identifier of this parser.
     * @since 1.0.0
     */
    id: number;

    /**
     * The name of this type parameter.
     * @since 1.0.0
     */
    name: string;

    /**
     * The type of this type parameter.
     * @since 1.0.0
     */
    type: TypeParser | null;

    /**
     * The default value of this type parameter.
     * @since 1.0.0
     */
    default: TypeParser | null;
  }

  export interface JSON {
    /**
     * The identifier of this parser.
     * @since 1.0.0
     */
    id: number;

    /**
     * The name of this type parameter.
     * @since 1.0.0
     */
    name: string;

    /**
     * The type of this type parameter in a JSON compatible format.
     * @since 1.0.0
     */
    type: TypeParser.JSON | null;

    /**
     * The default value of this type parameter in a JSON compatible format.
     * @since 1.0.0
     */
    default: TypeParser.JSON | null;
  }
}
