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

  public constructor(data: IndexedAccessTypeParser.Data) {
    const { objectType, indexType } = data;

    this.objectType = objectType;
    this.indexType = indexType;
  }

  /**
   * Converts this parser to a Json compatible format.
   * @since 1.0.0
   * @returns The Json compatible format of this parser.
   */
  public toJSON(): IndexedAccessTypeParser.Json {
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
   * @since 4.0.0
   * @param parser The parser to format.
   * @returns The string representation of this parser.
   */
  public static formatToString(parser: IndexedAccessTypeParser): string {
    return `${parser.objectType.toString()}[${parser.indexType.toString()}]`;
  }
}

export namespace IndexedAccessTypeParser {
  export interface Data {
    /**
     * The object type of this indexed access type.
     * @since 5.0.0
     */
    objectType: TypeParser;

    /**
     * The index type of this indexed access type.
     * @since 5.0.0
     */
    indexType: TypeParser;
  }

  export interface Json extends TypeParser.Json {
    kind: TypeParser.Kind.IndexedAccess;

    /**
     * The object type of this indexed access type in a Json compatible format.
     * @since 1.0.0
     */
    objectType: TypeParser.Json;

    /**
     * The index type of this indexed access type in a Json compatible format.
     * @since 1.0.0
     */
    indexType: TypeParser.Json;
  }
}
