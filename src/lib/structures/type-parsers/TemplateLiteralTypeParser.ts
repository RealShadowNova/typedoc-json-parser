import { TypeParser } from './TypeParser';

export class TemplateLiteralTypeParser implements TypeParser {
  public readonly kind = TypeParser.Kind.TemplateLiteral;

  public readonly head: string;

  public readonly tail: TemplateLiteralTypeParser.Tail[];

  public constructor(head: string, tail: TemplateLiteralTypeParser.Tail[]) {
    this.head = head;
    this.tail = tail;
  }

  public toJSON(): TemplateLiteralTypeParser.JSON {
    return {
      kind: this.kind,
      head: this.head,
      tail: this.tail.map((tail) => ({ type: tail.type.toJSON(), text: tail.text }))
    };
  }

  public toString(): string {
    return `\`${this.head}${this.tail.map((tail) => `\${${tail.type.toString()}}${tail.text}`).join('')}\``;
  }
}

export namespace TemplateLiteralTypeParser {
  export interface JSON extends TypeParser.JSON {
    head: string;

    tail: Tail.JSON[];
  }

  export interface Tail {
    type: TypeParser;

    text: string;
  }

  export namespace Tail {
    export interface JSON {
      type: TypeParser.JSON;

      text: string;
    }
  }
}
