import type { ReferenceTypeParser } from './ReferenceTypeParser';
import { TypeParser } from './TypeParser';

export class QueryTypeParser implements TypeParser {
  public readonly kind = TypeParser.Kind.Query;

  public readonly query: ReferenceTypeParser;

  public constructor(query: ReferenceTypeParser) {
    this.query = query;
  }

  public toJSON(): QueryTypeParser.JSON {
    return {
      kind: this.kind,
      query: this.query.toJSON()
    };
  }

  public toString(): string {
    return `typeof ${this.query.toString()}`;
  }
}

export namespace QueryTypeParser {
  export interface JSON extends TypeParser.JSON {
    query: ReferenceTypeParser.JSON;
  }
}
