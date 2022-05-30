import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import type { ProjectParser } from '../ProjectParser';
import { TypeParser } from '../type-parsers';
import { ParameterParser } from './ParameterParser';
import { TypeParameterParser } from './TypeParameterParser';

export class SignatureParser {
  public readonly project: ProjectParser;

  public readonly id: number;

  public readonly name: string;

  public readonly typeParameters: TypeParameterParser[];

  public readonly parameters: ParameterParser[];

  public readonly returnType: TypeParser;

  public constructor(data: SignatureParser.Data, project: ProjectParser) {
    const { id, name, typeParameters, parameters, returnType } = data;

    this.id = id;
    this.name = name;
    this.typeParameters = typeParameters;
    this.parameters = parameters;
    this.returnType = returnType;

    this.project = project;
  }

  public toJSON(): SignatureParser.JSON {
    return {
      id: this.id,
      name: this.name,
      typeParameters: this.typeParameters.map((typeParameter) => typeParameter.toJSON()),
      parameters: this.parameters.map((parameter) => parameter.toJSON()),
      returnType: this.returnType.toJSON()
    };
  }

  public static generate(reflection: JSONOutput.SignatureReflection, project: ProjectParser): SignatureParser {
    const { kind, kindString = 'Unknown', id, name, typeParameter: typeParameters = [], parameters = [], type } = reflection;

    if (kind !== ReflectionKind.CallSignature) {
      throw new Error(`Expected Call Signature (${ReflectionKind.CallSignature}), but received ${kindString} (${kind})`);
    }

    return new SignatureParser(
      {
        id,
        name,
        typeParameters: typeParameters.map((typeParameter) => TypeParameterParser.generate(typeParameter, project)),
        parameters: parameters.map((parameter) => ParameterParser.generate(parameter, project)),
        returnType: TypeParser.generate(type!, project)
      },
      project
    );
  }
}

export namespace SignatureParser {
  export interface Data {
    id: number;

    name: string;

    typeParameters: TypeParameterParser[];

    parameters: ParameterParser[];

    returnType: TypeParser;
  }

  export interface JSON {
    id: number;

    name: string;

    typeParameters: TypeParameterParser.JSON[];

    parameters: ParameterParser.JSON[];

    returnType: TypeParser.JSON;
  }
}
