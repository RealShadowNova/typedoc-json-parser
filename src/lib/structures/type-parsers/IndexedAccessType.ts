import { TypeParser } from './TypeParser';

export class IndexedAccessTypeParser implements TypeParser {
  public readonly kind = TypeParser.Kind.IndexedAccess;

  public readonly objectType: TypeParser;

  public readonly indexType: TypeParser;

  public constructor(objectType: TypeParser, indexType: TypeParser) {
    this.objectType = objectType;
    this.indexType = indexType;
  }

  public toJSON(): IndexedAccessTypeParser.JSON {
    return {
      kind: this.kind,
      objectType: this.objectType.toJSON(),
      indexType: this.indexType.toJSON()
    };
  }

  public toString(): string {
    return `${this.objectType.toString()}[${this.indexType.toString()}]`;
  }
}

export namespace IndexedAccessTypeParser {
  export interface JSON extends TypeParser.JSON {
    objectType: TypeParser.JSON;

    indexType: TypeParser.JSON;
  }
}
