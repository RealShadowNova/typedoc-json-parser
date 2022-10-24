import { TypeParser } from './TypeParser';

/**
 * Parses data for a union type.
 * @since 1.0.0
 */
export class UnionTypeParser implements TypeParser {
  /**
   * The kind of type this parser is for.
   * @since 1.0.0
   */
  public readonly kind = TypeParser.Kind.Union;

  /**
   * The types of this union type.
   * @since 1.0.0
   */
  public readonly types: TypeParser[];

  public constructor(data: UnionTypeParser.Data) {
    const { types } = data;

    this.types = types;
  }

  /**
   * Converts this parser to a Json compatible format.
   * @since 1.0.0
   * @returns The Json compatible format of this parser.
   */
  public toJSON(): UnionTypeParser.Json {
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
    return UnionTypeParser.formatToString(this);
  }

  /**
   * Formats this type parser to a string.
   * @since 4.0.0
   * @param parser The parser to format.
   * @returns The string representation of this parser.
   */
  public static formatToString(parser: UnionTypeParser): string {
    return parser.types.map((type) => TypeParser.wrap(type, TypeParser.BindingPowers[TypeParser.Kind.Union])).join(' | ');
  }
}

export namespace UnionTypeParser {
  export interface Data {
    /**
     * The types of this union type in a Json compatible format.
     * @since 5.0.0
     */
    types: TypeParser[];
  }

  export interface Json extends TypeParser.Json {
    kind: TypeParser.Kind.Union;

    /**
     * The types of this union type in a Json compatible format.
     * @since 1.0.0
     */
    types: TypeParser.Json[];
  }
}
