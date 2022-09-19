import type { ProjectParser } from '../ProjectParser';
import { TypeParser } from './TypeParser';

/**
 * Parses data for a type operator type.
 * @since 1.0.0
 */
export class TypeOperatorTypeParser implements TypeParser {
  /**
   * The project parser this parser belongs to.
   * @since 5.0.0
   */
  public readonly project: ProjectParser;

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

  public constructor(data: TypeOperatorTypeParser.Data, project: ProjectParser) {
    const { operator, type } = data;

    this.operator = operator;
    this.type = type;

    this.project = project;
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
   * @since 4.0.0
   * @param parser The parser to format.
   * @returns The string representation of this parser.
   */
  public static formatToString = (parser: TypeOperatorTypeParser): string => {
    return `${parser.operator} ${parser.type.toString()}`;
  };
}

export namespace TypeOperatorTypeParser {
  export interface Data {
    /**
     * The operator of this type operator type.
     * @since 5.0.0
     */
    operator: Operator;

    /**
     * The type of this type operator type.
     * @since 5.0.0
     */
    type: TypeParser;
  }

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
