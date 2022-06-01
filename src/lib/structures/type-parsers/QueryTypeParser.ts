import type { ReferenceTypeParser } from './ReferenceTypeParser';
import { TypeParser } from './TypeParser';

/**
 * Parses data for a query type.
 * @since 1.0.0
 */
export class QueryTypeParser implements TypeParser {
  /**
   * The kind of type this parser is for.
   * @since 1.0.0
   */
  public readonly kind = TypeParser.Kind.Query;

  /**
   * The query of this query type.
   * @since 1.0.0
   */
  public readonly query: ReferenceTypeParser;

  public constructor(query: ReferenceTypeParser) {
    this.query = query;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): QueryTypeParser.JSON {
    return {
      kind: this.kind,
      query: this.query.toJSON()
    };
  }

  /**
   * Converts this parser to a string.
   * @since 1.0.0
   * @returns The string representation of this parser.
   */
  public toString(): string {
    return `typeof ${this.query.toString()}`;
  }
}

export namespace QueryTypeParser {
  export interface JSON extends TypeParser.JSON {
    kind: TypeParser.Kind.Query;

    /**
     * The query of this query type.
     * @since 1.0.0
     */
    query: ReferenceTypeParser.JSON;
  }
}
