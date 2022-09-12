import { TypeParser } from './TypeParser';

/**
 * Parses data for an inferred type.
 * @since 1.0.0
 */
export class InferredTypeParser implements TypeParser {
  /**
   * The kind of type this parser is for.
   * @since 1.0.0
   */
  public readonly kind = TypeParser.Kind.Inferred;

  /**
   * The type of this inferred type.
   * @since 1.0.0
   */
  public readonly type: string;

  public constructor(type: string) {
    this.type = type;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): InferredTypeParser.JSON {
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
    return InferredTypeParser.formatToString(this);
  }

  /**
   * Formats this type parser to a string.
   * @since 3.3.0
   * @param parser The parser to format.
   * @returns The string representation of this parser.
   */
  public static formatToString = (parser: InferredTypeParser): string => {
    return `infer ${parser.type}`;
  };
}

export namespace InferredTypeParser {
  export interface JSON extends TypeParser.JSON {
    kind: TypeParser.Kind.Inferred;

    /**
     * The type of this inferred type.
     * @since 1.0.0
     */
    type: string;
  }
}
