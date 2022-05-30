import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { CommentParser, SourceParser } from '../misc';
import { Parser } from '../Parser';
import type { ProjectParser } from '../ProjectParser';
import { InterfacePropertyParser } from './InterfacePropertyParser';

export class InterfaceParser extends Parser {
  public readonly external: boolean;

  public readonly properties: InterfacePropertyParser[];

  public constructor(data: InterfaceParser.Data, project: ProjectParser) {
    super(data, project);

    const { external, properties } = data;

    this.external = external;
    this.properties = properties;
  }

  public toJSON(): InterfaceParser.JSON {
    return {
      ...super.toJSON(),
      external: this.external,
      properties: this.properties.map((parser) => parser.toJSON())
    };
  }

  public static generate(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): InterfaceParser {
    const { kind, kindString = 'Unknown', id, name, comment = {}, sources = [], flags, children = [] } = reflection;

    if (kind !== ReflectionKind.Interface) throw new Error(`Expected Interface (${ReflectionKind.Interface}), but received ${kindString} (${kind})`);

    const properties = children
      .filter((child) => child.kind === ReflectionKind.Property)
      .map((child) => InterfacePropertyParser.generate(child, project));

    return new InterfaceParser(
      {
        id,
        name,
        comment: CommentParser.generate(comment, project),
        source: sources.length ? SourceParser.generate(sources[0], project) : null,
        external: Boolean(flags.isExternal),
        properties
      },
      project
    );
  }
}

export namespace InterfaceParser {
  export interface Data extends Parser.Data {
    external: boolean;

    properties: InterfacePropertyParser[];
  }

  export interface JSON extends Parser.JSON {
    external: boolean;

    properties: InterfacePropertyParser.JSON[];
  }
}
