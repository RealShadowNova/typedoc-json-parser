import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import type { ProjectParser } from '../ProjectParser';
import { TypeParser } from '../type-parsers';

export class TypeParameterParser {
  public readonly project: ProjectParser;

  public readonly id: number;

  public readonly name: string;

  public readonly type: TypeParser | null;

  public readonly default: TypeParser | null;

  public constructor(data: TypeParameterParser.Data, project: ProjectParser) {
    const { id, name, type, default: defaultValue } = data;

    this.id = id;
    this.name = name;
    this.type = type;
    this.default = defaultValue;

    this.project = project;
  }

  public toJSON(): TypeParameterParser.JSON {
    return {
      id: this.id,
      name: this.name,
      type: this.type ? this.type.toJSON() : null,
      default: this.default ? this.default.toJSON() : null
    };
  }

  public static generate(reflection: JSONOutput.TypeParameterReflection, project: ProjectParser): TypeParameterParser {
    const { kind, kindString = 'Unknown', id, name, type, default: _default } = reflection;

    if (kind !== ReflectionKind.TypeParameter) {
      throw new Error(`Expected TypeParameter (${ReflectionKind.TypeParameter}), but received ${kindString} (${kind})`);
    }

    return new TypeParameterParser(
      {
        id,
        name,
        type: type ? TypeParser.generate(type, project) : null,
        default: _default ? TypeParser.generate(_default, project) : null
      },
      project
    );
  }
}

export namespace TypeParameterParser {
  export interface Data {
    id: number;

    name: string;

    type: TypeParser | null;

    default: TypeParser | null;
  }

  export interface JSON {
    id: number;

    name: string;

    type: TypeParser.JSON | null;

    default: TypeParser.JSON | null;
  }
}
