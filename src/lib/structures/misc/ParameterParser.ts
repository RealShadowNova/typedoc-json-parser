import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import type { ProjectParser } from '../ProjectParser';
import { TypeParser } from '../type-parsers';

export class ParameterParser {
  public readonly project: ProjectParser;

  public readonly id: number;

  public readonly name: string;

  public readonly type: TypeParser;

  public constructor(data: ParameterParser.Data, project: ProjectParser) {
    const { id, name, type } = data;

    this.id = id;
    this.name = name;
    this.type = type;

    this.project = project;
  }

  public toJSON(): ParameterParser.JSON {
    return {
      id: this.id,
      name: this.name,
      type: this.type.toJSON()
    };
  }

  public static generate(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): ParameterParser {
    const { kind, kindString = 'Unknown', id, name, type } = reflection;

    if (kind !== ReflectionKind.Parameter) {
      throw new Error(`Expected Parameter (${ReflectionKind.Parameter}), but received ${kindString} (${kind})`);
    }

    return new ParameterParser(
      {
        id,
        name,
        type: TypeParser.generate(type!, project)
      },
      project
    );
  }
}

export namespace ParameterParser {
  export interface Data {
    id: number;

    name: string;

    type: TypeParser;
  }

  export interface JSON {
    id: number;

    name: string;

    type: TypeParser.JSON;
  }
}
