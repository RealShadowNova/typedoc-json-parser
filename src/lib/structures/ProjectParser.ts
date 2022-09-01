import type { JSONOutput } from 'typedoc';
import { ReflectionKind, SearchResult } from '../types';
import { ClassParser } from './class-parser/';
import { ConstantParser } from './ConstantParser';
import { EnumParser } from './enum-parser';
import { FunctionParser } from './FunctionParser';
import { InterfaceParser } from './interface-parser';
import { NamespaceParser } from './NamespaceParser';
import { TypeAliasParser } from './TypeAliasParser';

/**
 * Parses data from `JSONOutput.ProjectReflection` or {@link ProjectParser.JSON}
 * @since 1.0.0
 */
export class ProjectParser {
  /**
   * The version of `typedoc-json-parser` used to generate this project.
   * @since 1.0.0
   */
  public readonly typeDocJsonParserVersion: string = '[@versionInjector]';

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
   * The version of the project being parsed.
   *
   * Corresponds to the `version` property in your `package.json`
   * @since 2.2.0
   */
  public readonly version: string | null = null;

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

  public constructor(data: ProjectParser.JSON | JSONOutput.ProjectReflection, version: string | null = null) {
    const { id, name } = data;

    this.id = id;
    this.name = name;

    if ('classes' in data) {
      const { typeDocJsonParserVersion, classes, constants, enums, functions, interfaces, namespaces, typeAliases } = data;

      this.typeDocJsonParserVersion = typeDocJsonParserVersion;
      this.version = version ?? data.version;
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

      this.version = version;
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
   * Search for a parser with a given query.
   * @since 3.0.0
   * @param query The query to search with.
   * @returns An array of search results.
   */
  public search(query: string): SearchResult[] {
    const results: SearchResult[] = [];
    const words = query.toLowerCase().split(/(#|.)/g);

    for (const classParser of this.classes) {
      if (classParser.name.toLowerCase().includes(words[0])) {
        if (words.length === 1) {
          results.push(classParser);

          continue;
        }

        for (const methodParser of classParser.methods) {
          if (methodParser.name.toLowerCase().includes(words[1])) {
            if (words.length === 2) {
              results.push(methodParser);

              continue;
            }
          }
        }

        for (const propertyParser of classParser.properties) {
          if (propertyParser.name.toLowerCase().includes(words[1])) {
            results.push(propertyParser);

            continue;
          }
        }
      }
    }

    for (const constantParser of this.constants) {
      if (constantParser.name.toLowerCase().includes(words[0])) {
        results.push(constantParser);

        continue;
      }
    }

    for (const enumParser of this.enums) {
      if (enumParser.name.toLowerCase().includes(words[0])) {
        if (words.length === 1) {
          results.push(enumParser);

          continue;
        }

        for (const enumMemberParser of enumParser.properties) {
          if (enumMemberParser.name.toLowerCase().includes(words[1])) {
            results.push(enumMemberParser);

            continue;
          }
        }
      }
    }

    for (const functionParser of this.functions) {
      if (functionParser.name.toLowerCase().includes(words[0])) {
        results.push(functionParser);

        continue;
      }
    }

    for (const interfaceParser of this.interfaces) {
      if (interfaceParser.name.toLowerCase().includes(words[0])) {
        if (words.length === 1) {
          results.push(interfaceParser);

          continue;
        }

        for (const propertyParser of interfaceParser.properties) {
          if (propertyParser.name.toLowerCase().includes(words[1])) {
            results.push(propertyParser);

            continue;
          }
        }
      }
    }

    for (const namespaceParser of this.namespaces) {
      if (namespaceParser.name.toLowerCase().includes(words[0])) {
        if (words.length === 1) {
          results.push(namespaceParser);

          continue;
        }

        const subResults = namespaceParser.search(query.substring(words[0].length));

        for (const subResult of subResults) results.push(subResult);
      }
    }

    for (const typeAliasParser of this.typeAliases) {
      if (typeAliasParser.name.toLowerCase().includes(words[0])) {
        results.push(typeAliasParser);

        continue;
      }
    }

    return results;
  }

  /**
   * Converts this project to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this project.
   */
  public toJSON(): ProjectParser.JSON {
    return {
      typeDocJsonParserVersion: this.typeDocJsonParserVersion,
      id: this.id,
      name: this.name,
      version: this.version,
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
     * The version of `typedoc-json-parser` that generated this JSON object.
     * @since 2.1.0
     */
    typeDocJsonParserVersion: string;

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
     * The version of the project being parsed.
     *
     * Corresponds to the `version` property in your `package.json`
     * @since 2.2.0
     */
    version: string | null;

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
