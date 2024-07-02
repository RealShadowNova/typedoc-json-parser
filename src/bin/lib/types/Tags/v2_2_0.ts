export namespace v2_2_0 {
  export interface ProjectJson {
    typeDocJsonParserVersion: string;
    id: number;
    name: string;
    version: string | null;
    classes: ClassJson[];
    constants: ConstantJson[];
    enums: EnumJson[];
    functions: FunctionJson[];
    interfaces: InterfaceJson[];
    namespaces: NamespaceJson[];
    typeAliases: TypeAliasJson[];
  }

  export interface ParserJson {
    id: number;
    name: string;
    comment: Misc.CommentJson;
    source: Misc.SourceJson;
  }

  export namespace Misc {
    export interface CommentJson {
      description: string | null;
      blockTags: CommentJson.BlockTagJson[];
      modifierTags: string[];
    }

    export namespace CommentJson {
      export interface BlockTagJson {
        name: string;
        text: string;
      }
    }

    export interface ParameterJson {
      id: number;
      name: string;
      type: TypeJson;
    }

    export interface SignatureJson {
      id: number;
      name: string;
      typeParameters: TypeParameterJson[];
      parameters: ParameterJson[];
      returnType: TypeJson;
    }

    export interface SourceJson {
      line: number;
      file: string;
      path: string;
    }

    export interface TypeParameterJson {
      id: number;
      name: string;
      type: TypeJson | null;
      default: TypeJson | null;
    }
  }

  export interface TypeJson {
    kind: TypeJson.Kind;
  }

  export namespace TypeJson {
    export enum Kind {
      Array = 'array',

      Conditional = 'conditional',

      IndexedAccess = 'indexedAccess',

      Inferred = 'inferred',

      Intersection = 'intersection',

      Intrinsic = 'intrinsic',

      Literal = 'literal',

      Mapped = 'mapped',

      NamedTupleMember = 'namedTupleMember',

      Optional = 'optional',

      Predicate = 'predicate',

      Query = 'query',

      Reference = 'reference',

      Reflection = 'reflection',

      Rest = 'rest',

      TemplateLiteral = 'templateLiteral',

      Tuple = 'tuple',

      TypeOperator = 'typeOperator',

      Union = 'union',

      Unknown = 'unknown'
    }
  }

  export interface ClassJson extends ParserJson {
    external: boolean;
    abstract: boolean;
    extendsType: TypeJson | null;
    implementsType: TypeJson[];
    construct: ClassJson.ConstructorJson;
    properties: ClassJson.PropertyJson[];
    methods: ClassJson.MethodJson[];
  }

  export namespace ClassJson {
    export enum Accessibility {
      Public = 'public',

      Protected = 'protected',

      Private = 'private'
    }

    export interface ConstructorJson extends ParserJson {
      parameters: Misc.ParameterJson[];
    }

    export interface PropertyJson extends ParserJson {
      accessibility: Accessibility;
      abstract: boolean;
      static: boolean;
      readonly: boolean;
      optional: boolean;
      type: TypeJson | null;
    }

    export interface MethodJson extends ParserJson {
      accessibility: Accessibility;
      abstract: boolean;
      static: boolean;
      signatures: Misc.SignatureJson[];
    }
  }

  export interface ConstantJson extends ParserJson {
    external: boolean;
    type: TypeJson;
    value: string;
  }

  export interface EnumJson extends ParserJson {
    external: boolean;
    properties: EnumJson.PropertyJson[];
  }

  export namespace EnumJson {
    export interface PropertyJson extends ParserJson {
      value: string;
    }
  }

  export interface FunctionJson extends ParserJson {
    external: boolean;
    signatures: Misc.SignatureJson[];
  }

  export interface InterfaceJson extends ParserJson {
    external: boolean;
    properties: InterfaceJson.PropertyJson[];
  }

  export namespace InterfaceJson {
    export interface PropertyJson extends ParserJson {
      readonly: boolean;
      type: TypeJson;
    }
  }

  export interface NamespaceJson extends ParserJson {
    external: boolean;
    classes: ClassJson[];
    constants: ConstantJson[];
    enums: EnumJson[];
    functions: FunctionJson[];
    interfaces: InterfaceJson[];
    namespaces: NamespaceJson[];
    typeAliases: TypeAliasJson[];
  }

  export interface TypeAliasJson extends ParserJson {
    external: boolean;
    typeParameters: Misc.TypeParameterJson[];
    type: TypeJson;
  }
}

export type { v2_2_0 as v2_2_1 };
