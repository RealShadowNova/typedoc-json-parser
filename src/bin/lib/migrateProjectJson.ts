import type { ClassParser } from '../../lib/structures/class-parser';
import type { EnumParser } from '../../lib/structures/enum-parser';
import type { FunctionParser } from '../../lib/structures/FunctionParser';
import type { InterfaceParser } from '../../lib/structures/interface-parser';
import type { ParameterParser, SignatureParser, SourceParser } from '../../lib/structures/misc';
import type { NamespaceParser } from '../../lib/structures/NamespaceParser';
import { ProjectParser } from '../../lib/structures/ProjectParser';
import type { TypeAliasParser } from '../../lib/structures/TypeAliasParser';
import type { VariableParser } from '../../lib/structures/VariableParser';

const currentTypeDocJsonParserVersion = ProjectParser.version
  .split('.')
  // eslint-disable-next-line radix
  .map((x) => parseInt(x))
  .slice(0, 3)
  .join('.');

export function migrateProjectJson(
  projectJson:
    | Migration.MajorTwo.MinorOne.ProjectJSON
    | Migration.MajorTwo.MinorTwo.ProjectJSON
    | Migration.MajorTwo.MinorThree.ProjectJSON
    | Migration.MajorThree.MinorZero.ProjectJSON
    | Migration.MajorThree.MinorOne.ProjectJSON
    | Migration.MajorThree.MinorTwo.ProjectJSON
    | Migration.MajorFour.MinorZero.ProjectJSON
    | Migration.MajorSix.MinorZero.ProjectJSON
): ProjectParser.JSON | null {
  const { typeDocJsonParserVersion, id, name, classes, enums, functions, interfaces, namespaces, typeAliases } = projectJson;

  switch (typeDocJsonParserVersion) {
    case '2.1.0':

    case '2.2.0':

    case '2.2.1':

    case '2.3.0':

    case '2.3.1':

    case '3.0.0':

    case '3.1.0':

    case '3.2.0':

    case '4.0.0':

    case '5.0.0':

    case '5.0.1':

    case '5.1.0':

    case '5.2.0': {
      const { constants } = projectJson as
        | Migration.MajorTwo.MinorOne.ProjectJSON
        | Migration.MajorTwo.MinorTwo.ProjectJSON
        | Migration.MajorTwo.MinorThree.ProjectJSON
        | Migration.MajorThree.MinorZero.ProjectJSON
        | Migration.MajorThree.MinorOne.ProjectJSON
        | Migration.MajorThree.MinorTwo.ProjectJSON
        | Migration.MajorFour.MinorZero.ProjectJSON;

      return {
        typeDocJsonParserVersion: currentTypeDocJsonParserVersion,
        id,
        name,
        version: 'version' in projectJson ? projectJson.version : null,
        readme: 'readme' in projectJson ? projectJson.readme : null,
        changelog: 'changelog' in projectJson ? projectJson.changelog : null,
        classes: classes.map((classJson) => migrateClassJson(classJson, typeDocJsonParserVersion)),
        enums: enums.map((enumJson) => migrateEnum(enumJson, typeDocJsonParserVersion)),
        functions: functions.map((functionJson) => migrateFunction(functionJson, typeDocJsonParserVersion)),
        interfaces: interfaces.map((interfaceJson) => migrateInterface(interfaceJson, typeDocJsonParserVersion)),
        namespaces: namespaces.map((namespaceJson) => migrateNamespace(namespaceJson, typeDocJsonParserVersion)),
        typeAliases: typeAliases.map((typeAliasJson) => migrateTypeAlias(typeAliasJson, typeDocJsonParserVersion)),
        variables: constants.map((constantJson) => migrateVariable(constantJson, typeDocJsonParserVersion))
      };
    }

    case '6.0.0': {
      const { variables } = projectJson as Migration.MajorSix.MinorZero.ProjectJSON;

      return {
        typeDocJsonParserVersion: currentTypeDocJsonParserVersion,
        id,
        name,
        version: 'version' in projectJson ? projectJson.version : null,
        readme: 'readme' in projectJson ? projectJson.readme : null,
        changelog: 'changelog' in projectJson ? projectJson.changelog : null,
        classes: classes.map((classJson) => migrateClassJson(classJson, typeDocJsonParserVersion)),
        enums: enums.map((enumJson) => migrateEnum(enumJson, typeDocJsonParserVersion)),
        functions: functions.map((functionJson) => migrateFunction(functionJson, typeDocJsonParserVersion)),
        interfaces: interfaces.map((interfaceJson) => migrateInterface(interfaceJson, typeDocJsonParserVersion)),
        namespaces: namespaces.map((namespaceJson) => migrateNamespace(namespaceJson, typeDocJsonParserVersion)),
        typeAliases: typeAliases.map((typeAliasJson) => migrateTypeAlias(typeAliasJson, typeDocJsonParserVersion)),
        variables: variables.map((variableJson) => migrateVariable(variableJson, typeDocJsonParserVersion))
      };
    }
  }

  throw new Error(`Unsupported typeDocJsonParserVersion: ${typeDocJsonParserVersion}`);
}

function migrateClassJson(
  classJson:
    | Migration.MajorTwo.MinorOne.ClassJSON
    | Migration.MajorTwo.MinorThree.ClassJSON
    | Migration.MajorThree.MinorZero.ClassJSON
    | Migration.MajorFour.MinorZero.ClassJSON
    | Migration.MajorSix.MinorZero.ClassJSON,
  typeDocJsonParserVersion: string
): ClassParser.JSON {
  const { id, name, comment, source, external, abstract, extendsType, implementsType, construct, properties, methods } = classJson;

  switch (typeDocJsonParserVersion) {
    case '2.1.0':

    case '2.2.0':

    case '2.2.1':

    case '2.3.0':

    case '2.3.1':

    case '3.0.0':

    case '3.1.0':

    case '3.2.0':

    case '4.0.0':

    case '5.0.0':

    case '5.0.1':

    case '5.1.0':

    case '5.2.0':
      return {
        id,
        name,
        comment,
        source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
        external,
        abstract,
        extendsType,
        implementsType,
        typeParameters: [],
        construct: {
          id: construct.id,
          name: construct.name,
          comment: construct.comment,
          source: construct.source ? migrateSourceJson(construct.source, typeDocJsonParserVersion) : null,
          parentId: id,
          parameters: construct.parameters.map((parameterJson) => migrateParameterJson(parameterJson, typeDocJsonParserVersion))
        },
        properties: properties.map((propertyJson) => {
          const { id, name, comment, source, accessibility, abstract, static: _static, readonly, optional, type } = propertyJson;

          return {
            id,
            name,
            comment,
            source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
            parentId: id,
            accessibility,
            abstract,
            static: _static,
            readonly,
            optional,
            type
          };
        }),
        methods: methods.map((methodJson) => {
          const { id, name, source, accessibility, abstract, static: _static, signatures } = methodJson;

          return {
            id,
            name,
            source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
            parentId: id,
            accessibility,
            abstract,
            static: _static,
            signatures: signatures.map((signatureJson) => migrateSignatureJson(signatureJson, typeDocJsonParserVersion))
          };
        })
      };

    case '6.0.0': {
      const { typeParameters } = classJson as Migration.MajorSix.MinorZero.ClassJSON;

      return {
        id,
        name,
        comment,
        source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
        external,
        abstract,
        extendsType,
        implementsType,
        typeParameters,
        construct: {
          id: construct.id,
          name: construct.name,
          comment: construct.comment,
          source: construct.source ? migrateSourceJson(construct.source, typeDocJsonParserVersion) : null,
          parentId: id,
          parameters: construct.parameters.map((parameterJson) => migrateParameterJson(parameterJson, typeDocJsonParserVersion))
        },
        properties: properties.map((propertyJson) => {
          const { id, name, comment, source, accessibility, abstract, static: _static, readonly, optional, type } = propertyJson;

          return {
            id,
            name,
            comment,
            source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
            parentId: id,
            accessibility,
            abstract,
            static: _static,
            readonly,
            optional,
            type
          };
        }),
        methods: methods.map((methodJson) => {
          const { id, name, source, accessibility, abstract, static: _static, signatures } = methodJson;

          return {
            id,
            name,
            source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
            parentId: id,
            accessibility,
            abstract,
            static: _static,
            signatures: signatures.map((signatureJson) => migrateSignatureJson(signatureJson, typeDocJsonParserVersion))
          };
        })
      };
    }
  }

  throw new Error(`Unsupported typeDocJsonParserVersion: ${typeDocJsonParserVersion}`);
}

function migrateEnum(
  enumJson:
    | Migration.MajorTwo.MinorOne.EnumJSON
    | Migration.MajorThree.MinorZero.EnumJSON
    | Migration.MajorFour.MinorZero.EnumJSON
    | Migration.MajorSix.MinorZero.EnumJSON,
  typeDocJsonParserVersion: string
): EnumParser.JSON {
  const { id, name, comment, source, external } = enumJson;

  switch (typeDocJsonParserVersion) {
    case '2.1.0':

    case '2.2.0':

    case '2.2.1':

    case '2.3.0':

    case '2.3.1':

    case '3.0.0':

    case '3.1.0':

    case '3.2.0':

    case '4.0.0':

    case '5.0.0':

    case '5.0.1':

    case '5.1.0':

    case '5.2.0': {
      const { properties } = enumJson as
        | Migration.MajorTwo.MinorOne.EnumJSON
        | Migration.MajorThree.MinorZero.EnumJSON
        | Migration.MajorFour.MinorZero.EnumJSON;

      return {
        id,
        name,
        comment,
        source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
        external,
        members: properties.map((propertyJson) => {
          const { id, name, comment, source, value } = propertyJson;

          return {
            id,
            name,
            comment,
            source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
            parentId: enumJson.id,
            value
          };
        })
      };
    }

    case '6.0.0': {
      const { members } = enumJson as Migration.MajorSix.MinorZero.EnumJSON;

      return {
        id,
        name,
        comment,
        source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
        external,
        members: members.map((memberJson) => {
          const { id, name, comment, source, value } = memberJson;

          return {
            id,
            name,
            comment,
            source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
            parentId: enumJson.id,
            value
          };
        })
      };
    }
  }

  throw new Error(`Unsupported typeDocJsonParserVersion: ${typeDocJsonParserVersion}`);
}

function migrateFunction(
  functionJson: Migration.MajorTwo.MinorOne.FunctionJSON | Migration.MajorTwo.MinorThree.FunctionJSON | Migration.MajorThree.MinorZero.FunctionJSON,
  typeDocJsonParserVersion: string
): FunctionParser.JSON {
  const { id, name, comment, source, external, signatures } = functionJson;

  switch (typeDocJsonParserVersion) {
    case '2.1.0':

    case '2.2.0':

    case '2.2.1':

    case '2.3.0':

    case '2.3.1':

    case '3.0.0':

    case '3.1.0':

    case '3.2.0':

    case '4.0.0':

    case '5.0.0':

    case '5.0.1':

    case '5.1.0':

    case '5.2.0':

    case '6.0.0':
      return {
        id,
        name,
        comment,
        source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
        external,
        signatures: signatures.map((signatureJson) => migrateSignatureJson(signatureJson, typeDocJsonParserVersion))
      };
  }

  throw new Error(`Unsupported typeDocJsonParserVersion: ${typeDocJsonParserVersion}`);
}

function migrateInterface(
  interfaceJson:
    | Migration.MajorTwo.MinorOne.InterfaceJSON
    | Migration.MajorThree.MinorZero.InterfaceJSON
    | Migration.MajorFour.MinorZero.InterfaceJSON
    | Migration.MajorSix.MinorZero.InterfaceJSON,
  typeDocJsonParserVersion: string
): InterfaceParser.JSON {
  const { id, name, comment, source, external, properties } = interfaceJson;

  switch (typeDocJsonParserVersion) {
    case '2.1.0':

    case '2.2.0':

    case '2.2.1':

    case '2.3.0':

    case '2.3.1':

    case '3.0.0':
      return {
        id,
        name,
        comment,
        source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
        external,
        properties: properties.map((propertyJson) => {
          const { id, name, comment, source, readonly, type } = propertyJson;

          return {
            id,
            name,
            comment,
            source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
            parentId: id,
            readonly,
            type
          };
        }),
        methods: []
      };

    case '3.1.0':

    case '3.2.0':

    case '4.0.0':

    case '5.0.0':

    case '5.0.1':

    case '5.1.0':

    case '5.2.0':

    case '6.0.0': {
      const { methods } = interfaceJson as Migration.MajorThree.MinorOne.InterfaceJSON;

      return {
        id,
        name,
        comment,
        source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
        external,
        properties: properties.map((propertyJson) => {
          const { id, name, comment, source, readonly, type } = propertyJson;

          return {
            id,
            name,
            comment,
            source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
            parentId: id,
            readonly,
            type
          };
        }),
        methods: methods.map((methodJson) => {
          const { id, name, source, signatures } = methodJson;

          return {
            id,
            name,
            source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
            parentId: id,
            signatures: signatures.map((signatureJson) => migrateSignatureJson(signatureJson, typeDocJsonParserVersion))
          };
        })
      };
    }
  }

  throw new Error(`Unsupported typeDocJsonParserVersion: ${typeDocJsonParserVersion}`);
}

function migrateNamespace(
  namespaceJson:
    | Migration.MajorTwo.MinorOne.NamespaceJSON
    | Migration.MajorThree.MinorZero.NamespaceJSON
    | Migration.MajorSix.MinorZero.NamespaceJSON,
  typeDocJsonParserVersion: string
): NamespaceParser.JSON {
  const { id, name, comment, source, external, classes, enums, functions, interfaces, namespaces, typeAliases } = namespaceJson;

  switch (typeDocJsonParserVersion) {
    case '2.1.0':

    case '2.2.0':

    case '2.2.1':

    case '2.3.0':

    case '2.3.1':

    case '3.0.0':

    case '3.1.0':

    case '3.2.0':

    case '4.0.0':

    case '5.0.0':

    case '5.0.1':

    case '5.1.0':

    case '5.2.0': {
      const { constants } = namespaceJson as Migration.MajorTwo.MinorOne.NamespaceJSON | Migration.MajorThree.MinorZero.NamespaceJSON;

      return {
        id,
        name,
        comment,
        source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
        external,
        classes: classes.map((classJson) => migrateClassJson(classJson, typeDocJsonParserVersion)),
        enums: enums.map((enumJson) => migrateEnum(enumJson, typeDocJsonParserVersion)),
        functions: functions.map((functionJson) => migrateFunction(functionJson, typeDocJsonParserVersion)),
        interfaces: interfaces.map((interfaceJson) => migrateInterface(interfaceJson, typeDocJsonParserVersion)),
        namespaces: namespaces.map((namespaceJson) => migrateNamespace(namespaceJson, typeDocJsonParserVersion)),
        typeAliases: typeAliases.map((typeAliasJson) => migrateTypeAlias(typeAliasJson, typeDocJsonParserVersion)),
        variables: constants.map((constantJson) => migrateVariable(constantJson, typeDocJsonParserVersion))
      };
    }

    case '6.0.0': {
      const { variables } = namespaceJson as Migration.MajorSix.MinorZero.NamespaceJSON;

      return {
        id,
        name,
        comment,
        source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
        external,
        classes: classes.map((classJson) => migrateClassJson(classJson, typeDocJsonParserVersion)),
        enums: enums.map((enumJson) => migrateEnum(enumJson, typeDocJsonParserVersion)),
        functions: functions.map((functionJson) => migrateFunction(functionJson, typeDocJsonParserVersion)),
        interfaces: interfaces.map((interfaceJson) => migrateInterface(interfaceJson, typeDocJsonParserVersion)),
        namespaces: namespaces.map((namespaceJson) => migrateNamespace(namespaceJson, typeDocJsonParserVersion)),
        typeAliases: typeAliases.map((typeAliasJson) => migrateTypeAlias(typeAliasJson, typeDocJsonParserVersion)),
        variables: variables.map((variableJson) => migrateVariable(variableJson, typeDocJsonParserVersion))
      };
    }
  }

  throw new Error(`Unsupported typeDocJsonParserVersion: ${typeDocJsonParserVersion}`);
}

function migrateTypeAlias(
  typeAliasJson: Migration.MajorTwo.MinorOne.TypeAliasJSON | Migration.MajorThree.MinorZero.TypeAliasJSON,
  typeDocJsonParserVersion: string
): TypeAliasParser.JSON {
  const { id, name, comment, source, external, typeParameters, type } = typeAliasJson;

  switch (typeDocJsonParserVersion) {
    case '2.1.0':

    case '2.2.0':

    case '2.2.1':

    case '2.3.0':

    case '2.3.1':

    case '3.0.0':

    case '3.1.0':

    case '3.2.0':

    case '4.0.0':

    case '5.0.0':

    case '5.0.1':

    case '5.1.0':

    case '5.2.0':

    case '6.0.0':
      return {
        id,
        name,
        comment,
        source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
        external,
        typeParameters,
        type
      };
  }

  throw new Error(`Unsupported typeDocJsonParserVersion: ${typeDocJsonParserVersion}`);
}

function migrateVariable(
  variableJson: Migration.MajorTwo.MinorOne.ConstantJSON | Migration.MajorThree.MinorZero.ConstantJSON,
  typeDocJsonParserVersion: string
): VariableParser.JSON {
  const { id, name, comment, source, external, type, value } = variableJson;

  switch (typeDocJsonParserVersion) {
    case '2.1.0':

    case '2.2.0':

    case '2.2.1':

    case '2.3.0':

    case '2.3.1':

    case '3.0.0':

    case '3.1.0':

    case '3.2.0':

    case '4.0.0':

    case '5.0.0':

    case '5.0.1':

    case '5.1.0':

    case '5.2.0':

    case '6.0.0':
      return {
        id,
        name,
        comment,
        source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
        external,
        type,
        value
      };
  }

  throw new Error(`Unsupported typeDocJsonParserVersion: ${typeDocJsonParserVersion}`);
}

function migrateSourceJson(
  sourceJson: Migration.MajorTwo.MinorOne.Misc.SourceJSON | Migration.MajorThree.MinorZero.Misc.SourceJSON,
  typeDocJsonParserVersion: string
): SourceParser.JSON {
  const { line, file, path } = sourceJson;

  switch (typeDocJsonParserVersion) {
    case '2.1.0':

    case '2.2.0':

    case '2.2.1':

    case '2.3.0':

    case '2.3.1':
      return {
        line,
        file,
        path,
        url: null
      };

    case '3.0.0':

    case '3.1.0':

    case '3.2.0':

    case '4.0.0':

    case '5.0.0':

    case '5.0.1':

    case '5.1.0':

    case '5.2.0':

    case '6.0.0': {
      const { url } = sourceJson as Migration.MajorThree.MinorZero.Misc.SourceJSON;

      return {
        line,
        file,
        path,
        url
      };
    }
  }

  throw new Error(`Unsupported typeDocJsonParserVersion: ${typeDocJsonParserVersion}`);
}

function migrateParameterJson(parameterJson: Migration.MajorTwo.MinorOne.Misc.ParameterJSON, typeDocJsonParserVersion: string): ParameterParser.JSON {
  const { id, name, type } = parameterJson;

  switch (typeDocJsonParserVersion) {
    case '2.1.0':

    case '2.2.0':

    case '2.2.1':

    case '2.3.0':

    case '2.3.1':

    case '3.0.0':

    case '3.1.0':

    case '3.2.0':

    case '4.0.0':

    case '5.0.0':

    case '5.0.1':

    case '5.1.0':

    case '5.2.0':

    case '6.0.0':
      return {
        id,
        name,
        comment: {
          description: null,
          blockTags: [],
          modifierTags: []
        },
        type
      };
  }

  throw new Error(`Unsupported typeDocJsonParserVersion: ${typeDocJsonParserVersion}`);
}

function migrateSignatureJson(
  signatureJson: Migration.MajorTwo.MinorOne.Misc.SignatureJSON | Migration.MajorTwo.MinorThree.Misc.SignatureJSON,
  typeDocJsonParserVersion: string
): SignatureParser.JSON {
  const { id, name, typeParameters, parameters, returnType } = signatureJson;

  switch (typeDocJsonParserVersion) {
    case '2.1.0':

    case '2.2.0':

    case '2.2.1':
      return {
        id,
        name,
        comment: { description: null, blockTags: [], modifierTags: [] },
        typeParameters,
        parameters: parameters.map((parameterJson) => migrateParameterJson(parameterJson, typeDocJsonParserVersion)),
        returnType
      };

    case '2.3.0':

    case '2.3.1':

    case '2.3.2':

    case '3.0.0':

    case '3.1.0':

    case '3.2.0':

    case '4.0.0':

    case '5.0.0':

    case '5.0.1':

    case '5.1.0':

    case '5.2.0':

    case '6.0.0': {
      const { comment } = signatureJson as Migration.MajorTwo.MinorThree.Misc.SignatureJSON;

      return {
        id,
        name,
        comment,
        typeParameters,
        parameters: parameters.map((parameterJson) => migrateParameterJson(parameterJson, typeDocJsonParserVersion)),
        returnType
      };
    }
  }

  throw new Error(`Unsupported typeDocJsonParserVersion: ${typeDocJsonParserVersion}`);
}

export namespace Migration {
  export namespace MajorTwo {
    export namespace MinorOne {
      export interface ProjectJSON {
        typeDocJsonParserVersion: string;
        id: number;
        name: string;
        classes: ClassJSON[];
        constants: ConstantJSON[];
        enums: EnumJSON[];
        functions: FunctionJSON[];
        interfaces: InterfaceJSON[];
        namespaces: NamespaceJSON[];
        typeAliases: TypeAliasJSON[];
      }

      export interface ClassJSON extends Parser {
        external: boolean;
        abstract: boolean;
        extendsType: Type | null;
        implementsType: Type[];
        construct: ClassJSON.ConstructorJSON;
        properties: ClassJSON.PropertyJSON[];
        methods: ClassJSON.MethodJSON[];
      }

      export namespace ClassJSON {
        export interface ConstructorJSON extends Parser {
          parameters: Misc.ParameterJSON[];
        }

        export interface PropertyJSON extends Parser {
          accessibility: Accessibility;
          abstract: boolean;
          static: boolean;
          readonly: boolean;
          optional: boolean;
          type: Type;
        }

        export interface MethodJSON extends Parser {
          accessibility: Accessibility;
          abstract: boolean;
          static: boolean;
          signatures: Misc.SignatureJSON[];
        }

        export enum Accessibility {
          Public = 'public',
          Protected = 'protected',
          Private = 'private'
        }
      }

      export interface ConstantJSON extends Parser {
        external: boolean;
        type: Type;
        value: string;
      }

      export interface EnumJSON extends Parser {
        external: boolean;

        properties: EnumJSON.PropertyJSON[];
      }

      export namespace EnumJSON {
        export interface PropertyJSON extends Parser {
          value: string;
        }
      }

      export interface FunctionJSON extends Parser {
        external: boolean;
        signatures: Misc.SignatureJSON[];
      }

      export interface InterfaceJSON extends Parser {
        external: boolean;
        properties: InterfaceJSON.PropertyJSON[];
      }

      export namespace InterfaceJSON {
        export interface PropertyJSON extends Parser {
          readonly: boolean;
          type: Type;
        }
      }

      export interface NamespaceJSON extends Parser {
        external: boolean;
        classes: ClassJSON[];
        constants: ConstantJSON[];
        enums: EnumJSON[];
        functions: FunctionJSON[];
        interfaces: InterfaceJSON[];
        namespaces: NamespaceJSON[];
        typeAliases: TypeAliasJSON[];
      }

      export interface TypeAliasJSON extends Parser {
        external: boolean;
        typeParameters: Misc.TypeParameterJSON[];
        type: Type;
      }

      export interface Parser {
        id: number;
        name: string;
        comment: Misc.CommentJSON;
        source: Misc.SourceJSON | null;
      }

      export interface Type {
        kind: Type.Kind;
      }

      export namespace Type {
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

      export namespace Misc {
        export interface CommentJSON {
          description: string | null;
          blockTags: CommentJSON.BlockTag[];
          modifierTags: string[];
        }

        export namespace CommentJSON {
          export interface BlockTag {
            name: string;
            text: string;
          }
        }

        export interface ParameterJSON {
          id: number;
          name: string;
          type: Type;
        }

        export interface SignatureJSON {
          id: number;
          name: string;
          typeParameters: TypeParameterJSON[];
          parameters: ParameterJSON[];
          returnType: Type;
        }

        export interface SourceJSON {
          line: number;
          file: string;
          path: string;
        }

        export interface TypeParameterJSON {
          id: number;
          name: string;
          type: Type | null;
          default: Type | null;
        }
      }
    }

    export namespace MinorTwo {
      export interface ProjectJSON extends MinorOne.ProjectJSON {
        version: string | null;
      }
    }

    export namespace MinorThree {
      export type ProjectJSON = MinorTwo.ProjectJSON;

      export interface ClassJSON extends MinorOne.ClassJSON {
        methods: ClassJSON.MethodJSON[];
      }

      export namespace ClassJSON {
        export interface MethodJSON extends MinorOne.ClassJSON.MethodJSON {
          signatures: Misc.SignatureJSON[];
        }
      }

      export interface FunctionJSON extends MinorOne.FunctionJSON {
        signatures: Misc.SignatureJSON[];
      }

      export namespace Misc {
        export interface SignatureJSON extends MinorOne.Misc.SignatureJSON {
          comment: MinorOne.Misc.CommentJSON;
        }
      }
    }
  }

  export namespace MajorThree {
    export namespace MinorZero {
      export interface ProjectJSON extends MajorTwo.MinorThree.ProjectJSON {
        readme: string | null;
      }

      export interface ClassJSON extends MajorTwo.MinorThree.ClassJSON {
        source: Misc.SourceJSON | null;
      }

      export namespace ClassJSON {
        export interface ConstructorJSON extends MajorTwo.MinorOne.ClassJSON.ConstructorJSON {
          source: Misc.SourceJSON | null;
        }

        export interface MethodJSON extends MajorTwo.MinorThree.ClassJSON.MethodJSON {
          source: Misc.SourceJSON | null;
        }

        export interface PropertyJSON extends MajorTwo.MinorOne.ClassJSON.PropertyJSON {
          source: Misc.SourceJSON | null;
        }
      }

      export interface ConstantJSON extends MajorTwo.MinorOne.ConstantJSON {
        source: Misc.SourceJSON | null;
      }

      export interface EnumJSON extends MajorTwo.MinorOne.EnumJSON {
        source: Misc.SourceJSON | null;
      }

      export namespace EnumJSON {
        export interface PropertyJSON extends MajorTwo.MinorOne.EnumJSON.PropertyJSON {
          source: Misc.SourceJSON | null;
        }
      }

      export interface FunctionJSON extends MajorTwo.MinorThree.FunctionJSON {
        source: Misc.SourceJSON | null;
      }

      export interface InterfaceJSON extends MajorTwo.MinorOne.InterfaceJSON {
        source: Misc.SourceJSON | null;
      }

      export namespace InterfaceJSON {
        export interface PropertyJSON extends MajorTwo.MinorOne.InterfaceJSON.PropertyJSON {
          source: Misc.SourceJSON | null;
        }
      }

      export interface NamespaceJSON extends MajorTwo.MinorOne.NamespaceJSON {
        source: Misc.SourceJSON | null;
        classes: ClassJSON[];
        constants: ConstantJSON[];
        enums: EnumJSON[];
        functions: FunctionJSON[];
        interfaces: InterfaceJSON[];
        namespaces: NamespaceJSON[];
        typeAliases: TypeAliasJSON[];
      }

      export interface TypeAliasJSON extends MajorTwo.MinorOne.TypeAliasJSON {
        source: Misc.SourceJSON | null;
      }

      export namespace Misc {
        export interface SourceJSON extends MajorTwo.MinorOne.Misc.SourceJSON {
          url: string | null;
        }
      }
    }

    export namespace MinorOne {
      export interface ProjectJSON extends MinorZero.ProjectJSON {
        interfaces: InterfaceJSON[];
      }

      export interface InterfaceJSON extends MinorZero.InterfaceJSON {
        methods: InterfaceJSON.MethodJSON[];
      }

      export namespace InterfaceJSON {
        export interface MethodJSON extends MajorTwo.MinorOne.Parser {
          signatures: MajorTwo.MinorOne.Misc.SignatureJSON[];
        }
      }
    }

    export namespace MinorTwo {
      export interface ProjectJSON extends MinorOne.ProjectJSON {
        changelog: string | null;
      }
    }
  }

  export namespace MajorFour {
    export namespace MinorZero {
      export interface ProjectJSON extends MajorThree.MinorTwo.ProjectJSON {
        classes: ClassJSON[];
        enums: EnumJSON[];
        interfaces: InterfaceJSON[];
      }

      export interface ClassJSON extends MajorThree.MinorZero.ClassJSON {
        construct: ClassJSON.ConstructorJSON;
        methods: ClassJSON.MethodJSON[];
        properties: ClassJSON.PropertyJSON[];
      }

      export namespace ClassJSON {
        export interface ConstructorJSON extends MajorThree.MinorZero.ClassJSON.ConstructorJSON {
          parentId: number;
        }

        export interface MethodJSON extends MajorThree.MinorZero.ClassJSON.MethodJSON {
          parentId: number;
        }

        export interface PropertyJSON extends MajorThree.MinorZero.ClassJSON.PropertyJSON {
          parentId: number;
        }
      }

      export interface EnumJSON extends MajorThree.MinorZero.EnumJSON {
        properties: EnumJSON.PropertyJSON[];
      }

      export namespace EnumJSON {
        export interface PropertyJSON extends MajorThree.MinorZero.EnumJSON.PropertyJSON {
          parentId: number;
        }
      }

      export interface InterfaceJSON extends MajorThree.MinorOne.InterfaceJSON {
        properties: InterfaceJSON.PropertyJSON[];
        methods: InterfaceJSON.MethodJSON[];
      }

      export namespace InterfaceJSON {
        export interface PropertyJSON extends MajorTwo.MinorOne.InterfaceJSON.PropertyJSON {
          parentId: number;
        }

        export interface MethodJSON extends MajorThree.MinorOne.InterfaceJSON.MethodJSON {
          parentId: number;
        }
      }
    }
  }

  export namespace MajorSix {
    export namespace MinorZero {
      export interface ProjectJSON extends Omit<MajorFour.MinorZero.ProjectJSON, 'classes' | 'constants' | 'enums' | 'interfaces'> {
        classes: ClassJSON[];
        enums: EnumJSON[];
        interfaces: InterfaceJSON[];
        variables: VariableJSON[];
      }

      export interface ClassJSON extends Omit<MajorFour.MinorZero.ClassJSON, 'methods'> {
        typeParameters: MajorTwo.MinorOne.Misc.TypeParameterJSON[];
        methods: ClassJSON.MethodJSON[];
      }

      export namespace ClassJSON {
        export type MethodJSON = Omit<MajorFour.MinorZero.ClassJSON.MethodJSON, 'comment'>;
      }

      export interface EnumJSON extends Omit<MajorFour.MinorZero.EnumJSON, 'properties'> {
        members: EnumJSON.MemberJSON[];
      }

      export namespace EnumJSON {
        export type MemberJSON = MajorFour.MinorZero.EnumJSON.PropertyJSON;
      }

      export interface InterfaceJSON extends Omit<MajorFour.MinorZero.InterfaceJSON, 'methods'> {
        methods: InterfaceJSON.MethodJSON[];
      }

      export namespace InterfaceJSON {
        export type MethodJSON = Omit<MajorFour.MinorZero.InterfaceJSON.MethodJSON, 'comment'>;
      }

      export type VariableJSON = MajorThree.MinorZero.ConstantJSON;

      export interface NamespaceJSON extends Omit<MajorThree.MinorZero.NamespaceJSON, 'classes' | 'constants' | 'enums' | 'interfaces'> {
        classes: ClassJSON[];
        enums: EnumJSON[];
        interfaces: InterfaceJSON[];
        variables: VariableJSON[];
      }
    }
  }
}
