import type { JSONOutput } from 'typedoc';
import { TypeParser } from './TypeParser';

/**
 * Parses data for a reflection type.
 * @since 1.0.0
 */
export class ReflectionTypeParser implements TypeParser {
  /**
   * The kind of type this parser is for.
   * @since 1.0.0
   */
  public readonly kind = TypeParser.Kind.Reflection;

  /**
   * The reflection of this reflection type.
   * @since 1.0.0
   */
  public reflection: JSONOutput.DeclarationReflection | null;

  public constructor(reflection: JSONOutput.DeclarationReflection | null) {
    this.reflection = reflection;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): ReflectionTypeParser.JSON {
    return {
      kind: this.kind,
      reflection: this.reflection
    };
  }

  /**
   * Converts this parser to a string.
   * @since 1.0.0
   * @returns The string representation of this parser.
   */
  public toString(): string {
    return ReflectionTypeParser.formatToString(this);
  }

  /**
   * Formats this type parser to a string.
   * @since 4.0.0
   * @param parser The parser to format.
   * @returns The string representation of this parser.
   */
  public static formatToString = (parser: ReflectionTypeParser): string => {
    return !parser.reflection?.children && parser.reflection?.signatures ? 'Function' : 'Object';
  };
}

export namespace ReflectionTypeParser {
  export interface JSON extends TypeParser.JSON {
    kind: TypeParser.Kind.Reflection;

    /**
     * The reflection of this reflection type.
     * @since 1.0.0
     */
    reflection: JSONOutput.DeclarationReflection | null;
  }
}
