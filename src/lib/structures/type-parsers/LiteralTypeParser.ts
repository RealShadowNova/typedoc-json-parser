import { TypeParser } from './TypeParser';

/**
 * Parses data for a literal type.
 * @since 1.0.0
 */
export class LiteralTypeParser implements TypeParser {
  /**
   * The kind of type this parser is for.
   * @since 1.0.0
   */
  public readonly kind = TypeParser.Kind.Literal;

  /**
   * The value of this literal type.
   * @since 1.0.0
   */
  public readonly value: string;

  public constructor(value: string) {
    this.value = value;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): LiteralTypeParser.JSON {
    return {
      kind: this.kind,
      value: this.value
    };
  }

  /**
   * Converts this parser to a string.
   * @since 1.0.0
   * @returns The string representation of this parser.
   */
  public toString(): string {
    return LiteralTypeParser.formatToString(this);
  }

  /**
   * Formats this type parser to a string.
   * @since 3.3.0
   * @param parser The parser to format.
   * @returns The string representation of this parser.
   */
  public static formatToString(parser: LiteralTypeParser): string {
    return parser.value;
  }
}

export namespace LiteralTypeParser {
  export interface JSON extends TypeParser.JSON {
    kind: TypeParser.Kind.Literal;

    /**
     * The value of this literal type.
     * @since 1.0.0
     */
    value: string;
  }
}
