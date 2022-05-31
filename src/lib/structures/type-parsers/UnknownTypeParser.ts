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

  public constructor(name: string) {
    this.name = name;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): UnknownTypeParser.JSON {
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
    return this.name;
  }
}

export namespace UnknownTypeParser {
  export interface JSON extends TypeParser.JSON {
    /**
     * The name of this unknown type.
     * @since 1.0.0
     */
    name: string;
  }
}
