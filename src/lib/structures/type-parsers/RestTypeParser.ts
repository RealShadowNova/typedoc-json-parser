import { TypeParser } from './TypeParser';

/**
 * Parses data for a rest type.
 * @since 1.0.0
 */
export class RestTypeParser implements TypeParser {
  /**
   * The kind of type this parser is for.
   * @since 1.0.0
   */
  public readonly kind = TypeParser.Kind.Rest;

  /**
   * The type of this rest type.
   * @since 1.0.0
   */
  public readonly type: TypeParser;

  public constructor(type: TypeParser) {
    this.type = type;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): RestTypeParser.JSON {
    return {
      kind: this.kind,
      type: this.type.toJSON()
    };
  }

  /**
   * Converts this parser to a string.
   * @since 1.0.0
   * @returns The string representation of this parser.
   */
  public toString(): string {
    return `...${TypeParser.wrap(this.type, TypeParser.BindingPowers[TypeParser.Kind.Rest])}`;
  }
}

export namespace RestTypeParser {
  export interface JSON extends TypeParser.JSON {
    /**
     * The type of this rest type in a JSON compatible format.
     * @since 1.0.0
     */
    type: TypeParser.JSON;
  }
}
