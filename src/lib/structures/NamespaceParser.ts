import type { JSONOutput } from 'typedoc';
import { ReflectionKind, SearchResult } from '../types';
import { ClassParser } from './class-parser/';
import { ConstantParser } from './ConstantParser';
import { EnumParser } from './enum-parser';
import { FunctionParser } from './FunctionParser';
import { InterfaceParser } from './interface-parser';
import { CommentParser, SourceParser } from './misc';
import { Parser } from './Parser';
import type { ProjectParser } from './ProjectParser';
import { TypeAliasParser } from './TypeAliasParser';

/**
 * Parses data from a namespace reflection.
 * @since 1.0.0
 */
export class NamespaceParser extends Parser {
  /**
   * Whether this namespace is external.
   * @since 1.0.0
   */
  public readonly external: boolean;

  /**
   * The class parsers of this namespace.
   * @since 1.0.0
   */
  public readonly classes: ClassParser[];

  /**
   * The constant parsers of this namespace.
   * @since 1.0.0
   */
  public readonly constants: ConstantParser[];

  /**
   * The enum parsers of this namespace.
   * @since 1.0.0
   */
  public readonly enums: EnumParser[];

  /**
   * The function parsers of this namespace.
   * @since 1.0.0
   */
  public readonly functions: FunctionParser[];

  /**
   * The interface parsers of this namespace.
   * @since 1.0.0
   */
  public readonly interfaces: InterfaceParser[];

  /**
   * The namespace parsers of this namespace.
   * @since 1.0.0
   */
  public readonly namespaces: NamespaceParser[];

  /**
   * The type alias parsers of this namespace.
   * @since 1.0.0
   */
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

    for (const constantParser of this.constants) if (constantParser.id === id) return constantParser;
    for (const enumParser of this.enums) {
      if (enumParser.id === id) return enumParser;

      for (const propertyParser of enumParser.properties) if (propertyParser.id === id) return propertyParser;
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
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format.
   */
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

  /**
   * Generates a new {@link NamespaceParser} instance from the given data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @param project The project this parser belongs to.
   * @returns The generated parser.
   */
  public static generateFromTypeDoc(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): NamespaceParser {
    const { kind, kindString = 'Unknown', id, name, comment = { summary: [] }, sources = [], flags, children = [] } = reflection;

    if (kind !== ReflectionKind.Namespace) throw new Error(`Expected Namespace (${ReflectionKind.Namespace}), but received ${kindString} (${kind})`);

    const classes = children.filter((child) => child.kind === ReflectionKind.Class).map((child) => ClassParser.generateFromTypeDoc(child, project));
    const constants = children
      .filter((child) => child.kind === ReflectionKind.Variable)
      .map((child) => ConstantParser.generateFromTypeDoc(child, project));

    const enums = children.filter((child) => child.kind === ReflectionKind.Enum).map((child) => EnumParser.generateFromTypeDoc(child, project));
    const functions = children
      .filter((child) => child.kind === ReflectionKind.Function)
      .map((child) => FunctionParser.generateFromTypeDoc(child, project));

    const interfaces = children
      .filter((child) => child.kind === ReflectionKind.Interface)
      .map((child) => InterfaceParser.generateFromTypeDoc(child, project));

    const namespaces = children
      .filter((child) => child.kind === ReflectionKind.Namespace)
      .map((child) => NamespaceParser.generateFromTypeDoc(child, project));

    const typeAliases = children
      .filter((child) => child.kind === ReflectionKind.TypeAlias)
      .map((child) => TypeAliasParser.generateFromTypeDoc(child, project));

    return new NamespaceParser(
      {
        id,
        name,
        comment: CommentParser.generateFromTypeDoc(comment, project),
        source: sources.length ? SourceParser.generateFromTypeDoc(sources[0], project) : null,
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

  public static generateFromJSON(json: NamespaceParser.JSON, project: ProjectParser): NamespaceParser {
    const { id, name, comment, source, external, classes, constants, enums, functions, interfaces, namespaces, typeAliases } = json;

    return new NamespaceParser(
      {
        id,
        name,
        comment: CommentParser.generateFromJSON(comment, project),
        source: source ? SourceParser.generateFromJSON(source, project) : null,
        external,
        classes: classes.map((json) => ClassParser.generateFromJSON(json, project)),
        constants: constants.map((json) => ConstantParser.generateFromJSON(json, project)),
        enums: enums.map((json) => EnumParser.generateFromJSON(json, project)),
        functions: functions.map((json) => FunctionParser.generateFromJSON(json, project)),
        interfaces: interfaces.map((json) => InterfaceParser.generateFromJSON(json, project)),
        namespaces: namespaces.map((json) => NamespaceParser.generateFromJSON(json, project)),
        typeAliases: typeAliases.map((json) => TypeAliasParser.generateFromJSON(json, project))
      },
      project
    );
  }
}

export namespace NamespaceParser {
  export interface Data extends Parser.Data {
    /**
     * Whether this namespace is external.
     * @since 1.0.0
     */
    external: boolean;

    /**
     * The class parsers of this namespace.
     * @since 1.0.0
     */
    classes: ClassParser[];

    /**
     * The constant parsers of this namespace.
     * @since 1.0.0
     */
    constants: ConstantParser[];

    /**
     * The enum parsers of this namespace.
     * @since 1.0.0
     */
    enums: EnumParser[];

    /**
     * The function parsers of this namespace.
     * @since 1.0.0
     */
    functions: FunctionParser[];

    /**
     * The interface parsers of this namespace.
     * @since 1.0.0
     */
    interfaces: InterfaceParser[];

    /**
     * The namespace parsers of this namespace.
     * @since 1.0.0
     */
    namespaces: NamespaceParser[];

    /**
     * The type alias parsers of this namespace.
     * @since 1.0.0
     */
    typeAliases: TypeAliasParser[];
  }

  export interface JSON extends Parser.JSON {
    /**
     * Whether this namespace is external.
     * @since 1.0.0
     */
    external: boolean;

    /**
     * The class parsers of this namespace in a JSON compatible format.
     * @since 1.0.0
     */
    classes: ClassParser.JSON[];

    /**
     * The constant parsers of this namespace in a JSON compatible format.
     * @since 1.0.0
     */
    constants: ConstantParser.JSON[];

    /**
     * The enum parsers of this namespace in a JSON compatible format.
     * @since 1.0.0
     */
    enums: EnumParser.JSON[];

    /**
     * The function parsers of this namespace in a JSON compatible format.
     * @since 1.0.0
     */
    functions: FunctionParser.JSON[];

    /**
     * The interface parsers of this namespace in a JSON compatible format.
     * @since 1.0.0
     */
    interfaces: InterfaceParser.JSON[];

    /**
     * The namespace parsers of this namespace in a JSON compatible format.
     * @since 1.0.0
     */
    namespaces: JSON[];

    /**
     * The type alias parsers of this namespace in a JSON compatible format.
     * @since 1.0.0
     */
    typeAliases: TypeAliasParser.JSON[];
  }
}
