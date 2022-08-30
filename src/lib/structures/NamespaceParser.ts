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
