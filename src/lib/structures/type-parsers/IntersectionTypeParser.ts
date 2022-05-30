import { TypeParser } from './TypeParser';

export class IntersectionTypeParser implements TypeParser {
  public readonly kind = TypeParser.Kind.Intersection;

  public readonly types: TypeParser[];

  public constructor(types: TypeParser[]) {
    this.types = types;
  }

  public toJSON(): IntersectionTypeParser.JSON {
    return {
      kind: this.kind,
      types: this.types.map((type) => type.toJSON())
    };
  }

  public toString(): string {
    return this.types.map((type) => TypeParser.wrap(type, TypeParser.BindingPowers[TypeParser.Kind.Intersection])).join(' & ');
  }
}

export namespace IntersectionTypeParser {
  export interface JSON extends TypeParser.JSON {
    types: TypeParser.JSON[];
  }
}
