import { TypeParser } from './TypeParser';

/**
 * Parses data for an indexed access type.
 * @since 1.0.0
 */
export class IndexedAccessTypeParser implements TypeParser {
  /**
   * The kind of type this parser is for.
   * @since 1.0.0
   */
  public readonly kind = TypeParser.Kind.IndexedAccess;

  /**
   * The object type of this indexed access type.
   * @since 1.0.0
   */
  public readonly objectType: TypeParser;

  /**
   * The index type of this indexed access type.
   * @since 1.0.0
   */
  public readonly indexType: TypeParser;

  public constructor(objectType: TypeParser, indexType: TypeParser) {
    this.objectType = objectType;
    this.indexType = indexType;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): IndexedAccessTypeParser.JSON {
    return {
      kind: this.kind,
      objectType: this.objectType.toJSON(),
      indexType: this.indexType.toJSON()
    };
  }

  /**
   * Converts this parser to a string.
   * @since 1.0.0
   * @returns The string representation of this parser.
   */
  public toString(): string {
    return IndexedAccessTypeParser.formatToString(this);
  }

  /**
   * Formats this type parser to a string.
   * @since 3.3.0
   * @param parser The parser to format.
   * @returns The string representation of this parser.
   */
  public static formatToString = (parser: IndexedAccessTypeParser): string => {
    return `${parser.objectType.toString()}[${parser.indexType.toString()}]`;
  };
}

export namespace IndexedAccessTypeParser {
  export interface JSON extends TypeParser.JSON {
    kind: TypeParser.Kind.IndexedAccess;

    /**
     * The object type of this indexed access type in a JSON compatible format.
     * @since 1.0.0
     */
    objectType: TypeParser.JSON;

    /**
     * The index type of this indexed access type in a JSON compatible format.
     * @since 1.0.0
     */
    indexType: TypeParser.JSON;
  }
}
