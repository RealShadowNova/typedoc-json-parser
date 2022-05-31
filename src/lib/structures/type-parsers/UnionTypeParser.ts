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

  public constructor(types: TypeParser[]) {
    this.types = types;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): UnionTypeParser.JSON {
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
    return this.types.map((type) => TypeParser.wrap(type, TypeParser.BindingPowers[TypeParser.Kind.Union])).join(' | ');
  }
}

export namespace UnionTypeParser {
  export interface JSON extends TypeParser.JSON {
    /**
     * The types of this union type in a JSON compatible format.
     * @since 1.0.0
     */
    types: TypeParser.JSON[];
  }
}
