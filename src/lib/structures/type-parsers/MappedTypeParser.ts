import { TypeParser } from './TypeParser';

export class MappedTypeParser implements TypeParser {
  public readonly kind = TypeParser.Kind.Mapped;

  public readonly parameter: string;

  public readonly parameterType: TypeParser;

  public readonly nameType: TypeParser | null;

  public readonly templateType: TypeParser;

  public readonly readonly: MappedTypeParser.Modifier | null;

  public readonly optional: MappedTypeParser.Modifier | null;

  public constructor(
    parameter: string,
    parameterType: TypeParser,
    nameType: TypeParser | null,
    templateType: TypeParser,
    readonly: MappedTypeParser.Modifier | null,
    optional: MappedTypeParser.Modifier | null
  ) {
    this.parameter = parameter;
    this.parameterType = parameterType;
    this.nameType = nameType;
    this.templateType = templateType;
    this.readonly = readonly;
    this.optional = optional;
  }

  public toJSON(): MappedTypeParser.JSON {
    return {
      kind: this.kind,
      parameter: this.parameter,
      parameterType: this.parameterType.toJSON(),
      nameType: this.nameType ? this.nameType.toJSON() : null,
      templateType: this.templateType.toJSON(),
      readonly: this.readonly,
      optional: this.optional
    };
  }

  public toString(): string {
    const readonly =
      this.readonly === MappedTypeParser.Modifier.Add ? 'readonly' : this.readonly === MappedTypeParser.Modifier.Remove ? '-readonly' : '';
    const optional = this.optional === MappedTypeParser.Modifier.Add ? '?' : this.optional === MappedTypeParser.Modifier.Remove ? '-?' : '';

    return `{ ${readonly}[${this.parameter} in ${this.parameterType.toString()}]${optional}: ${this.templateType.toString()} }`;
  }
}

export namespace MappedTypeParser {
  export interface JSON extends TypeParser.JSON {
    parameter: string;

    parameterType: TypeParser.JSON;

    nameType: TypeParser.JSON | null;

    templateType: TypeParser.JSON;

    readonly: Modifier | null;

    optional: Modifier | null;
  }

  export enum Modifier {
    Add = '+',

    Remove = '-'
  }
}
