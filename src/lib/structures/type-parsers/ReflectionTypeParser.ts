import type { JSONOutput } from 'typedoc';
import { TypeParser } from './TypeParser';

export class ReflectionTypeParser implements TypeParser {
  public readonly kind = TypeParser.Kind.Reflection;

  public reflection: JSONOutput.DeclarationReflection | null;

  public constructor(reflection: JSONOutput.DeclarationReflection | null) {
    this.reflection = reflection;
  }

  public toJSON(): ReflectionTypeParser.JSON {
    return {
      kind: this.kind,
      reflection: this.reflection
    };
  }

  public toString(): string {
    return !this.reflection?.children && this.reflection?.signatures ? 'Function' : 'Object';
  }
}

export namespace ReflectionTypeParser {
  export interface JSON extends TypeParser.JSON {
    reflection: JSONOutput.DeclarationReflection | null;
  }
}
