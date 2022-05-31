import { TypeParser } from './TypeParser';

export class ArrayTypeParser implements TypeParser {
  public readonly kind = TypeParser.Kind.Array;

  public readonly type: TypeParser;

  public constructor(type: TypeParser) {
    this.type = type;
  }

  public toJSON(): ArrayTypeParser.JSON {
    return {
      kind: this.kind,
      type: this.type.toJSON()
    };
  }

  public toString(): string {
    return `${TypeParser.wrap(this.type, TypeParser.BindingPowers[TypeParser.Kind.Array])}[]`;
  }
}

export namespace ArrayTypeParser {
  export interface JSON extends TypeParser.JSON {
    type: TypeParser.JSON;
  }
}
