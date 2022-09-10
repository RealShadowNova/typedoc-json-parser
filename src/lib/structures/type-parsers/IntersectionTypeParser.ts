import { TypeParser } from './TypeParser';

/**
 * Parses data for an intersection type.
 * @since 1.0.0
 */
export class IntersectionTypeParser implements TypeParser {
  /**
   * The kind of type this parser is for.
   * @since 1.0.0
   */
  public readonly kind = TypeParser.Kind.Intersection;

  /**
   * The types of this intersection type.
   * @since 1.0.0
   */
  public readonly types: TypeParser[];

  public constructor(types: TypeParser[]) {
    this.types = types;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): IntersectionTypeParser.JSON {
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
    return IntersectionTypeParser.formatToString(this);
  }

  /**
   * Formats this type parser to a string.
   * @since 3.3.0
   * @param parser The parser to format.
   * @returns The string representation of this parser.
   */
  public static formatToString(parser: IntersectionTypeParser): string {
    return parser.types.map((type) => TypeParser.wrap(type, TypeParser.BindingPowers[TypeParser.Kind.Intersection])).join(' & ');
  }
}

export namespace IntersectionTypeParser {
  export interface JSON extends TypeParser.JSON {
    kind: TypeParser.Kind.Intersection;

    /**
     * The types of this intersection type in a JSON compatible format.
     * @since 1.0.0
     */
    types: TypeParser.JSON[];
  }
}
