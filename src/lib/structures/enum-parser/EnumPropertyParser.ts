import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import { CommentParser, SourceParser } from '../misc';
import { Parser } from '../Parser';
import type { ProjectParser } from '../ProjectParser';

export class EnumPropertyParser extends Parser {
  public readonly value: string;

  public constructor(data: EnumPropertyParser.Data, project: ProjectParser) {
    super(data, project);

    const { value } = data;

    this.value = value;
  }

  public toJSON(): EnumPropertyParser.JSON {
    return {
      ...super.toJSON(),
      value: this.value
    };
  }

  public static generate(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): EnumPropertyParser {
    const { kind, kindString = 'Unknown', id, name, comment = {}, sources = [], defaultValue } = reflection;

    if (kind !== ReflectionKind.EnumMember) {
      throw new Error(`Expected EnumMember (${ReflectionKind.EnumMember}), but received ${kindString} (${kind})`);
    }

    return new EnumPropertyParser(
      {
        id,
        name,
        comment: CommentParser.generate(comment, project),
        source: sources.length ? SourceParser.generate(sources[0], project) : null,
        value: defaultValue!
      },
      project
    );
  }
}

export namespace EnumPropertyParser {
  export interface Data extends Parser.Data {
    value: string;
  }

  export interface JSON extends Parser.JSON {
    value: string;
  }
}
