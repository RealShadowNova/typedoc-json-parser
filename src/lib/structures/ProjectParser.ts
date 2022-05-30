import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../types';
import { ClassParser } from './class-parser/';
import { ConstantParser } from './ConstantParser';
import { EnumParser } from './enum-parser';
import { FunctionParser } from './FunctionParser';
import { InterfaceParser } from './interface-parser';
import { NamespaceParser } from './NamespaceParser';
import { TypeAliasParser } from './TypeAliasParser';

export class ProjectParser {
  public readonly id: number;

  public readonly name: string;

  public readonly classes: ClassParser[];

  public readonly constants: ConstantParser[];

  public readonly enums: EnumParser[];

  public readonly functions: FunctionParser[];

  public readonly interfaces: InterfaceParser[];

  public readonly namespaces: NamespaceParser[];

  public readonly typeAliases: TypeAliasParser[];

  public constructor(data: Parser.Data | JSONOutput.ProjectReflection) {
    const { id, name } = data;

    this.id = id;
    this.name = name;

    if ('classes' in data) {
      const { classes, constants, enums, functions, interfaces, namespaces, typeAliases } = data;

      this.classes = classes;
      this.constants = constants;
      this.enums = enums;
      this.functions = functions;
      this.interfaces = interfaces;
      this.namespaces = namespaces;
      this.typeAliases = typeAliases;
    } else {
      const { children = [] } = data;

      this.classes = children.filter((child) => child.kind === ReflectionKind.Class).map((child) => ClassParser.generate(child, this));
      this.constants = children.filter((child) => child.kind === ReflectionKind.Variable).map((child) => ConstantParser.generate(child, this));
      this.enums = children.filter((child) => child.kind === ReflectionKind.Enum).map((child) => EnumParser.generate(child, this));
      this.functions = children.filter((child) => child.kind === ReflectionKind.Function).map((child) => FunctionParser.generate(child, this));
      this.interfaces = children.filter((child) => child.kind === ReflectionKind.Interface).map((child) => InterfaceParser.generate(child, this));
      this.namespaces = children.filter((child) => child.kind === ReflectionKind.Namespace).map((child) => NamespaceParser.generate(child, this));
      this.typeAliases = children.filter((child) => child.kind === ReflectionKind.TypeAlias).map((child) => TypeAliasParser.generate(child, this));
    }
  }

  public toJSON(): Parser.JSON {
    return {
      id: this.id,
      name: this.name,
      classes: this.classes.map((parser) => parser.toJSON()),
      constants: this.constants.map((parser) => parser.toJSON()),
      enums: this.enums.map((parser) => parser.toJSON()),
      functions: this.functions.map((parser) => parser.toJSON()),
      interfaces: this.interfaces.map((parser) => parser.toJSON()),
      namespaces: this.namespaces.map((parser) => parser.toJSON()),
      typeAliases: this.typeAliases.map((parser) => parser.toJSON())
    };
  }
}

export namespace Parser {
  export interface Data {
    id: number;

    name: string;

    classes: ClassParser[];

    constants: ConstantParser[];

    enums: EnumParser[];

    functions: FunctionParser[];

    interfaces: InterfaceParser[];

    namespaces: NamespaceParser[];

    typeAliases: TypeAliasParser[];
  }

  export interface JSON {
    id: number;

    name: string;

    classes: ClassParser.JSON[];

    constants: ConstantParser.JSON[];

    enums: EnumParser.JSON[];

    functions: FunctionParser.JSON[];

    interfaces: InterfaceParser.JSON[];

    namespaces: NamespaceParser.JSON[];

    typeAliases: TypeAliasParser.JSON[];
  }
}
