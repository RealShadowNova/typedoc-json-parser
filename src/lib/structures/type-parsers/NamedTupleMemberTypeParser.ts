import { TypeParser } from './TypeParser';

export class NamedTupleMemberTypeParser implements TypeParser {
  public readonly kind = TypeParser.Kind.NamedTupleMember;

  public readonly name: string;

  public readonly type: TypeParser;

  public readonly optional: boolean;

  public constructor(name: string, type: TypeParser, optional: boolean) {
    this.name = name;
    this.type = type;
    this.optional = optional;
  }

  public toJSON(): NamedTupleMemberTypeParser.JSON {
    return {
      kind: this.kind,
      name: this.name,
      type: this.type.toJSON(),
      optional: this.optional
    };
  }

  public toString(): string {
    return `${this.name}${this.optional ? '?' : ''}: ${this.type.toString()}`;
  }
}

export namespace NamedTupleMemberTypeParser {
  export interface JSON extends TypeParser.JSON {
    name: string;

    type: TypeParser.JSON;

    optional: boolean;
  }
}
