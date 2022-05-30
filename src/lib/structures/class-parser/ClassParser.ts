import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { CommentParser, SourceParser } from '../misc';
import { Parser } from '../Parser';
import type { ProjectParser } from '../ProjectParser';
import { TypeParser } from '../type-parsers';
import { ClassMethodParser } from './ClassMethodParser';
import { ClassPropertyParser } from './ClassPropertyParser';

export class ClassParser extends Parser {
  public readonly external: boolean;

  public readonly abstract: boolean;

  public readonly extendsType: TypeParser | null;

  public readonly implementsType: TypeParser[];

  public readonly properties: ClassPropertyParser[];

  public readonly methods: ClassMethodParser[];

  public constructor(data: ClassParser.Data, project: ProjectParser) {
    super(data, project);

    const { external, abstract, extendsType, implementsType, properties, methods } = data;

    this.external = external;
    this.abstract = abstract;
    this.extendsType = extendsType;
    this.implementsType = implementsType;
    this.properties = properties;
    this.methods = methods;
  }

  public toJSON(): ClassParser.JSON {
    return {
      ...super.toJSON(),
      external: this.external,
      abstract: this.abstract,
      extendsType: this.extendsType ? this.extendsType.toJSON() : null,
      implementsType: this.implementsType.map((implementsType) => implementsType.toJSON()),
      properties: this.properties,
      methods: this.methods
    };
  }

  public static generate(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): ClassParser {
    const {
      kind,
      kindString = 'Unknown',
      id,
      name,
      comment = {},
      sources = [],
      flags,
      children = [],
      extendedTypes = [],
      implementedTypes = []
    } = reflection;

    if (kind !== ReflectionKind.Class) throw new Error(`Expected Project (${ReflectionKind.Project}), but received ${kindString} (${kind})`);

    const properties = children
      .filter((child) => child.kind === ReflectionKind.Property || (child.kind === ReflectionKind.Accessor && child.getSignature))
      .map((child) => ClassPropertyParser.generate(child, project));
    const methods = children.filter((child) => child.kind === ReflectionKind.Method).map((child) => ClassMethodParser.generate(child, project));

    return new ClassParser(
      {
        id,
        name,
        comment: CommentParser.generate(comment, project),
        source: sources.length ? SourceParser.generate(sources[0], project) : null,
        external: Boolean(flags.isExternal),
        abstract: Boolean(flags.isAbstract),
        extendsType: extendedTypes.length ? TypeParser.generate(extendedTypes[0], project) : null,
        implementsType: implementedTypes.map((implementedType) => TypeParser.generate(implementedType, project)),
        properties,
        methods
      },
      project
    );
  }
}

export namespace ClassParser {
  export interface Data extends Parser.Data {
    external: boolean;

    abstract: boolean;

    extendsType: TypeParser | null;

    implementsType: TypeParser[];

    properties: ClassPropertyParser[];

    methods: ClassMethodParser[];
  }

  export interface JSON extends Parser.JSON {
    external: boolean;

    abstract: boolean;

    extendsType: TypeParser.JSON | null;

    implementsType: TypeParser.JSON[];

    properties: ClassPropertyParser.JSON[];

    methods: ClassMethodParser.JSON[];
  }

  export enum Accessibility {
    Public = 'public',

    Protected = 'protected',

    Private = 'private'
  }
}
