import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../types';
import { CommentParser, SourceParser, TypeParameterParser } from './misc/';
import { Parser } from './Parser';
import type { ProjectParser } from './ProjectParser';
import { TypeParser } from './type-parsers';

export class TypeAliasParser extends Parser {
  public readonly external: boolean;

  public readonly typeParameters: TypeParameterParser[];

  public readonly type: TypeParser;

  public constructor(data: TypeAliasParser.Data, project: ProjectParser) {
    super(data, project);

    const { external, typeParameters, type } = data;

    this.external = external;
    this.typeParameters = typeParameters;
    this.type = type;
  }

  public toJSON(): TypeAliasParser.JSON {
    return {
      ...super.toJSON(),
      external: this.external,
      typeParameters: this.typeParameters.map((typeParameter) => typeParameter.toJSON()),
      type: this.type.toJSON()
    };
  }

  public static generate(reflection: JSONOutput.DeclarationReflection, project: ProjectParser): TypeAliasParser {
    const { kind, kindString = 'Unknown', id, name, comment = {}, sources = [], flags, type, typeParameter: typeParameters = [] } = reflection;

    if (kind !== ReflectionKind.TypeAlias) throw new Error(`Expected TypeAlias (${ReflectionKind.TypeAlias}), but received ${kindString} (${kind})`);

    return new TypeAliasParser(
      {
        id,
        name,
        comment: CommentParser.generate(comment, project),
        source: sources.length ? SourceParser.generate(sources[0], project) : null,
        external: Boolean(flags.isExternal),
        typeParameters: typeParameters.map((typeParameter) => TypeParameterParser.generate(typeParameter, project)),
        type: TypeParser.generate(type!, project)
      },
      project
    );
  }
}

export namespace TypeAliasParser {
  export interface Data extends Parser.Data {
    external: boolean;

    typeParameters: TypeParameterParser[];

    type: TypeParser;
  }

  export interface JSON extends Parser.JSON {
    external: boolean;

    typeParameters: TypeParameterParser.JSON[];

    type: TypeParser.JSON;
  }
}
