import type { ProjectParser } from '../ProjectParser';
import { TypeParser } from './TypeParser';

/**
 * Parses data for an intrinsic type.
 * @since 1.0.0
 */
export class IntrinsicTypeParser implements TypeParser {
  /**
   * The project parser this parser belongs to.
   * @since 5.0.0
   */
  public readonly project: ProjectParser;

  /**
   * The kind of type this parser is for.
   * @since 1.0.0
   */
  public readonly kind = TypeParser.Kind.Intrinsic;

  /**
   * The type of this intrinsic type.
   * @since 1.0.0
   */
  public readonly type: string;

  public constructor(data: IntrinsicTypeParser.Data, project: ProjectParser) {
    const { type } = data;

    this.type = type;

    this.project = project;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): IntrinsicTypeParser.JSON {
    return {
      kind: this.kind,
      type: this.type
    };
  }

  /**
   * Converts this parser to a string.
   * @since 1.0.0
   * @returns The string representation of this parser.
   */
  public toString(): string {
    return IntrinsicTypeParser.formatToString(this);
  }

  /**
   * Formats this type parser to a string.
   * @since 4.0.0
   * @param parser The parser to format.
   * @returns The string representation of this parser.
   */
  public static formatToString(parser: IntrinsicTypeParser): string {
    return parser.type;
  }
}

export namespace IntrinsicTypeParser {
  export interface Data {
    /**
     * The type of this intrinsic type.
     * @since 5.0.0
     */
    type: string;
  }

  export interface JSON extends TypeParser.JSON {
    kind: TypeParser.Kind.Intrinsic;

    /**
     * The type of this intrinsic type.
     * @since 1.0.0
     */
    type: string;
  }
}
