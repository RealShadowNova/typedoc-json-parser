import { TypeParser } from './TypeParser';

export class RestTypeParser implements TypeParser {
  public readonly kind = TypeParser.Kind.Rest;

  public readonly type: TypeParser;

  public constructor(type: TypeParser) {
    this.type = type;
  }

  public toJSON(): RestTypeParser.JSON {
    return {
      kind: this.kind,
      type: this.type.toJSON()
    };
  }

  public toString(): string {
    return `...${TypeParser.wrap(this.type, TypeParser.BindingPowers[TypeParser.Kind.Rest])}`;
  }
}

export namespace RestTypeParser {
  export interface JSON extends TypeParser.JSON {
    type: TypeParser.JSON;
  }
}
