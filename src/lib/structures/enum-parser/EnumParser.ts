import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { CommentParser, SourceParser } from '../misc';
import { Parser } from '../Parser';
import type { ProjectParser } from '../ProjectParser';
import { EnumPropertyParser } from './EnumPropertyParser';

export class EnumParser extends Parser {
  public readonly external: boolean;

  public readonly properties: EnumPropertyParser[];

  public constructor(data: EnumParser.Data, project: ProjectParser) {
    super(data, project);

    const { external, properties } = data;

    this.external = external;
    this.properties = properties;
  }

  public toJSON(): EnumParser.JSON {
    return {
      ...super.toJSON(),
      external: this.external,
      properties: this.properties
    };
  }

  public static generate(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): EnumParser {
    const { kind, kindString = 'Unknown', id, name, comment = {}, sources = [], flags, children = [] } = reflection;

    if (kind !== ReflectionKind.Enum) throw new Error(`Expected Enum (${ReflectionKind.Enum}), but received ${kindString} (${kind})`);

    const properties = children
      .filter((child) => child.kind === ReflectionKind.EnumMember)
      .map((child) => EnumPropertyParser.generate(child, project));

    return new EnumParser(
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

export namespace EnumParser {
  export interface Data extends Parser.Data {
    external: boolean;

    properties: EnumPropertyParser[];
  }

  export interface JSON extends Parser.JSON {
    external: boolean;

    properties: EnumPropertyParser.JSON[];
  }
}
