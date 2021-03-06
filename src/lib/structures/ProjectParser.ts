import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../types';
import { ClassParser } from './class-parser/';
import { ConstantParser } from './ConstantParser';
import { EnumParser } from './enum-parser';
import { FunctionParser } from './FunctionParser';
import { InterfaceParser } from './interface-parser';
import { NamespaceParser } from './NamespaceParser';
import { TypeAliasParser } from './TypeAliasParser';

/**
 * Parses data from {@link JSONOutput.ProjectReflection} or {@link ProjectParser.JSON}
 * @since 1.0.0
 */
export class ProjectParser {
  /**
   * The identifier of this project. This is usually `0`
   * @since 1.0.0
   */
  public readonly id: number;

  /**
   * The name of your project.
   *
   * Corresponds to the `name` property in your TypeDoc configuration or the `name` property of your `package.json` file.
   * @since 1.0.0
   */
  public readonly name: string;

  /**
   * An array of class parsers for this project.
   * @since 1.0.0
   */
  public readonly classes: ClassParser[];

  /**
   * An array of constant parsers for this project.
   * @since 1.0.0
   */
  public readonly constants: ConstantParser[];

  /**
   * An array of enum parsers for this project.
   * @since 1.0.0
   */
  public readonly enums: EnumParser[];

  /**
   * An array of function parsers for this project.
   * @since 1.0.0
   */
  public readonly functions: FunctionParser[];

  /**
   * An array of interface parsers for this project.
   * @since 1.0.0
   */
  public readonly interfaces: InterfaceParser[];

  /**
   * An array of namespace parsers for this project.
   * @since 1.0.0
   */
  public readonly namespaces: NamespaceParser[];

  /**
   * An array of type alias parsers for this project.
   * @since 1.0.0
   */
  public readonly typeAliases: TypeAliasParser[];

  public constructor(data: ProjectParser.JSON | JSONOutput.ProjectReflection) {
    const { id, name } = data;

    this.id = id;
    this.name = name;

    if ('classes' in data) {
      const { classes, constants, enums, functions, interfaces, namespaces, typeAliases } = data;

      this.classes = classes.map((json) => ClassParser.generateFromJSON(json, this));
      this.constants = constants.map((json) => ConstantParser.generateFromJSON(json, this));
      this.enums = enums.map((json) => EnumParser.generateFromJSON(json, this));
      this.functions = functions.map((json) => FunctionParser.generateFromJSON(json, this));
      this.interfaces = interfaces.map((json) => InterfaceParser.generateFromJSON(json, this));
      this.namespaces = namespaces.map((json) => NamespaceParser.generateFromJSON(json, this));
      this.typeAliases = typeAliases.map((json) => TypeAliasParser.generateFromJSON(json, this));
    } else {
      const { kind, kindString = 'Unknown', children = [] } = data;

      if (kind !== ReflectionKind.Project) throw new Error(`Expected Project (${ReflectionKind.Project}), but received ${kindString} (${kind})`);

      this.classes = children.filter((child) => child.kind === ReflectionKind.Class).map((child) => ClassParser.generateFromTypeDoc(child, this));
      this.constants = children
        .filter((child) => child.kind === ReflectionKind.Variable)
        .map((child) => ConstantParser.generateFromTypeDoc(child, this));
      this.enums = children.filter((child) => child.kind === ReflectionKind.Enum).map((child) => EnumParser.generateFromTypeDoc(child, this));
      this.functions = children
        .filter((child) => child.kind === ReflectionKind.Function)
        .map((child) => FunctionParser.generateFromTypeDoc(child, this));
      this.interfaces = children
        .filter((child) => child.kind === ReflectionKind.Interface)
        .map((child) => InterfaceParser.generateFromTypeDoc(child, this));
      this.namespaces = children
        .filter((child) => child.kind === ReflectionKind.Namespace)
        .map((child) => NamespaceParser.generateFromTypeDoc(child, this));
      this.typeAliases = children
        .filter((child) => child.kind === ReflectionKind.TypeAlias)
        .map((child) => TypeAliasParser.generateFromTypeDoc(child, this));
    }
  }

  /**
   * Converts this project to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this project.
   */
  public toJSON(): ProjectParser.JSON {
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

export namespace ProjectParser {
  export interface JSON {
    /**
     * The identifier of this project. This is usually `0`
     * @since 1.0.0
     */
    id: number;

    /**
     * The name of your project.
     *
     * Corresponds to the `name` property in your TypeDoc configuration or the `name` property of your `package.json` file.
     * @since 1.0.0
     */
    name: string;

    /**
     * An array of class JSON compatible objects for this project in a JSON compatible format.
     * @since 1.0.0
     */
    classes: ClassParser.JSON[];

    /**
     * An array of constant JSON compatible objects for this project in a JSON compatible format.
     * @since 1.0.0
     */
    constants: ConstantParser.JSON[];

    /**
     * An array of enum JSON compatible objects for this project in a JSON compatible format.
     * @since 1.0.0
     */
    enums: EnumParser.JSON[];

    /**
     * An array of function JSON compatible objects for this project in a JSON compatible format.
     * @since 1.0.0
     */
    functions: FunctionParser.JSON[];

    /**
     * An array of interface JSON compatible objects for this project in a JSON compatible format.
     * @since 1.0.0
     */
    interfaces: InterfaceParser.JSON[];

    /**
     * An array of namespace JSON compatible objects for this project in a JSON compatible format.
     * @since 1.0.0
     */
    namespaces: NamespaceParser.JSON[];

    /**
     * An array of type alias JSON compatible objects for this project in a JSON compatible format.
     * @since 1.0.0
     */
    typeAliases: TypeAliasParser.JSON[];
  }
}
