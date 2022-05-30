import type { ClassParser } from '../class-parser/';
import type { ConstantParser } from '../ConstantParser';
import type { EnumParser } from '../enum-parser';
import type { FunctionParser } from '../FunctionParser';
import type { InterfaceParser } from '../interface-parser';
import type { NamespaceParser } from '../NamespaceParser';
import type { ProjectParser } from '../ProjectParser';
import type { TypeAliasParser } from '../TypeAliasParser';
import { TypeParser } from './TypeParser';

export class ReferenceTypeParser implements TypeParser {
  public readonly kind = TypeParser.Kind.Reference;

  public readonly id: number | null;

  public readonly name: string;

  public readonly packageName: string | null;

  public readonly typeArguments: TypeParser[];

  private project: ProjectParser;

  public constructor(id: number | null, name: string, packageName: string | null, typeArguments: TypeParser[], project: ProjectParser) {
    this.id = id;
    this.name = name;
    this.packageName = packageName;
    this.typeArguments = typeArguments;

    this.project = project;
  }

  public isPackage(): boolean {
    return this.packageName === null;
  }

  public toJSON(): ReferenceTypeParser.JSON {
    return {
      kind: this.kind,
      id: this.id,
      name: this.name,
      packageName: this.packageName,
      typeArguments: this.typeArguments.map((type) => type.toJSON())
    };
  }

  public toString(): string {
    const typeArguments = this.typeArguments.length > 0 ? `<${this.typeArguments.map((type) => type.toString()).join(', ')}>` : '';

    return `${this.packageName ? `${this.packageName}.` : ''}${this.name}${typeArguments}`;
  }

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
    id: number | null;

    name: string;

    packageName: string | null;

    typeArguments: TypeParser.JSON[];
  }
}
