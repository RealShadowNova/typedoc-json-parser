import { TypeParser } from './TypeParser';

export class LiteralTypeParser implements TypeParser {
  public readonly kind = TypeParser.Kind.Literal;

  public readonly value: string;

  public constructor(value: string) {
    this.value = value;
  }

  public toJSON(): LiteralTypeParser.JSON {
    return {
      kind: this.kind,
      value: this.value
    };
  }

  public toString(): string {
    return this.value;
  }
}

export namespace LiteralTypeParser {
  export interface JSON extends TypeParser.JSON {
    value: string;
  }
}
