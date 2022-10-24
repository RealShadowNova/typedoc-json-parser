import type { SourceParser } from './misc';

/**
 * The base parser for all top level exported parsers.
 * @since 1.0.0
 */
export abstract class Parser {
  /**
   * The identifier of this parser.
   * @since 1.0.0
   */
  public readonly id: number;

  /**
   * The name of this parser.
   * @since 1.0.0
   */
  public readonly name: string;

  /**
   * The source parser for this parser.
   * @since 1.0.0
   */
  public readonly source: SourceParser | null;

  public constructor(data: Parser.Data) {
    const { id, name, source } = data;

    this.id = id;
    this.name = name;
    this.source = source;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): Parser.JSON {
    return {
      id: this.id,
      name: this.name,
      source: this.source ? this.source.toJSON() : null
    };
  }
}

export namespace Parser {
  export interface Data {
    /**
     * The identifier for this parser.
     * @since 1.0.0
     */
    id: number;

    /**
     * The name for this parser.
     * @since 1.0.0
     */
    name: string;

    /**
     * The source parser for this parser.
     * @since 1.0.0
     */
    source: SourceParser | null;
  }

  export interface JSON {
    /**
     * The identifier for this parser.
     * @since 1.0.0
     */
    id: number;

    /**
     * The name for this parser.
     * @since 1.0.0
     */
    name: string;

    /**
     * The source parser for this parser in a JSON compatible format.
     * @since 1.0.0
     */
    source: SourceParser.JSON | null;
  }
}
