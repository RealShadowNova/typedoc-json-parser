import { TypeParser } from './TypeParser';

export class UnionTypeParser implements TypeParser {
  public readonly kind = TypeParser.Kind.Union;

  public readonly types: TypeParser[];

  public constructor(types: TypeParser[]) {
    this.types = types;
  }

  public toJSON(): UnionTypeParser.JSON {
    return {
      kind: this.kind,
      types: this.types.map((type) => type.toJSON())
    };
  }

  public toString(): string {
    return this.types.map((type) => TypeParser.wrap(type, TypeParser.BindingPowers[TypeParser.Kind.Union])).join(' | ');
  }
}

export namespace UnionTypeParser {
  export interface JSON extends TypeParser.JSON {
    types: TypeParser.JSON[];
  }
}
