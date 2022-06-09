import { TypeParser } from './TypeParser';

/**
 * Parses data for a reference type.
 * @since 1.0.0
 */
export class ReferenceTypeParser implements TypeParser {
  /**
   * The kind of type this parser is for.
   * @since 1.0.0
   */
  public readonly kind = TypeParser.Kind.Reference;

  /**
   * The id of this reference type.
   * @since 1.0.0
   */
  public readonly id: number | null;

  /**
   * The name of this reference type.
   * @since 1.0.0
   */
  public readonly name: string;

  /**
   * The package name of this reference type.
   * @since 1.0.0
   */
  public readonly packageName: string | null;

  /**
   * The type arguments of this reference type.
   * @since 1.0.0
   */
  public readonly typeArguments: TypeParser[];

  public constructor(id: number | null, name: string, packageName: string | null, typeArguments: TypeParser[]) {
    this.id = id;
    this.name = name;
    this.packageName = packageName;
    this.typeArguments = typeArguments;
  }

  /**
   * Whether this reference type is from a package.
   * @since 1.0.0
   * @returns
   */
  public isPackage(): boolean {
    return this.packageName === null;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): ReferenceTypeParser.JSON {
    return {
      kind: this.kind,
      id: this.id,
      name: this.name,
      packageName: this.packageName,
      typeArguments: this.typeArguments.map((type) => type.toJSON())
    };
  }

  /**
   * Converts this parser to a string.
   * @since 1.0.0
   * @returns The string representation of this parser.
   */
  public toString(): string {
    const typeArguments = this.typeArguments.length > 0 ? `<${this.typeArguments.map((type) => type.toString()).join(', ')}>` : '';

    return `${this.packageName ? `${this.packageName}.` : ''}${this.name}${typeArguments}`;
  }
}

export namespace ReferenceTypeParser {
  export interface JSON extends TypeParser.JSON {
    kind: TypeParser.Kind.Reference;

    /**
     * The id of this reference type.
     * @since 1.0.0
     */
    id: number | null;

    /**
     * The name of this reference type.
     * @since 1.0.0
     */
    name: string;

    /**
     * The package name of this reference type.
     * @since 1.0.0
     */
    packageName: string | null;

    /**
     * The type arguments of this reference type in a JSON compatible format.
     */
    typeArguments: TypeParser.JSON[];
  }
}
