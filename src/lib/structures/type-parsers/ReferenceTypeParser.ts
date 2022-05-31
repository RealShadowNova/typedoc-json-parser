import type { ClassParser } from '../class-parser/';
import type { ConstantParser } from '../ConstantParser';
import type { EnumParser } from '../enum-parser';
import type { FunctionParser } from '../FunctionParser';
import type { InterfaceParser } from '../interface-parser';
import type { NamespaceParser } from '../NamespaceParser';
import type { ProjectParser } from '../ProjectParser';
import type { TypeAliasParser } from '../TypeAliasParser';
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

  /**
   * The project this reference type belongs to.
   * @since 1.0.0
   */
  private project: ProjectParser;

  public constructor(id: number | null, name: string, packageName: string | null, typeArguments: TypeParser[], project: ProjectParser) {
    this.id = id;
    this.name = name;
    this.packageName = packageName;
    this.typeArguments = typeArguments;

    this.project = project;
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

  /**
   * Gets the type this reference type refers to.
   * @since 1.0.0
   */
  public get type(): ClassParser | ConstantParser | EnumParser | FunctionParser | InterfaceParser | NamespaceParser | TypeAliasParser | null {
    return (
      this.project.classes.find((c) => c.id === this.id) ??
      this.project.constants.find((c) => c.id === this.id) ??
      this.project.enums.find((c) => c.id === this.id) ??
      this.project.functions.find((c) => c.id === this.id) ??
      this.project.interfaces.find((c) => c.id === this.id) ??
      this.project.namespaces.find((c) => c.id === this.id) ??
      this.project.typeAliases.find((c) => c.id === this.id) ??
      null
    );
  }
}

export namespace ReferenceTypeParser {
  export interface JSON extends TypeParser.JSON {
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
