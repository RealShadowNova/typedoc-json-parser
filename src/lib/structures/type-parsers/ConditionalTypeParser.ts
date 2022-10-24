import { TypeParser } from './TypeParser';

/**
 * Parses data for a conditional type.
 * @since 1.0.0
 */
export class ConditionalTypeParser implements TypeParser {
  /**
   * The kind of type this parser is for.
   * @since 1.0.0
   */
  public readonly kind = TypeParser.Kind.Conditional;

  /**
   * The check type of this conditional type.
   * @since 1.0.0
   */
  public readonly checkType: TypeParser;

  /**
   * The extends type of this conditional type.
   * @since 1.0.0
   */
  public readonly extendsType: TypeParser;

  /**
   * The type of this conditional type when the check type is true.
   * @since 1.0.0
   */
  public readonly trueType: TypeParser;

  /**
   * The type of this conditional type when the check type is false.
   * @since 1.0.0
   */
  public readonly falseType: TypeParser;

  public constructor(data: ConditionalTypeParser.Data) {
    const { checkType, extendsType, trueType, falseType } = data;

    this.checkType = checkType;
    this.extendsType = extendsType;
    this.trueType = trueType;
    this.falseType = falseType;
  }

  /**
   * Converts this parser to a Json compatible format.
   * @since 1.0.0
   * @returns The Json compatible format of this parser.
   */
  public toJSON(): ConditionalTypeParser.Json {
    return {
      kind: this.kind,
      checkType: this.checkType.toJSON(),
      extendsType: this.extendsType.toJSON(),
      trueType: this.trueType.toJSON(),
      falseType: this.falseType.toJSON()
    };
  }

  /**
   * Converts this parser to a string.
   * @since 1.0.0
   * @returns The string representation of this parser.
   */
  public toString(): string {
    return ConditionalTypeParser.formatToString(this);
  }

  /**
   * Formats this type parser to a string.
   * @since 4.0.0
   * @param parser The parser to format.
   * @returns The string representation of this parser.
   */
  public static formatToString(parser: ConditionalTypeParser): string {
    return `${TypeParser.wrap(
      parser.checkType,
      TypeParser.BindingPowers[TypeParser.Kind.Conditional]
    )} extends ${parser.extendsType.toString()} ? ${parser.trueType.toString()} : ${parser.falseType.toString()}`;
  }
}

export namespace ConditionalTypeParser {
  export interface Data {
    /**
     * The check type of this conditional type.
     * @since 5.0.0
     */
    checkType: TypeParser;

    /**
     * The extends type of this conditional type.
     * @since 5.0.0
     */
    extendsType: TypeParser;

    /**
     * The type of this conditional type when the check type is true.
     * @since 5.0.0
     */
    trueType: TypeParser;

    /**
     * The type of this conditional type when the check type is false.
     * @since 5.0.0
     */
    falseType: TypeParser;
  }

  export interface Json extends TypeParser.Json {
    kind: TypeParser.Kind.Conditional;

    /**
     * The check type of this conditional type in a Json compatible format.
     * @since 1.0.0
     */
    checkType: TypeParser.Json;

    /**
     * The extends type of this conditional type in a Json compatible format.
     * @since 1.0.0
     */
    extendsType: TypeParser.Json;

    /**
     * The type of this conditional type when the check type is true in a Json compatible format.
     * @since 1.0.0
     */
    trueType: TypeParser.Json;

    /**
     * The type of this conditional type when the check type is false in a Json compatible format.
     * @since 1.0.0
     */
    falseType: TypeParser.Json;
  }
}
