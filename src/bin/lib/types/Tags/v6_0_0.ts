export namespace v6_0_0 {
  export interface ProjectJson {
    typeDocJsonParserVersion: string;
    id: number;
    name: string;
    version: string | null;
    readme: string | null;
    changelog: string | null;
    classes: ClassJson[];
    enums: EnumJson[];
    functions: FunctionJson[];
    interfaces: InterfaceJson[];
    namespaces: NamespaceJson[];
    typeAliases: TypeAliasJson[];
    variables: VariableJson[];
  }

  export interface ParserJson {
    id: number;
    name: string;
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
      comment: CommentJson;
      name: string;
      type: TypeJson;
    }

    export interface SignatureJson {
      id: number;
      comment: CommentJson;
      typeParameters: TypeParameterJson[];
      parameters: ParameterJson[];
      returnType: TypeJson;
    }

    export interface SourceJson {
      line: number;
      file: string;
      path: string;
      url: string | null;
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
    comment: Misc.CommentJson;
    abstract: boolean;
    typeParameters: Misc.TypeParameterJson[];
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
      parentId: number;
      comment: Misc.CommentJson;
      parameters: Misc.ParameterJson[];
    }

    export interface PropertyJson extends ParserJson {
      parentId: number;
      comment: Misc.CommentJson;
      accessibility: Accessibility;
      abstract: boolean;
      static: boolean;
      readonly: boolean;
      optional: boolean;
      type: TypeJson | null;
    }

    export interface MethodJson extends ParserJson {
      parentId: number;
      accessibility: Accessibility;
      abstract: boolean;
      static: boolean;
      signatures: Misc.SignatureJson[];
    }
  }

  export interface EnumJson extends ParserJson {
    external: boolean;
    comment: Misc.CommentJson;
    members: EnumJson.MemberJson[];
  }

  export namespace EnumJson {
    export interface MemberJson extends ParserJson {
      parentId: number;
      comment: Misc.CommentJson;
      value: string;
    }
  }

  export interface FunctionJson extends ParserJson {
    external: boolean;
    comment: Misc.CommentJson;
    signatures: Misc.SignatureJson[];
  }

  export interface InterfaceJson extends ParserJson {
    external: boolean;
    comment: Misc.CommentJson;
    properties: InterfaceJson.PropertyJson[];
    methods: InterfaceJson.MethodJson[];
  }

  export namespace InterfaceJson {
    export interface PropertyJson extends ParserJson {
      parentId: number;
      comment: Misc.CommentJson;
      readonly: boolean;
      type: TypeJson;
    }

    export interface MethodJson extends ParserJson {
      parentId: number;
      signatures: Misc.SignatureJson[];
    }
  }

  export interface NamespaceJson extends ParserJson {
    external: boolean;
    comment: Misc.CommentJson;
    classes: ClassJson[];
    enums: EnumJson[];
    functions: FunctionJson[];
    interfaces: InterfaceJson[];
    namespaces: NamespaceJson[];
    typeAliases: TypeAliasJson[];
    variables: VariableJson[];
  }

  export interface TypeAliasJson extends ParserJson {
    external: boolean;
    comment: Misc.CommentJson;
    typeParameters: Misc.TypeParameterJson[];
    type: TypeJson;
  }

  export interface VariableJson extends ParserJson {
    external: boolean;
    comment: Misc.CommentJson;
    type: TypeJson;
    value: string;
  }
}

export { v6_0_0 as v6_0_1, v6_0_0 as v6_0_2 };
