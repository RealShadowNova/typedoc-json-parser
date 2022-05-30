import { TypeParser } from './TypeParser';

export class IntrinsicTypeParser implements TypeParser {
  public readonly kind = TypeParser.Kind.Intrinsic;

  public readonly type: string;

  public constructor(type: string) {
    this.type = type;
  }

  public toJSON(): IntrinsicTypeParser.JSON {
    return {
      kind: this.kind,
      type: this.type
    };
  }

  public toString(): string {
    return this.type;
  }
}

export namespace IntrinsicTypeParser {
  export interface JSON extends TypeParser.JSON {
    type: string;
  }
}
