import { TypeParser } from './TypeParser';

/**
 * Parses data for a tuple type.
 * @since 1.0.0
 */
export class TupleTypeParser implements TypeParser {
  /**
   * The kind of type this parser is for.
   * @since 1.0.0
   */
  public readonly kind = TypeParser.Kind.Tuple;

  /**
   * The types of this tuple type.
   * @since 1.0.0
   */
  public readonly types: TypeParser[];

  public constructor(data: TupleTypeParser.Data) {
    const { types } = data;

    this.types = types;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): TupleTypeParser.JSON {
    return {
      kind: this.kind,
      types: this.types.map((type) => type.toJSON())
    };
  }

  /**
   * Converts this parser to a string.
   * @since 1.0.0
   * @returns The string representation of this parser.
   */
  public toString(): string {
    return TupleTypeParser.formatToString(this);
  }

  /**
   * Formats this type parser to a string.
   * @since 4.0.0
   * @param parser The parser to format.
   * @returns The string representation of this parser.
   */
  public static formatToString(parser: TupleTypeParser): string {
    return `[${parser.types.map((type) => type.toString()).join(', ')}]`;
  }
}

export namespace TupleTypeParser {
  export interface Data {
    /**
     * The types of this tuple type.
     * @since 5.0.0
     */
    types: TypeParser[];
  }

  export interface JSON extends TypeParser.JSON {
    kind: TypeParser.Kind.Tuple;

    /**
     * The types of this tuple type in a JSON compatible format.
     * @since 1.0.0
     */
    types: TypeParser.JSON[];
  }
}
