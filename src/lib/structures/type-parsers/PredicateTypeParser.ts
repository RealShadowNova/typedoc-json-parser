import { TypeParser } from './TypeParser';

export class PredicateTypeParser implements TypeParser {
  public readonly kind = TypeParser.Kind.Predicate;

  public readonly asserts: boolean;

  public readonly name: string;

  public readonly type: TypeParser | null;

  public constructor(asserts: boolean, name: string, type: TypeParser | null) {
    this.asserts = asserts;
    this.name = name;
    this.type = type;
  }

  public toJSON(): PredicateTypeParser.JSON {
    return {
      kind: this.kind,
      asserts: this.asserts,
      name: this.name,
      type: this.type ? this.type.toJSON() : null
    };
  }

  public toString(): string {
    return this.asserts ? `asserts ${this.name}` : `${this.name} is ${this.type!.toString()}`;
  }
}

export namespace PredicateTypeParser {
  export interface JSON extends TypeParser.JSON {
    asserts: boolean;

    name: string;

    type: TypeParser.JSON | null;
  }
}
