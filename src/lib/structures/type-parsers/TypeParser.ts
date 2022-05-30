import type { JSONOutput } from 'typedoc';
import type { NamedTupleMemberType } from 'typedoc/dist/lib/serialization/schema';
import type { ProjectParser } from '../ProjectParser';
import { ArrayTypeParser } from './ArrayTypeParser';
import { ConditionalTypeParser } from './ConditionalTypeParser';
import { IndexedAccessTypeParser } from './IndexedAccessType';
import { InferredTypeParser } from './InferredTypeParser';
import { IntersectionTypeParser } from './IntersectionTypeParser';
import { IntrinsicTypeParser } from './IntrinsicTypeParser';
import { LiteralTypeParser } from './LiteralTypeParser';
import { MappedTypeParser } from './MappedTypeParser';
import { NamedTupleMemberTypeParser } from './NamedTupleMemberTypeParser';
import { OptionalTypeParser } from './OptionalTypeParser';
import { PredicateTypeParser } from './PredicateTypeParser';
import { QueryTypeParser } from './QueryTypeParser';
import { ReferenceTypeParser } from './ReferenceTypeParser';
import { ReflectionTypeParser } from './ReflectionTypeParser';
import { RestTypeParser } from './RestTypeParser';
import { TemplateLiteralTypeParser } from './TemplateLiteralTypeParser';
import { TupleTypeParser } from './TupleTypeParser';
import { TypeOperatorTypeParser } from './TypeOperatorTypeParser';
import { UnionTypeParser } from './UnionTypeParser';
import { UnknownTypeParser } from './UnknownTypeParser';

export interface TypeParser {
  kind: TypeParser.Kind;

  toJSON(): TypeParser.JSON;

  toString(): string;
}

export namespace TypeParser {
  export function generate(
    type:
      | (
          | JSONOutput.ArrayType
          | JSONOutput.ConditionalType
          | JSONOutput.IndexedAccessType
          | JSONOutput.InferredType
          | JSONOutput.IntersectionType
          | JSONOutput.IntrinsicType
          | JSONOutput.LiteralType
          | JSONOutput.OptionalType
          | JSONOutput.PredicateType
          | JSONOutput.QueryType
          | JSONOutput.ReferenceType
          | JSONOutput.ReflectionType
          | JSONOutput.RestType
          | JSONOutput.TupleType
          | JSONOutput.TypeOperatorType
          | JSONOutput.UnionType
          | JSONOutput.UnknownType
          | JSONOutput.MappedType
          | JSONOutput.TemplateLiteralType
          | NamedTupleMemberType
        )
      | JSONOutput.SomeType,
    project: ProjectParser
  ): TypeParser {
    switch (type.type) {
      case 'array': {
        const { elementType } = type;

        return new ArrayTypeParser(generate(elementType, project));
      }

      case 'conditional': {
        const { checkType, extendsType, trueType, falseType } = type;

        return new ConditionalTypeParser(
          generate(checkType, project),
          generate(extendsType, project),
          generate(trueType, project),
          generate(falseType, project)
        );
      }

      case 'indexedAccess': {
        const { objectType, indexType } = type;

        return new IndexedAccessTypeParser(generate(objectType, project), generate(indexType, project));
      }

      case 'inferred': {
        const { name } = type;

        return new InferredTypeParser(name);
      }

      case 'intersection': {
        const { types } = type;

        return new IntersectionTypeParser(types.map((type) => generate(type, project)));
      }

      case 'intrinsic': {
        const { name } = type;

        return new IntrinsicTypeParser(name);
      }

      case 'literal': {
        const { value } = type;

        return new LiteralTypeParser((typeof value === 'object' && value !== null ? value.value : value)?.toString() ?? 'null');
      }

      case 'mapped': {
        const { parameter, parameterType, nameType, templateType, optionalModifier, readonlyModifier } = type;

        return new MappedTypeParser(
          parameter,
          generate(parameterType, project),
          nameType ? generate(nameType, project) : null,
          generate(templateType, project),
          (optionalModifier ?? null) as MappedTypeParser.Modifier,
          (readonlyModifier ?? null) as MappedTypeParser.Modifier
        );
      }

      case 'named-tuple-member': {
        const { element, isOptional, name } = type;

        return new NamedTupleMemberTypeParser(name, generate(element, project), isOptional);
      }

      case 'optional': {
        const { elementType } = type;

        return new OptionalTypeParser(generate(elementType, project));
      }

      case 'predicate': {
        const { asserts, name, targetType } = type;

        return new PredicateTypeParser(asserts, name, targetType ? generate(targetType, project) : null);
      }

      case 'query': {
        const { queryType } = type;

        return new QueryTypeParser(generate(queryType, project) as ReferenceTypeParser);
      }

      case 'reference': {
        const { id, name, package: _package, qualifiedName, typeArguments = [] } = type;

        return new ReferenceTypeParser(
          id ?? null,
          qualifiedName ?? name,
          _package ?? null,
          typeArguments.map((typeArgument) => generate(typeArgument, project)),
          project
        );
      }

      case 'reflection': {
        const { declaration } = type;

        return new ReflectionTypeParser(declaration ?? null);
      }

      case 'rest': {
        const { elementType } = type;

        return new RestTypeParser(generate(elementType, project));
      }

      case 'template-literal': {
        const { head, tail } = type;

        return new TemplateLiteralTypeParser(
          head,
          tail.map(([type, text]) => ({ type: generate(type, project), text }))
        );
      }

      case 'tuple': {
        const { elements = [] } = type;

        return new TupleTypeParser(elements.map((element) => generate(element, project)));
      }

      case 'typeOperator': {
        const { operator, target } = type;

        return new TypeOperatorTypeParser(operator as TypeOperatorTypeParser.Operator, generate(target, project));
      }

      case 'union': {
        const { types } = type;

        return new UnionTypeParser(types.map((type) => generate(type, project)));
      }

      case 'unknown': {
        const { name } = type;

        return new UnknownTypeParser(name);
      }
    }
  }

  export function wrap(type: TypeParser, binding: number) {
    return BindingPowers[type.kind] < binding ? `(${type.toString()})` : type.toString();
  }

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

  export const BindingPowers: Record<Kind, number> = {
    [Kind.Array]: 999,
    [Kind.Conditional]: 150,
    [Kind.IndexedAccess]: 999,
    [Kind.Inferred]: 999,
    [Kind.Intersection]: 120,
    [Kind.Intrinsic]: 999,
    [Kind.Literal]: 999,
    [Kind.Mapped]: 999,
    [Kind.NamedTupleMember]: 999,
    [Kind.Optional]: 999,
    [Kind.Predicate]: 999,
    [Kind.Query]: 900,
    [Kind.Reference]: 999,
    [Kind.Reflection]: 999,
    [Kind.Rest]: 999,
    [Kind.TemplateLiteral]: 999,
    [Kind.Tuple]: 999,
    [Kind.TypeOperator]: 900,
    [Kind.Union]: 100,
    [Kind.Unknown]: -1
  };

  export interface JSON {
    kind: Kind;
  }
}
