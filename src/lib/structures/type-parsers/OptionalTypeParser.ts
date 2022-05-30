import { TypeParser } from './TypeParser';

export class OptionalTypeParser implements TypeParser {
  public readonly kind = TypeParser.Kind.Optional;

  public readonly type: TypeParser;

  public constructor(type: TypeParser) {
    this.type = type;
  }

  public toJSON(): OptionalTypeParser.JSON {
    return {
      kind: this.kind,
      type: this.type.toJSON()
    };
  }

  public toString(): string {
    return `${TypeParser.wrap(this.type, TypeParser.BindingPowers[TypeParser.Kind.Optional])}?`;
  }
}

export namespace OptionalTypeParser {
  export interface JSON extends TypeParser.JSON {
    type: TypeParser.JSON;
  }
}
