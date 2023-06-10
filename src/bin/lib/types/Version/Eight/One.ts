export interface ClassJson extends ParserJson {
  namespaceParentId: number | null;

  comment: Misc.CommentJson;

  external: boolean;

  abstract: boolean;

  extendsType: TypeJson | null;

  implementsType: TypeJson[];

  typeParameters: Misc.TypeParameterJson[];

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
    comment: Misc.CommentJson;

    parentId: number;

    accessibility: Accessibility;

    parameters: Misc.ParameterJson[];
  }

  export interface PropertyJson extends ParserJson {
    comment: Misc.CommentJson;

    parentId: number;

    accessibility: Accessibility;

    abstract: boolean;

    static: boolean;

    readonly: boolean;

    optional: boolean;

    type: TypeJson;
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
  namespaceParentId: number | null;

  comment: Misc.CommentJson;

  external: boolean;

  members: EnumJson.MemberJson[];
}

export namespace EnumJson {
  export interface MemberJson extends ParserJson {
    comment: Misc.CommentJson;

    parentId: number;

    value: string;
  }
}

export interface InterfaceJson extends ParserJson {
  namespaceParentId: number | null;

  comment: Misc.CommentJson;

  external: boolean;

  typeParameters: Misc.TypeParameterJson[];

  properties: InterfaceJson.PropertyJson[];

  methods: InterfaceJson.MethodJson[];
}

export namespace InterfaceJson {
  export interface PropertyJson extends ParserJson {
    comment: Misc.CommentJson;

    parentId: number;

    readonly: boolean;

    type: TypeJson | null;
  }

  export interface MethodJson extends ParserJson {
    parentId: number;

    signatures: Misc.SignatureJson[];
  }
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

  export interface MethodJson {
    id: number;

    signatures: SignatureJson[];
  }

  export interface ParameterJson {
    id: number;

    name: string;

    comment: CommentJson;

    optional: boolean;

    rest: boolean;

    type: TypeJson;
  }

  export interface PropertyJson {
    id: number;

    name: string;

    comment: CommentJson;

    type: TypeJson;
  }

  export interface SignatureJson {
    id: number;

    name: string;

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

    constraint: TypeJson | null;

    default: TypeJson | null;
  }
}

export interface TypeJson {
  kind: TypeJson.Kind;
}

export namespace TypeJson {
  export interface ArrayJson extends TypeJson {
    kind: Kind.Array;

    type: TypeJson;
  }

  export interface ConditionalJson extends TypeJson {
    kind: Kind.Conditional;

    checkType: TypeJson;

    extendsType: TypeJson;

    trueType: TypeJson;

    falseType: TypeJson;
  }

  export interface IndexedAccessJson extends TypeJson {
    kind: Kind.IndexedAccess;

    objectType: TypeJson;

    indexType: TypeJson;
  }

  export interface InferredJson extends TypeJson {
    kind: Kind.Inferred;

    type: string;
  }

  export interface IntersectionJson extends TypeJson {
    kind: Kind.Intersection;

    types: TypeJson[];
  }

  export interface IntrinsicJson extends TypeJson {
    kind: Kind.Intrinsic;

    type: string;
  }

  export interface LiteralJson extends TypeJson {
    kind: Kind.Literal;

    value: string;
  }

  export interface MappedJson extends TypeJson {
    kind: Kind.Mapped;

    parameter: string;

    parameterType: TypeJson;

    nameType: TypeJson | null;

    templateType: TypeJson;

    readonly: MappedJson.Modifier;

    optional: MappedJson.Modifier;
  }

  export namespace MappedJson {
    export enum Modifier {
      Add = '+',

      Remove = '-'
    }
  }

  export interface NamedTupleMemberJson extends TypeJson {
    kind: Kind.NamedTupleMember;

    name: string;

    type: TypeJson;

    optional: boolean;
  }

  export interface OptionalJson extends TypeJson {
    kind: Kind.Optional;

    type: TypeJson;
  }

  export interface PredicateJson extends TypeJson {
    kind: Kind.Predicate;

    asserts: boolean;

    name: string;

    type: TypeJson | null;
  }

  export interface QueryJson extends TypeJson {
    kind: Kind.Query;

    queryType: ReferenceJson;
  }

  export interface ReferenceJson extends TypeJson {
    kind: Kind.Reference;

    id: number | null;

    name: string;

    packageName: string | null;

    typeArguments: TypeJson[];
  }

  export interface ReflectionJson extends TypeJson {
    kind: Kind.Reflection;

    properties: Misc.PropertyJson[] | null;

    signatures: Misc.SignatureJson[] | null;

    methods: Misc.MethodJson[] | null;
  }

  export interface RestJson extends TypeJson {
    kind: Kind.Rest;

    type: TypeJson;
  }

  export interface TemplateLiteralJson extends TypeJson {
    kind: Kind.TemplateLiteral;

    head: string;

    tail: TemplateLiteralJson.TailJson[];
  }

  export namespace TemplateLiteralJson {
    export interface TailJson {
      type: TypeJson;

      text: string;
    }
  }

  export interface TupleJson extends TypeJson {
    kind: Kind.Tuple;

    types: TypeJson[];
  }

  export interface TypeOperatorJson extends TypeJson {
    kind: Kind.TypeOperator;

    operator: TypeOperatorJson.Operator;

    type: TypeJson;
  }

  export namespace TypeOperatorJson {
    export enum Operator {
      KeyOf = 'keyof',

      Unique = 'unique',

      Readonly = 'readonly'
    }
  }

  export interface UnionJson extends TypeJson {
    kind: Kind.Union;

    types: TypeJson[];
  }

  export interface UnknownJson extends TypeJson {
    kind: Kind.Unknown;

    name: string;
  }
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

export interface FunctionJson extends ParserJson {
  namespaceParentId: number | null;

  comment: Misc.CommentJson;

  external: boolean;

  signatures: Misc.SignatureJson[];
}

export interface NamespaceJson extends ParserJson {
  namespaceParentId: number | null;

  comment: Misc.CommentJson;

  external: boolean;

  classes: ClassJson[];

  variables: VariableJson[];

  enums: EnumJson[];

  functions: FunctionJson[];

  interfaces: InterfaceJson[];

  namespaces: NamespaceJson[];

  typeAliases: TypeAliasJson[];
}

export interface ParserJson {
  id: number;

  name: string;

  source: Misc.SourceJson | null;
}

export interface ProjectJson {
  typeDocJsonParserVersion: string;

  id: number;

  name: string;

  version: string | null;

  readme: string | null;

  changelog: string | null;

  classes: ClassJson[];

  variables: VariableJson[];

  enums: EnumJson[];

  functions: FunctionJson[];

  interfaces: InterfaceJson[];

  namespaces: NamespaceJson[];

  typeAliases: TypeAliasJson[];
}

export interface TypeAliasJson extends ParserJson {
  namespaceParentId: number | null;

  comment: Misc.CommentJson;

  external: boolean;

  typeParameters: Misc.TypeParameterJson[];

  type: TypeJson;
}

export interface VariableJson extends ParserJson {
  namespaceParentId: number | null;

  comment: Misc.CommentJson;

  external: boolean;

  type: TypeJson;

  value: string;
}
