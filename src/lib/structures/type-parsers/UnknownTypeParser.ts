import { TypeParser } from './TypeParser';

/**
 * Parses data for an unknown type.
 * @since 1.0.0
 */
export class UnknownTypeParser implements TypeParser {
  /**
   * The kind of type this parser is for.
   * @since 1.0.0
   */
  public readonly kind = TypeParser.Kind.Unknown;

  /**
   * The name of this unknown type.
   * @since 1.0.0
   */
  public readonly name: string;

  public constructor(data: UnknownTypeParser.Data) {
    const { name } = data;

    this.name = name;
  }

  /**
   * Converts this parser to a Json compatible format.
   * @since 1.0.0
   * @returns The Json compatible format of this parser.
   */
  public toJSON(): UnknownTypeParser.Json {
    return {
      kind: this.kind,
      name: this.name
    };
  }

  /**
   * Converts this parser to a string.
   * @since 1.0.0
   * @returns The string representation of this parser.
   */
  public toString(): string {
    return UnknownTypeParser.formatToString(this);
  }

  /**
   * Formats this type parser to a string.
   * @since 4.0.0
   * @param parser The parser to format.
   * @returns The string representation of this parser.
   */
  public static formatToString(parser: UnknownTypeParser): string {
    return parser.name;
  }
}

export namespace UnknownTypeParser {
  export interface Data {
    /**
     * The name of this unknown type.
     * @since 5.0.0
     */
    name: string;
  }

  export interface Json extends TypeParser.Json {
    kind: TypeParser.Kind.Unknown;

    /**
     * The name of this unknown type.
     * @since 1.0.0
     */
    name: string;
  }
}
