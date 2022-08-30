import { TypeParser } from './TypeParser';

/**
 * Parses data for a mapped type.
 * @since 1.0.0
 */
export class MappedTypeParser implements TypeParser {
  /**
   * The kind of type this parser is for.
   * @since 1.0.0
   */
  public readonly kind = TypeParser.Kind.Mapped;

  /**
   * The parameter name of this mapped type.
   * @since 1.0.0
   */
  public readonly parameter: string;

  /**
   * The parameter type of this mapped type.
   * @since 1.0.0
   */
  public readonly parameterType: TypeParser;

  /**
   * The name type of this mapped type.
   * @since 1.0.0
   */
  public readonly nameType: TypeParser | null;

  /**
   * The template type of this mapped type.
   * @since 1.0.0
   */
  public readonly templateType: TypeParser;

  /**
   * The readonly modifier of this mapped type.
   * @since 1.0.0
   */
  public readonly readonly: MappedTypeParser.Modifier | null;

  /**
   * The optional modifier of this mapped type.
   * @since 1.0.0
   */
  public readonly optional: MappedTypeParser.Modifier | null;

  public constructor(
    parameter: string,
    parameterType: TypeParser,
    nameType: TypeParser | null,
    templateType: TypeParser,
    readonly: MappedTypeParser.Modifier | null,
    optional: MappedTypeParser.Modifier | null
  ) {
    this.parameter = parameter;
    this.parameterType = parameterType;
    this.nameType = nameType;
    this.templateType = templateType;
    this.readonly = readonly;
    this.optional = optional;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): MappedTypeParser.JSON {
    return {
      kind: this.kind,
      parameter: this.parameter,
      parameterType: this.parameterType.toJSON(),
      nameType: this.nameType ? this.nameType.toJSON() : null,
      templateType: this.templateType.toJSON(),
      readonly: this.readonly,
      optional: this.optional
    };
  }

  /**
   * Converts this parser to a string.
   * @since 1.0.0
   * @returns The string representation of this parser.
   */
  public toString(): string {
    const readonly =
      this.readonly === MappedTypeParser.Modifier.Add ? 'readonly' : this.readonly === MappedTypeParser.Modifier.Remove ? '-readonly' : '';

    const optional = this.optional === MappedTypeParser.Modifier.Add ? '?' : this.optional === MappedTypeParser.Modifier.Remove ? '-?' : '';

    return `{ ${readonly}[${this.parameter} in ${this.parameterType.toString()}]${optional}: ${this.templateType.toString()} }`;
  }
}

export namespace MappedTypeParser {
  export interface JSON extends TypeParser.JSON {
    kind: TypeParser.Kind.Mapped;

    /**
     * The parameter name of this mapped type.
     * @since 1.0.0
     */
    parameter: string;

    /**
     * The parameter type of this mapped type in a JSON compatible format.
     * @since 1.0.0
     */
    parameterType: TypeParser.JSON;

    /**
     * The name type of this mapped type in a JSON compatible format.
     * @since 1.0.0
     */
    nameType: TypeParser.JSON | null;

    /**
     * The template type of this mapped type in a JSON compatible format.
     * @since 1.0.0
     */
    templateType: TypeParser.JSON;

    /**
     * The readonly modifier of this mapped type.
     * @since 1.0.0
     */
    readonly: Modifier | null;

    /**
     * The optional modifier of this mapped type.
     * @since 1.0.0
     */
    optional: Modifier | null;
  }

  /**
   * The modifier for a mapped type.
   */
  export enum Modifier {
    Add = '+',

    Remove = '-'
  }
}
