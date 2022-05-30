import { TypeParser } from './TypeParser';

export class TypeOperatorTypeParser implements TypeParser {
  public readonly kind = TypeParser.Kind.TypeOperator;

  public readonly operator: TypeOperatorTypeParser.Operator;

  public readonly type: TypeParser;

  public constructor(operator: TypeOperatorTypeParser.Operator, type: TypeParser) {
    this.operator = operator;
    this.type = type;
  }

  public toJSON(): TypeOperatorTypeParser.JSON {
    return {
      kind: this.kind,
      operator: this.operator,
      type: this.type.toJSON()
    };
  }

  public toString(): string {
    return `${this.operator} ${this.type.toString()}`;
  }
}

export namespace TypeOperatorTypeParser {
  export interface JSON extends TypeParser.JSON {
    operator: Operator;

    type: TypeParser.JSON;
  }

  export enum Operator {
    KeyOf = 'keyof',

    Unique = 'unique',

    Readonly = 'readonly'
  }
}
