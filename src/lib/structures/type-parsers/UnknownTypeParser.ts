import { TypeParser } from './TypeParser';

export class UnknownTypeParser implements TypeParser {
  public readonly kind = TypeParser.Kind.Unknown;

  public readonly name: string;

  public constructor(name: string) {
    this.name = name;
  }

  public toJSON(): UnknownTypeParser.JSON {
    return {
      kind: this.kind,
      name: this.name
    };
  }

  public toString(): string {
    return this.name;
  }
}

export namespace UnknownTypeParser {
  export interface JSON extends TypeParser.JSON {
    name: string;
  }
}
