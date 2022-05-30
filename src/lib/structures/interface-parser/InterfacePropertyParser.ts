import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { CommentParser, SourceParser } from '../misc';
import { Parser } from '../Parser';
import type { ProjectParser } from '../ProjectParser';
import { TypeParser } from '../type-parsers';

export class InterfacePropertyParser extends Parser {
  public readonly type: TypeParser;

  public constructor(data: InterfacePropertyParser.Data, project: ProjectParser) {
    super(data, project);

    const { type } = data;

    this.type = type;
  }

  public toJSON(): InterfacePropertyParser.JSON {
    return {
      ...super.toJSON(),
      type: this.type.toJSON()
    };
  }

  public static generate(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): InterfacePropertyParser {
    const { kind, kindString = 'Unknown', id, name, comment = {}, sources = [], type } = reflection;

    if (kind !== ReflectionKind.Property) throw new Error(`Expected Property (${ReflectionKind.Property}), but received ${kindString} (${kind})`);

    return new InterfacePropertyParser(
      {
        id,
        name,
        comment: CommentParser.generate(comment, project),
        source: sources.length ? SourceParser.generate(sources[0], project) : null,
        type: TypeParser.generate(type!, project)
      },
      project
    );
  }
}

export namespace InterfacePropertyParser {
  export interface Data extends Parser.Data {
    type: TypeParser;
  }

  export interface JSON extends Parser.JSON {
    type: TypeParser.JSON;
  }
}
