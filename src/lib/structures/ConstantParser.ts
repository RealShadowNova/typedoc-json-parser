import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../types';
import { CommentParser, SourceParser } from './misc';
import { Parser } from './Parser';
import type { ProjectParser } from './ProjectParser';
import { TypeParser } from './type-parsers';

export class ConstantParser extends Parser {
  public readonly external: boolean;

  public readonly type: TypeParser;

  public readonly value: string;

  public constructor(data: ConstantParser.Data, project: ProjectParser) {
    super(data, project);

    const { external, type, value } = data;

    this.external = external;
    this.type = type;
    this.value = value;
  }

  public toJSON(): ConstantParser.JSON {
    return {
      ...super.toJSON(),
      external: this.external,
      type: this.type.toJSON(),
      value: this.value
    };
  }

  public static generate(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): ConstantParser {
    const { kind, kindString = 'Unknown', id, name, comment = {}, sources = [], flags, type, defaultValue } = reflection;

    if (kind !== ReflectionKind.Variable) throw new Error(`Expected Variable (${ReflectionKind.Variable}), but received ${kindString} (${kind})`);

    return new ConstantParser(
      {
        id,
        name,
        comment: CommentParser.generate(comment, project),
        source: sources.length ? SourceParser.generate(sources[0], project) : null,
        external: Boolean(flags.isExternal),
        type: TypeParser.generate(type!, project),
        value: defaultValue!
      },
      project
    );
  }
}

export namespace ConstantParser {
  export interface Data extends Parser.Data {
    external: boolean;

    type: TypeParser;

    value: string;
  }

  export interface JSON extends Parser.JSON {
    external: boolean;

    type: TypeParser.JSON;

    value: string;
  }
}
