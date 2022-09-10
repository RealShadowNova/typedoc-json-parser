import { TypeParser } from './TypeParser';

/**
 * Parses data for a type operator type.
 * @since 1.0.0
 */
export class TypeOperatorTypeParser implements TypeParser {
  /**
   * The kind of type this parser is for.
   * @since 1.0.0
   */
  public readonly kind = TypeParser.Kind.TypeOperator;

  /**
   * The operator of this type operator type.
   * @since 1.0.0
   */
  public readonly operator: TypeOperatorTypeParser.Operator;

  /**
   * The type of this type operator type.
   * @since 1.0.0
   */
  public readonly type: TypeParser;

  public constructor(operator: TypeOperatorTypeParser.Operator, type: TypeParser) {
    this.operator = operator;
    this.type = type;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): TypeOperatorTypeParser.JSON {
    return {
      kind: this.kind,
      operator: this.operator,
      type: this.type.toJSON()
    };
  }

  /**
   * Converts this parser to a string.
   * @since 1.0.0
   * @returns The string representation of this parser.
   */
  public toString(): string {
    return TypeOperatorTypeParser.formatToString(this);
  }

  /**
   * Formats this type parser to a string.
   * @since 3.3.0
   * @param parser The parser to format.
   * @returns The string representation of this parser.
   */
  public static formatToString(parser: TypeOperatorTypeParser): string {
    return `${parser.operator} ${parser.type.toString()}`;
  }
}

export namespace TypeOperatorTypeParser {
  export interface JSON extends TypeParser.JSON {
    kind: TypeParser.Kind.TypeOperator;

    /**
     * The operator of this type operator type.
     * @since 1.0.0
     */
    operator: Operator;

    /**
     * The type of this type operator type in a JSON compatible format.
     * @since 1.0.0
     */
    type: TypeParser.JSON;
  }

  /**
   * The operators of a type operator type.
   */
  export enum Operator {
    KeyOf = 'keyof',

    Unique = 'unique',

    Readonly = 'readonly'
  }
}
