import { TypeParser } from './TypeParser';

export class InferredTypeParser implements TypeParser {
  public readonly kind = TypeParser.Kind.Inferred;

  public readonly type: string;

  public constructor(type: string) {
    this.type = type;
  }

  public toJSON(): InferredTypeParser.JSON {
    return {
      kind: this.kind,
      type: this.type
    };
  }

  public toString(): string {
    return `infer ${this.type}`;
  }
}

export namespace InferredTypeParser {
  export interface JSON extends TypeParser.JSON {
    type: string;
  }
}
