import { TypeParser } from './TypeParser';

export class TupleTypeParser implements TypeParser {
  public readonly kind = TypeParser.Kind.Tuple;

  public readonly types: TypeParser[];

  public constructor(types: TypeParser[]) {
    this.types = types;
  }

  public toJSON(): TupleTypeParser.JSON {
    return {
      kind: this.kind,
      types: this.types.map((type) => type.toJSON())
    };
  }

  public toString(): string {
    return `[${this.types.map((type) => type.toString()).join(', ')}]`;
  }
}

export namespace TupleTypeParser {
  export interface JSON extends TypeParser.JSON {
    types: TypeParser.JSON[];
  }
}
