import { TypeParser } from './TypeParser';

/**
 * Parses data for a named tuple member.
 * @since 1.0.0
 */
export class NamedTupleMemberTypeParser implements TypeParser {
  /**
   * The name of this named tuple member.
   * @since 1.0.0
   */
  public readonly kind = TypeParser.Kind.NamedTupleMember;

  /**
   * The name of this named tuple member.
   * @since 1.0.0
   */
  public readonly name: string;

  /**
   * The type of this named tuple member.
   * @since 1.0.0
   */
  public readonly type: TypeParser;

  /**
   * Whether this named tuple member is optional.
   * @since 1.0.0
   */
  public readonly optional: boolean;

  public constructor(name: string, type: TypeParser, optional: boolean) {
    this.name = name;
    this.type = type;
    this.optional = optional;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): NamedTupleMemberTypeParser.JSON {
    return {
      kind: this.kind,
      name: this.name,
      type: this.type.toJSON(),
      optional: this.optional
    };
  }

  /**
   * Converts this parser to a string.
   * @since 1.0.0
   * @returns The string representation of this parser.
   */
  public toString(): string {
    return NamedTupleMemberTypeParser.formatToString(this);
  }

  /**
   * Formats this type parser to a string.
   * @since 3.3.0
   * @param parser The parser to format.
   * @returns The string representation of this parser.
   */
  public static formatToString(parser: NamedTupleMemberTypeParser): string {
    return `${parser.name}${parser.optional ? '?' : ''}: ${parser.type.toString()}`;
  }
}

export namespace NamedTupleMemberTypeParser {
  export interface JSON extends TypeParser.JSON {
    kind: TypeParser.Kind.NamedTupleMember;

    /**
     * The name of this named tuple member.
     * @since 1.0.0
     */
    name: string;

    /**
     * The type of this named tuple member in a JSON compatible format.
     * @since 1.0.0
     */
    type: TypeParser.JSON;

    /**
     * Whether this named tuple member is optional.
     * @since 1.0.0
     */
    optional: boolean;
  }
}
