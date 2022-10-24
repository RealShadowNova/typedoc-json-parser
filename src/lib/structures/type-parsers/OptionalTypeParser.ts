import { TypeParser } from './TypeParser';

/**
 * Parses data for an optional type.
 * @since 1.0.0
 */
export class OptionalTypeParser implements TypeParser {
  /**
   * The kind of type this parser is for.
   * @since 1.0.0
   */
  public readonly kind = TypeParser.Kind.Optional;

  /**
   * The type of this optional type.
   * @since 1.0.0
   */
  public readonly type: TypeParser;

  public constructor(data: OptionalTypeParser.Data) {
    const { type } = data;

    this.type = type;
  }

  /**
   * Converts this parser to a Json compatible format.
   * @since 1.0.0
   * @returns The Json compatible format of this parser.
   */
  public toJSON(): OptionalTypeParser.Json {
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
    return OptionalTypeParser.formatToString(this);
  }

  /**
   * Formats this type parser to a string.
   * @since 4.0.0
   * @param parser The parser to format.
   * @returns The string representation of this parser.
   */
  public static formatToString(parser: OptionalTypeParser): string {
    return `${TypeParser.wrap(parser.type, TypeParser.BindingPowers[TypeParser.Kind.Optional])}?`;
  }
}

export namespace OptionalTypeParser {
  export interface Data {
    /**
     * The type of this optional type.
     * @since 5.0.0
     */
    type: TypeParser;
  }

  export interface Json extends TypeParser.Json {
    kind: TypeParser.Kind.Optional;

    /**
     * The type of this optional type in a Json compatible format.
     * @since 1.0.0
     */
    type: TypeParser.Json;
  }
}
