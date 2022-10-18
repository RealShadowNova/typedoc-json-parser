import { bold, red, yellow } from 'colorette';
import type { JSONOutput } from 'typedoc';
import { ReflectionKind, SearchResult } from '../types';
import { ClassParser } from './class-parser/';
import { EnumParser } from './enum-parser';
import { FunctionParser } from './FunctionParser';
import { InterfaceParser } from './interface-parser';
import { NamespaceParser } from './NamespaceParser';
import { TypeAliasParser } from './TypeAliasParser';
import { VariableParser } from './VariableParser';

/**
 * Parses data from `JSONOutput.ProjectReflection` or {@link ProjectParser.JSON}
 * @since 1.0.0
 */
export class ProjectParser {
  /**
   * The version of `typedoc-json-parser` used to generate this project.
   * @since 1.0.0
   */
  public readonly typeDocJsonParserVersion: string = ProjectParser.version;

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
  public readonly version: string | null;

  /**
   * The readme content of this project.
   * @since 3.0.0
   */
  public readonly readme: string | null;

  /**
   * The changelog of this project.
   * @since 3.2.0
   */
  public changelog: string | null;

  /**
   * An array of class parsers for this project.
   * @since 1.0.0
   */
  public readonly classes: ClassParser[];

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

  /**
   * An array of variable parsers for this project.
   * @since 1.0.0
   */
  public readonly variables: VariableParser[];

  public constructor(options: ProjectParser.Options) {
    const { data, version, readme, changelog } = options;
    const { id, name } = data;

    this.id = id;
    this.name = name;

    if ('classes' in data) {
      const { typeDocJsonParserVersion, classes, enums, functions, interfaces, namespaces, typeAliases, variables } = data;
      const incomingTypeDocVersion = typeDocJsonParserVersion.split('.').map(Number) as [number, number, number];
      const currentTypeDocVersion = this.typeDocJsonParserVersion.split('.').map(Number) as [number, number, number];

      if (incomingTypeDocVersion[0] !== currentTypeDocVersion[0]) {
        console.warn(
          red(
            `${bold('[WARNING]')} typedoc-json-parser major version mismatch. Expected ${currentTypeDocVersion[0]}, but received ${
              incomingTypeDocVersion[0]
            }`
          )
        );
      } else if (incomingTypeDocVersion[1] !== currentTypeDocVersion[1]) {
        console.warn(
          yellow(
            `${bold('[WARNING]')} typedoc-json-parser minor version mismatch. Expected ${currentTypeDocVersion[1]}, but received ${
              incomingTypeDocVersion[1]
            }`
          )
        );
      } else if (incomingTypeDocVersion[2] !== currentTypeDocVersion[2]) {
        console.warn(
          yellow(
            `${bold('[WARNING]')} typedoc-json-parser patch version mismatch. Expected ${currentTypeDocVersion[2]}, but received ${
              incomingTypeDocVersion[2]
            }`
          )
        );
      }

      this.typeDocJsonParserVersion = typeDocJsonParserVersion;
      this.version = version ?? data.version;
      this.readme = readme ?? data.readme;
      this.changelog = changelog ?? data.changelog;
      this.classes = classes.map((json) => ClassParser.generateFromJSON(json, this));
      this.enums = enums.map((json) => EnumParser.generateFromJSON(json, this));
      this.functions = functions.map((json) => FunctionParser.generateFromJSON(json, this));
      this.interfaces = interfaces.map((json) => InterfaceParser.generateFromJSON(json, this));
      this.namespaces = namespaces.map((json) => NamespaceParser.generateFromJSON(json, this));
      this.typeAliases = typeAliases.map((json) => TypeAliasParser.generateFromJSON(json, this));
      this.variables = variables.map((json) => VariableParser.generateFromJSON(json, this));
    } else {
      const { kind, kindString = 'Unknown', children = [] } = data;

      if (kind !== ReflectionKind.Project) throw new Error(`Expected Project (${ReflectionKind.Project}), but received ${kindString} (${kind})`);

      this.version = version ?? null;
      this.readme = readme ?? null;
      this.changelog = changelog ?? null;
      this.classes = children.filter((child) => child.kind === ReflectionKind.Class).map((child) => ClassParser.generateFromTypeDoc(child, this));

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

      this.variables = children
        .filter((child) => child.kind === ReflectionKind.Variable)
        .map((child) => VariableParser.generateFromTypeDoc(child, this));
    }
  }

  /**
   * Find a parser by id.
   * @since 3.0.0
   * @param id The id of the parser to find.
   * @returns The parser with the given id, or `null` if none was found.
   */
  public find(id: number): SearchResult | null {
    for (const classParser of this.classes) {
      if (classParser.id === id) return classParser;
      if (classParser.construct.id === id) return classParser.construct;

      for (const methodParser of classParser.methods) {
        if (methodParser.id === id) return methodParser;

        for (const signature of methodParser.signatures) {
          if (signature.id === id) return signature;

          for (const typeParameter of signature.typeParameters) if (typeParameter.id === id) return typeParameter;
          for (const parameter of signature.parameters) if (parameter.id === id) return parameter;
        }
      }

      for (const propertyParser of classParser.properties) if (propertyParser.id === id) return propertyParser;
    }

    for (const enumParser of this.enums) {
      if (enumParser.id === id) return enumParser;

      for (const propertyParser of enumParser.members) if (propertyParser.id === id) return propertyParser;
    }

    for (const functionParser of this.functions) if (functionParser.id === id) return functionParser;
    for (const interfaceParser of this.interfaces) {
      if (interfaceParser.id === id) return interfaceParser;

      for (const propertyParser of interfaceParser.properties) if (propertyParser.id === id) return propertyParser;
    }

    for (const namespaceParser of this.namespaces) {
      if (namespaceParser.id === id) return namespaceParser;

      const found = namespaceParser.find(id);

      if (found) return found;
    }

    for (const typeAliasParser of this.typeAliases) if (typeAliasParser.id === id) return typeAliasParser;
    for (const variableParser of this.variables) if (variableParser.id === id) return variableParser;

    return null;
  }

  /**
   * Search for a parser with a given query.
   * @since 3.0.0
   * @param query The query to search with.
   * @returns An array of search results.
   */
  public search(query: string): SearchResult[] {
    const results: SearchResult[] = [];
    const words = query
      .toLowerCase()
      .split(/(#|\.)/g)
      .filter((word) => word !== '.' && word !== '#');

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

    for (const enumParser of this.enums) {
      if (enumParser.name.toLowerCase().includes(words[0])) {
        if (words.length === 1) {
          results.push(enumParser);

          continue;
        }

        for (const enumMemberParser of enumParser.members) {
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

    for (const variableParser of this.variables) {
      if (variableParser.name.toLowerCase().includes(words[0])) {
        results.push(variableParser);

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
      readme: this.readme,
      changelog: this.changelog,
      classes: this.classes.map((parser) => parser.toJSON()),
      enums: this.enums.map((parser) => parser.toJSON()),
      functions: this.functions.map((parser) => parser.toJSON()),
      interfaces: this.interfaces.map((parser) => parser.toJSON()),
      namespaces: this.namespaces.map((parser) => parser.toJSON()),
      typeAliases: this.typeAliases.map((parser) => parser.toJSON()),
      variables: this.variables.map((parser) => parser.toJSON())
    };
  }

  public static version = '[@versionInjector]';
}

export namespace ProjectParser {
  export interface Options {
    /**
     * The data for this project.
     * @since 3.0.0
     */
    data: JSON | JSONOutput.ProjectReflection;

    /**
     * The version of the project being parsed.
     * @since 3.0.0
     */
    version?: string;

    /**
     * The readme content of this project.
     * @since 3.0.0
     */
    readme?: string;

    /**
     * The changelog content of this project.
     * @since 3.2.0
     */
    changelog?: string;
  }

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
     * The readme content of this project.
     * @since 3.0.0
     */
    readme: string | null;

    /**
     * The changelog content of this project.
     * @since 3.2.0
     */
    changelog: string | null;

    /**
     * An array of class JSON compatible objects for this project in a JSON compatible format.
     * @since 1.0.0
     */
    classes: ClassParser.JSON[];

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

    /**
     * An array of variable JSON compatible objects for this project in a JSON compatible format.
     * @since 1.0.0
     */
    variables: VariableParser.JSON[];
  }
}
