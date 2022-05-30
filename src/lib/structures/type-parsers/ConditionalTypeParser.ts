import { TypeParser } from './TypeParser';

export class ConditionalTypeParser implements TypeParser {
  public readonly kind = TypeParser.Kind.Conditional;

  public readonly checkType: TypeParser;

  public readonly extendsType: TypeParser;

  public readonly trueType: TypeParser;

  public readonly falseType: TypeParser;

  public constructor(checkType: TypeParser, extendsType: TypeParser, trueType: TypeParser, falseType: TypeParser) {
    this.checkType = checkType;
    this.extendsType = extendsType;
    this.trueType = trueType;
    this.falseType = falseType;
  }

  public toJSON(): ConditionalTypeParser.JSON {
    return {
      kind: this.kind,
      checkType: this.checkType.toJSON(),
      extendsType: this.extendsType.toJSON(),
      trueType: this.trueType.toJSON(),
      falseType: this.falseType.toJSON()
    };
  }

  public toString(): string {
    return `${TypeParser.wrap(
      this.checkType,
      TypeParser.BindingPowers[TypeParser.Kind.Conditional]
    )} extends ${this.extendsType.toString()} ? ${this.trueType.toString()} : ${this.falseType.toString()}`;
  }
}

export namespace ConditionalTypeParser {
  export interface JSON extends TypeParser.JSON {
    checkType: TypeParser.JSON;

    extendsType: TypeParser.JSON;

    trueType: TypeParser.JSON;

    falseType: TypeParser.JSON;
  }
}
