import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../types';
import { ClassParser } from './class-parser/';
import { ConstantParser } from './ConstantParser';
import { EnumParser } from './enum-parser';
import { FunctionParser } from './FunctionParser';
import { InterfaceParser } from './interface-parser';
import { CommentParser, SourceParser } from './misc';
import { Parser } from './Parser';
import type { ProjectParser } from './ProjectParser';
import { TypeAliasParser } from './TypeAliasParser';

export class NamespaceParser extends Parser {
  public readonly external: boolean;

  public readonly classes: ClassParser[];

  public readonly constants: ConstantParser[];

  public readonly enums: EnumParser[];

  public readonly functions: FunctionParser[];

  public readonly interfaces: InterfaceParser[];

  public readonly namespaces: NamespaceParser[];

  public readonly typeAliases: TypeAliasParser[];

  public constructor(data: NamespaceParser.Data, project: ProjectParser) {
    super(data, project);

    const { external, classes, constants, enums, functions, interfaces, namespaces, typeAliases } = data;

    this.external = external;
    this.classes = classes;
    this.constants = constants;
    this.enums = enums;
    this.functions = functions;
    this.interfaces = interfaces;
    this.namespaces = namespaces;
    this.typeAliases = typeAliases;
  }

  public toJSON(): NamespaceParser.JSON {
    return {
      ...super.toJSON(),
      external: this.external,
      classes: this.classes.map((parser) => parser.toJSON()),
      constants: this.constants.map((parser) => parser.toJSON()),
      enums: this.enums.map((parser) => parser.toJSON()),
      functions: this.functions.map((parser) => parser.toJSON()),
      interfaces: this.interfaces.map((parser) => parser.toJSON()),
      namespaces: this.namespaces.map((parser) => parser.toJSON()),
      typeAliases: this.typeAliases.map((parser) => parser.toJSON())
    };
  }

  public static generate(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): NamespaceParser {
    const { kind, kindString = 'Unknown', id, name, comment = {}, sources = [], flags, children = [] } = reflection;

    if (kind !== ReflectionKind.Namespace) throw new Error(`Expected Namespace (${ReflectionKind.Namespace}), but received ${kindString} (${kind})`);

    const classes = children.filter((child) => child.kind === ReflectionKind.Class).map((child) => ClassParser.generate(child, project));
    const constants = children.filter((child) => child.kind === ReflectionKind.Variable).map((child) => ConstantParser.generate(child, project));
    const enums = children.filter((child) => child.kind === ReflectionKind.Enum).map((child) => EnumParser.generate(child, project));
    const functions = children.filter((child) => child.kind === ReflectionKind.Function).map((child) => FunctionParser.generate(child, project));
    const interfaces = children.filter((child) => child.kind === ReflectionKind.Interface).map((child) => InterfaceParser.generate(child, project));
    const namespaces = children.filter((child) => child.kind === ReflectionKind.Namespace).map((child) => NamespaceParser.generate(child, project));
    const typeAliases = children.filter((child) => child.kind === ReflectionKind.TypeAlias).map((child) => TypeAliasParser.generate(child, project));

    return new NamespaceParser(
      {
        id,
        name,
        comment: CommentParser.generate(comment, project),
        source: sources.length ? SourceParser.generate(sources[0], project) : null,
        external: Boolean(flags.isExternal),
        classes,
        constants,
        enums,
        functions,
        interfaces,
        namespaces,
        typeAliases
      },
      project
    );
  }
}

export namespace NamespaceParser {
  export interface Data extends Parser.Data {
    external: boolean;

    classes: ClassParser[];

    constants: ConstantParser[];

    enums: EnumParser[];

    functions: FunctionParser[];

    interfaces: InterfaceParser[];

    namespaces: NamespaceParser[];

    typeAliases: TypeAliasParser[];
  }

  export interface JSON extends Parser.JSON {
    external: boolean;

    classes: ClassParser.JSON[];

    constants: ConstantParser.JSON[];

    enums: EnumParser.JSON[];

    functions: FunctionParser.JSON[];

    interfaces: InterfaceParser.JSON[];

    namespaces: JSON[];

    typeAliases: TypeAliasParser.JSON[];
  }
}
