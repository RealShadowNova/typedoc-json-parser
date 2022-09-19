import type { JSONOutput } from 'typedoc';
import { ReflectionKind } from '../../types';
import type { ProjectParser } from '../ProjectParser';
import { TypeParser } from '../type-parsers';
import { CommentParser } from './CommentParser';
import { ParameterParser } from './ParameterParser';
import { TypeParameterParser } from './TypeParameterParser';

/**
 * Parses data from a signature reflection.
 * @since 1.0.0
 */
export class SignatureParser {
  /**
   * The project this parser belongs to.
   * @since 1.0.0
   */
  public readonly project: ProjectParser;

  /**
   * The identifier of this parser.
   * @since 1.0.0
   */
  public readonly id: number;

  /**
   * The name of this signature.
   * @since 1.0.0
   */
  public readonly name: string;

  /**
   * The comment parser of this signature.
   * @since 2.3.0
   */
  public readonly comment: CommentParser;

  /**
   * The type parameters of this signature.
   * @since 1.0.0
   */
  public readonly typeParameters: TypeParameterParser[];

  /**
   * The parameters of this signature.
   * @since 1.0.0
   */
  public readonly parameters: ParameterParser[];

  /**
   * The return type of this signature.
   * @since 1.0.0
   */
  public readonly returnType: TypeParser;

  public constructor(data: SignatureParser.Data, project: ProjectParser) {
    const { id, name, comment, typeParameters, parameters, returnType } = data;

    this.id = id;
    this.name = name;
    this.comment = comment;
    this.typeParameters = typeParameters;
    this.parameters = parameters;
    this.returnType = returnType;

    this.project = project;
  }

  /**
   * Converts this parser to a JSON compatible format.
   * @since 1.0.0
   * @returns The JSON compatible format of this parser.
   */
  public toJSON(): SignatureParser.JSON {
    return {
      id: this.id,
      name: this.name,
      comment: this.comment.toJSON(),
      typeParameters: this.typeParameters.map((typeParameter) => typeParameter.toJSON()),
      parameters: this.parameters.map((parameter) => parameter.toJSON()),
      returnType: this.returnType.toJSON()
    };
  }

  /**
   * Generates a new {@link SignatureParser} instance from the given data.
   * @since 1.0.0
   * @param reflection The reflection to generate the parser from.
   * @param project The project this parser belongs to.
   * @returns The generated parser.
   */
  public static generateFromTypeDoc(reflection: JSONOutput.SignatureReflection, project: ProjectParser): SignatureParser {
    const {
      kind,
      kindString = 'Unknown',
      id,
      name,
      comment = { summary: [] },
      typeParameter: typeParameters = [],
      parameters = [],
      type
    } = reflection;

    if (kind !== ReflectionKind.CallSignature) {
      throw new Error(`Expected Call Signature (${ReflectionKind.CallSignature}), but received ${kindString} (${kind})`);
    }

    return new SignatureParser(
      {
        id,
        name,
        comment: CommentParser.generateFromTypeDoc(comment, project),
        typeParameters: typeParameters.map((typeParameter) => TypeParameterParser.generateFromTypeDoc(typeParameter, project)),
        parameters: parameters.map((parameter) => ParameterParser.generateFromTypeDoc(parameter, project)),
        returnType: TypeParser.generateFromTypeDoc(type!, project)
      },
      project
    );
  }

  public static generateFromJSON(json: SignatureParser.JSON, project: ProjectParser): SignatureParser {
    const { id, name, comment, typeParameters, parameters, returnType } = json;

    return new SignatureParser(
      {
        id,
        name,
        comment: CommentParser.generateFromJSON(comment, project),
        typeParameters: typeParameters.map((typeParameter) => TypeParameterParser.generateFromJSON(typeParameter, project)),
        parameters: parameters.map((parameter) => ParameterParser.generateFromJSON(parameter, project)),
        returnType: TypeParser.generateFromJSON(returnType, project)
      },
      project
    );
  }
}

export namespace SignatureParser {
  export interface Data {
    /**
     * The identifier of this parser.
     * @since 1.0.0
     */
    id: number;

    /**
     * The name of this signature.
     * @since 1.0.0
     */
    name: string;

    /**
     * The comment of this signature.
     * @since 2.3.0
     */
    comment: CommentParser;

    /**
     * The type parameters of this signature.
     * @since 1.0.0
     */
    typeParameters: TypeParameterParser[];

    /**
     * The parameters of this signature.
     * @since 1.0.0
     */
    parameters: ParameterParser[];

    /**
     * The return type of this signature.
     * @since 1.0.0
     */
    returnType: TypeParser;
  }

  export interface JSON {
    /**
     * The identifier of this parser.
     * @since 1.0.0
     */
    id: number;

    /**
     * The name of this signature.
     * @since 1.0.0
     */
    name: string;

    /**
     * The comment of this signature.
     * @since 2.3.0
     */
    comment: CommentParser.JSON;

    /**
     * The type parameters of this signature in a JSON compatible format.
     * @since 1.0.0
     */
    typeParameters: TypeParameterParser.JSON[];

    /**
     * The parameters of this signature in a JSON compatible format.
     * @since 1.0.0
     */
    parameters: ParameterParser.JSON[];

    /**
     * The return type of this signature in a JSON compatible format.
     * @since 1.0.0
     */
    returnType: TypeParser.JSON;
  }
}
