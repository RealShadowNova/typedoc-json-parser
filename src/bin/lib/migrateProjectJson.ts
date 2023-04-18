import { bold, yellow } from 'colorette';
import type { FunctionParser } from '../../lib/structures/FunctionParser';
import type { NamespaceParser } from '../../lib/structures/NamespaceParser';
import { ProjectParser } from '../../lib/structures/ProjectParser';
import type { TypeAliasParser } from '../../lib/structures/TypeAliasParser';
import type { VariableParser } from '../../lib/structures/VariableParser';
import { ClassParser } from '../../lib/structures/class-parser';
import type { EnumParser } from '../../lib/structures/enum-parser';
import type { InterfaceParser } from '../../lib/structures/interface-parser';
import type { ParameterParser, SignatureParser, SourceParser, TypeParameterParser } from '../../lib/structures/misc';

const currentTypeDocJsonParserVersion = ProjectParser.version
  .split('.')
  // eslint-disable-next-line radix
  .map((x) => parseInt(x))
  .slice(0, 3)
  .join('.');

export function migrateProjectJson(
  projectJson:
    | Migration.MajorTwo.MinorOne.ProjectJson
    | Migration.MajorTwo.MinorTwo.ProjectJson
    | Migration.MajorTwo.MinorThree.ProjectJson
    | Migration.MajorThree.MinorZero.ProjectJson
    | Migration.MajorThree.MinorOne.ProjectJson
    | Migration.MajorThree.MinorTwo.ProjectJson
    | Migration.MajorFour.MinorZero.ProjectJson
    | Migration.MajorSix.MinorZero.ProjectJson
    | Migration.MajorSeven.MinorZero.ProjectJson
    | Migration.MajorSeven.MinorOne.ProjectJson
): ProjectParser.Json | string {
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
        | Migration.MajorTwo.MinorOne.ProjectJson
        | Migration.MajorTwo.MinorTwo.ProjectJson
        | Migration.MajorTwo.MinorThree.ProjectJson
        | Migration.MajorThree.MinorZero.ProjectJson
        | Migration.MajorThree.MinorOne.ProjectJson
        | Migration.MajorThree.MinorTwo.ProjectJson
        | Migration.MajorFour.MinorZero.ProjectJson;

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

    case '6.0.0':

    case '6.0.1':

    case '6.0.2':

    case '7.0.0':

    case '7.0.1':

    case '7.0.2':

    case '7.1.0':

    case '7.2.0': {
      const { variables } = projectJson as Migration.MajorSix.MinorZero.ProjectJson;

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

  return yellow(
    `${bold(`[WARN]`)} Unsupported typeDocJsonParserVersion(${typeDocJsonParserVersion}) encountered while migrating project ${projectJson.name}${
      'version' in projectJson ? `@${projectJson.version}` : ''
    }`
  );
}

function migrateClassJson(
  classJson:
    | Migration.MajorTwo.MinorOne.ClassJson
    | Migration.MajorTwo.MinorThree.ClassJson
    | Migration.MajorThree.MinorZero.ClassJson
    | Migration.MajorFour.MinorZero.ClassJson
    | Migration.MajorSix.MinorZero.ClassJson
    | Migration.MajorSeven.MinorZero.ClassJson
    | Migration.MajorSeven.MinorOne.ClassJson,
  typeDocJsonParserVersion: string
): ClassParser.Json {
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
          accessibility: ClassParser.Accessibility.Public,
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

    case '6.0.0':

    case '6.0.1':

    case '6.0.2': {
      const { typeParameters } = classJson as Migration.MajorSix.MinorZero.ClassJson;

      return {
        id,
        name,
        comment,
        source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
        external,
        abstract,
        extendsType,
        implementsType,
        typeParameters: typeParameters.map((typeParameterJson) => migrateTypeParameterJson(typeParameterJson, typeDocJsonParserVersion)),
        construct: {
          id: construct.id,
          name: construct.name,
          comment: construct.comment,
          source: construct.source ? migrateSourceJson(construct.source, typeDocJsonParserVersion) : null,
          parentId: id,
          accessibility: ClassParser.Accessibility.Public,
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

    case '7.0.0':

    case '7.0.1':

    case '7.0.2':

    case '7.1.0':

    case '7.2.0': {
      const { typeParameters, construct } = classJson as Migration.MajorSeven.MinorOne.ClassJson;

      return {
        id,
        name,
        comment,
        source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
        external,
        abstract,
        extendsType,
        implementsType,
        typeParameters: typeParameters.map((typeParameterJson) => migrateTypeParameterJson(typeParameterJson, typeDocJsonParserVersion)),
        construct: {
          id: construct.id,
          name: construct.name,
          comment: construct.comment,
          source: construct.source ? migrateSourceJson(construct.source, typeDocJsonParserVersion) : null,
          parentId: id,
          accessibility: construct.accessibility,
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
    | Migration.MajorTwo.MinorOne.EnumJson
    | Migration.MajorThree.MinorZero.EnumJson
    | Migration.MajorFour.MinorZero.EnumJson
    | Migration.MajorSix.MinorZero.EnumJson,
  typeDocJsonParserVersion: string
): EnumParser.Json {
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
        | Migration.MajorTwo.MinorOne.EnumJson
        | Migration.MajorThree.MinorZero.EnumJson
        | Migration.MajorFour.MinorZero.EnumJson;

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

    case '6.0.0':

    case '6.0.1':

    case '6.0.2':

    case '7.0.0':

    case '7.0.1':

    case '7.0.2':

    case '7.1.0':

    case '7.2.0': {
      const { members } = enumJson as Migration.MajorSix.MinorZero.EnumJson;

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
  functionJson:
    | Migration.MajorTwo.MinorOne.FunctionJson
    | Migration.MajorTwo.MinorThree.FunctionJson
    | Migration.MajorThree.MinorZero.FunctionJson
    | Migration.MajorSeven.MinorZero.FunctionJson
    | Migration.MajorSeven.MinorOne.FunctionJson,
  typeDocJsonParserVersion: string
): FunctionParser.Json {
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

    case '6.0.1':

    case '6.0.2':

    case '7.0.0':

    case '7.0.1':

    case '7.0.2':

    case '7.1.0':

    case '7.2.0':
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
    | Migration.MajorTwo.MinorOne.InterfaceJson
    | Migration.MajorThree.MinorZero.InterfaceJson
    | Migration.MajorFour.MinorZero.InterfaceJson
    | Migration.MajorSix.MinorZero.InterfaceJson
    | Migration.MajorSeven.MinorZero.InterfaceJson
    | Migration.MajorSeven.MinorOne.InterfaceJson,
  typeDocJsonParserVersion: string
): InterfaceParser.Json {
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
        typeParameters: [],
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

    case '6.0.0':

    case '6.0.1':

    case '6.0.2': {
      const { methods } = interfaceJson as Migration.MajorThree.MinorOne.InterfaceJson;

      return {
        id,
        name,
        comment,
        source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
        external,
        typeParameters: [],
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

    case '7.0.0':

    case '7.0.1':

    case '7.0.2':

    case '7.1.0':

    case '7.2.0': {
      const { typeParameters, methods } = interfaceJson as Migration.MajorSeven.MinorOne.InterfaceJson;

      return {
        id,
        name,
        comment,
        source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
        external,
        typeParameters,
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
    | Migration.MajorTwo.MinorOne.NamespaceJson
    | Migration.MajorThree.MinorZero.NamespaceJson
    | Migration.MajorSix.MinorZero.NamespaceJson
    | Migration.MajorSeven.MinorZero.NamespaceJson,
  typeDocJsonParserVersion: string
): NamespaceParser.Json {
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
      const { constants } = namespaceJson as Migration.MajorTwo.MinorOne.NamespaceJson | Migration.MajorThree.MinorZero.NamespaceJson;

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

    case '6.0.0':

    case '6.0.1':

    case '6.0.2':

    case '7.0.0':

    case '7.0.1':

    case '7.0.2':

    case '7.1.0':

    case '7.2.0': {
      const { variables } = namespaceJson as Migration.MajorSix.MinorZero.NamespaceJson;

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
  typeAliasJson: Migration.MajorTwo.MinorOne.TypeAliasJson | Migration.MajorThree.MinorZero.TypeAliasJson,
  typeDocJsonParserVersion: string
): TypeAliasParser.Json {
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

    case '6.0.1':

    case '6.0.2':

    case '7.0.0':

    case '7.0.1':

    case '7.0.2':

    case '7.1.0':

    case '7.2.0':
      return {
        id,
        name,
        comment,
        source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
        external,
        typeParameters: typeParameters.map((typeParameterJson) => migrateTypeParameterJson(typeParameterJson, typeDocJsonParserVersion)),
        type
      };
  }

  throw new Error(`Unsupported typeDocJsonParserVersion: ${typeDocJsonParserVersion}`);
}

function migrateVariable(
  variableJson: Migration.MajorTwo.MinorOne.ConstantJson | Migration.MajorThree.MinorZero.ConstantJson,
  typeDocJsonParserVersion: string
): VariableParser.Json {
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

    case '6.0.1':

    case '6.0.2':

    case '7.0.0':

    case '7.0.1':

    case '7.0.2':

    case '7.1.0':

    case '7.2.0':
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
  sourceJson: Migration.MajorTwo.MinorOne.Misc.SourceJson | Migration.MajorThree.MinorZero.Misc.SourceJson,
  typeDocJsonParserVersion: string
): SourceParser.Json {
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

    case '6.0.0':

    case '6.0.1':

    case '6.0.2':

    case '7.0.0':

    case '7.0.1':

    case '7.0.2':

    case '7.1.0':

    case '7.2.0': {
      const { url } = sourceJson as Migration.MajorThree.MinorZero.Misc.SourceJson;

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

function migrateParameterJson(
  parameterJson:
    | Migration.MajorTwo.MinorOne.Misc.ParameterJson
    | Migration.MajorSix.MinorZero.Misc.ParameterJson
    | Migration.MajorSeven.MinorOne.Misc.ParameterJson
    | Migration.MajorSeven.MinorTwo.Misc.ParameterJson,
  typeDocJsonParserVersion: string
): ParameterParser.Json {
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
      return {
        id,
        name,
        comment: {
          description: null,
          blockTags: [],
          modifierTags: []
        },
        rest: false,
        optional: false,
        type
      };

    case '6.0.0':

    case '6.0.1':

    case '6.0.2':

    case '7.0.0':

    case '7.0.1':

    case '7.0.2': {
      const { comment } = parameterJson as Migration.MajorSix.MinorZero.Misc.ParameterJson;

      return {
        id,
        name,
        comment,
        rest: false,
        optional: false,
        type
      };
    }

    case '7.1.0': {
      const { comment, optional } = parameterJson as Migration.MajorSeven.MinorOne.Misc.ParameterJson;

      return {
        id,
        name,
        comment,
        rest: false,
        optional,
        type
      };
    }

    case '7.2.0': {
      const { comment, rest, optional } = parameterJson as Migration.MajorSeven.MinorTwo.Misc.ParameterJson;

      return { id, name, comment, rest, optional, type };
    }
  }

  throw new Error(`Unsupported typeDocJsonParserVersion: ${typeDocJsonParserVersion}`);
}

function migrateSignatureJson(
  signatureJson:
    | Migration.MajorTwo.MinorOne.Misc.SignatureJson
    | Migration.MajorTwo.MinorThree.Misc.SignatureJson
    | Migration.MajorSeven.MinorZero.Misc.SignatureJson
    | Migration.MajorSeven.MinorOne.Misc.SignatureJson,
  typeDocJsonParserVersion: string
): SignatureParser.Json {
  const { id, name, typeParameters, parameters, returnType } = signatureJson;

  switch (typeDocJsonParserVersion) {
    case '2.1.0':

    case '2.2.0':

    case '2.2.1':
      return {
        id,
        name,
        comment: { description: null, blockTags: [], modifierTags: [] },
        typeParameters: typeParameters.map((typeParameterJson) => migrateTypeParameterJson(typeParameterJson, typeDocJsonParserVersion)),
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

    case '6.0.0':

    case '6.0.1':

    case '6.0.2':

    case '7.0.0':

    case '7.0.1':

    case '7.0.2':

    case '7.1.0':

    case '7.2.0': {
      const { comment } = signatureJson as Migration.MajorTwo.MinorThree.Misc.SignatureJson;

      return {
        id,
        name,
        comment,
        typeParameters: typeParameters.map((typeParameterJson) => migrateTypeParameterJson(typeParameterJson, typeDocJsonParserVersion)),
        parameters: parameters.map((parameterJson) => migrateParameterJson(parameterJson, typeDocJsonParserVersion)),
        returnType
      };
    }
  }

  throw new Error(`Unsupported typeDocJsonParserVersion: ${typeDocJsonParserVersion}`);
}

function migrateTypeParameterJson(
  typeParameterJson: Migration.MajorTwo.MinorOne.Misc.TypeParameterJson | Migration.MajorSeven.MinorZero.Misc.TypeParameterJson,
  typeDocJsonParserVersion: string
): TypeParameterParser.Json {
  const { id, name, default: _default } = typeParameterJson;

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

    case '6.0.1':

    case '6.0.2': {
      const { type } = typeParameterJson as Migration.MajorTwo.MinorOne.Misc.TypeParameterJson;

      return {
        id,
        name,
        constraint: type,
        default: _default
      };
    }

    case '7.0.0':

    case '7.0.1':

    case '7.0.2':

    case '7.1.0':

    case '7.2.0': {
      const { constraint } = typeParameterJson as Migration.MajorSeven.MinorZero.Misc.TypeParameterJson;

      return {
        id,
        name,
        constraint,
        default: _default
      };
    }
  }

  throw new Error(`Unsupported typeDocJsonParserVersion: ${typeDocJsonParserVersion}`);
}

export namespace Migration {
  export namespace MajorTwo {
    export namespace MinorOne {
      export interface ProjectJson {
        typeDocJsonParserVersion: string;
        id: number;
        name: string;
        classes: ClassJson[];
        constants: ConstantJson[];
        enums: EnumJson[];
        functions: FunctionJson[];
        interfaces: InterfaceJson[];
        namespaces: NamespaceJson[];
        typeAliases: TypeAliasJson[];
      }

      export interface ClassJson extends Parser {
        external: boolean;
        abstract: boolean;
        extendsType: TypeJson | null;
        implementsType: TypeJson[];
        construct: ClassJson.ConstructorJson;
        properties: ClassJson.PropertyJson[];
        methods: ClassJson.MethodJson[];
      }

      export namespace ClassJson {
        export interface ConstructorJson extends Parser {
          parameters: Misc.ParameterJson[];
        }

        export interface PropertyJson extends Parser {
          accessibility: Accessibility;
          abstract: boolean;
          static: boolean;
          readonly: boolean;
          optional: boolean;
          type: TypeJson;
        }

        export interface MethodJson extends Parser {
          accessibility: Accessibility;
          abstract: boolean;
          static: boolean;
          signatures: Misc.SignatureJson[];
        }

        export enum Accessibility {
          Public = 'public',
          Protected = 'protected',
          Private = 'private'
        }
      }

      export interface ConstantJson extends Parser {
        external: boolean;
        type: TypeJson;
        value: string;
      }

      export interface EnumJson extends Parser {
        external: boolean;

        properties: EnumJson.PropertyJson[];
      }

      export namespace EnumJson {
        export interface PropertyJson extends Parser {
          value: string;
        }
      }

      export interface FunctionJson extends Parser {
        external: boolean;
        signatures: Misc.SignatureJson[];
      }

      export interface InterfaceJson extends Parser {
        external: boolean;
        properties: InterfaceJson.PropertyJson[];
      }

      export namespace InterfaceJson {
        export interface PropertyJson extends Parser {
          readonly: boolean;
          type: TypeJson;
        }
      }

      export interface NamespaceJson extends Parser {
        external: boolean;
        classes: ClassJson[];
        constants: ConstantJson[];
        enums: EnumJson[];
        functions: FunctionJson[];
        interfaces: InterfaceJson[];
        namespaces: NamespaceJson[];
        typeAliases: TypeAliasJson[];
      }

      export interface TypeAliasJson extends Parser {
        external: boolean;
        typeParameters: Misc.TypeParameterJson[];
        type: TypeJson;
      }

      export interface Parser {
        id: number;
        name: string;
        comment: Misc.CommentJson;
        source: Misc.SourceJson | null;
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

      export namespace Misc {
        export interface CommentJson {
          description: string | null;
          blockTags: CommentJson.BlockTag[];
          modifierTags: string[];
        }

        export namespace CommentJson {
          export interface BlockTag {
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
    }

    export namespace MinorTwo {
      export interface ProjectJson extends MinorOne.ProjectJson {
        version: string | null;
      }
    }

    export namespace MinorThree {
      export type ProjectJson = MinorTwo.ProjectJson;

      export interface ClassJson extends MinorOne.ClassJson {
        methods: ClassJson.MethodJson[];
      }

      export namespace ClassJson {
        export interface MethodJson extends MinorOne.ClassJson.MethodJson {
          signatures: Misc.SignatureJson[];
        }
      }

      export interface FunctionJson extends MinorOne.FunctionJson {
        signatures: Misc.SignatureJson[];
      }

      export namespace Misc {
        export interface SignatureJson extends MinorOne.Misc.SignatureJson {
          comment: MinorOne.Misc.CommentJson;
        }
      }
    }
  }

  export namespace MajorThree {
    export namespace MinorZero {
      export interface ProjectJson extends MajorTwo.MinorThree.ProjectJson {
        readme: string | null;
      }

      export interface ClassJson extends MajorTwo.MinorThree.ClassJson {
        source: Misc.SourceJson | null;
      }

      export namespace ClassJson {
        export interface ConstructorJson extends MajorTwo.MinorOne.ClassJson.ConstructorJson {
          source: Misc.SourceJson | null;
        }

        export interface MethodJson extends MajorTwo.MinorThree.ClassJson.MethodJson {
          source: Misc.SourceJson | null;
        }

        export interface PropertyJson extends MajorTwo.MinorOne.ClassJson.PropertyJson {
          source: Misc.SourceJson | null;
        }
      }

      export interface ConstantJson extends MajorTwo.MinorOne.ConstantJson {
        source: Misc.SourceJson | null;
      }

      export interface EnumJson extends MajorTwo.MinorOne.EnumJson {
        source: Misc.SourceJson | null;
      }

      export namespace EnumJson {
        export interface PropertyJson extends MajorTwo.MinorOne.EnumJson.PropertyJson {
          source: Misc.SourceJson | null;
        }
      }

      export interface FunctionJson extends MajorTwo.MinorThree.FunctionJson {
        source: Misc.SourceJson | null;
      }

      export interface InterfaceJson extends MajorTwo.MinorOne.InterfaceJson {
        source: Misc.SourceJson | null;
      }

      export namespace InterfaceJson {
        export interface PropertyJson extends MajorTwo.MinorOne.InterfaceJson.PropertyJson {
          source: Misc.SourceJson | null;
        }
      }

      export interface NamespaceJson extends MajorTwo.MinorOne.NamespaceJson {
        source: Misc.SourceJson | null;
        classes: ClassJson[];
        constants: ConstantJson[];
        enums: EnumJson[];
        functions: FunctionJson[];
        interfaces: InterfaceJson[];
        namespaces: NamespaceJson[];
        typeAliases: TypeAliasJson[];
      }

      export interface TypeAliasJson extends MajorTwo.MinorOne.TypeAliasJson {
        source: Misc.SourceJson | null;
      }

      export namespace Misc {
        export interface SourceJson extends MajorTwo.MinorOne.Misc.SourceJson {
          url: string | null;
        }
      }
    }

    export namespace MinorOne {
      export interface ProjectJson extends MinorZero.ProjectJson {
        interfaces: InterfaceJson[];
      }

      export interface InterfaceJson extends MinorZero.InterfaceJson {
        methods: InterfaceJson.MethodJson[];
      }

      export namespace InterfaceJson {
        export interface MethodJson extends MajorTwo.MinorOne.Parser {
          signatures: MajorTwo.MinorOne.Misc.SignatureJson[];
        }
      }
    }

    export namespace MinorTwo {
      export interface ProjectJson extends MinorOne.ProjectJson {
        changelog: string | null;
      }
    }
  }

  export namespace MajorFour {
    export namespace MinorZero {
      export interface ProjectJson extends MajorThree.MinorTwo.ProjectJson {
        classes: ClassJson[];
        enums: EnumJson[];
        interfaces: InterfaceJson[];
      }

      export interface ClassJson extends MajorThree.MinorZero.ClassJson {
        construct: ClassJson.ConstructorJson;
        methods: ClassJson.MethodJson[];
        properties: ClassJson.PropertyJson[];
      }

      export namespace ClassJson {
        export interface ConstructorJson extends MajorThree.MinorZero.ClassJson.ConstructorJson {
          parentId: number;
        }

        export interface MethodJson extends MajorThree.MinorZero.ClassJson.MethodJson {
          parentId: number;
        }

        export interface PropertyJson extends MajorThree.MinorZero.ClassJson.PropertyJson {
          parentId: number;
        }
      }

      export interface EnumJson extends MajorThree.MinorZero.EnumJson {
        properties: EnumJson.PropertyJson[];
      }

      export namespace EnumJson {
        export interface PropertyJson extends MajorThree.MinorZero.EnumJson.PropertyJson {
          parentId: number;
        }
      }

      export interface InterfaceJson extends MajorThree.MinorOne.InterfaceJson {
        properties: InterfaceJson.PropertyJson[];
        methods: InterfaceJson.MethodJson[];
      }

      export namespace InterfaceJson {
        export interface PropertyJson extends MajorTwo.MinorOne.InterfaceJson.PropertyJson {
          parentId: number;
        }

        export interface MethodJson extends MajorThree.MinorOne.InterfaceJson.MethodJson {
          parentId: number;
        }
      }
    }
  }

  export namespace MajorSix {
    export namespace MinorZero {
      export interface ProjectJson extends Omit<MajorFour.MinorZero.ProjectJson, 'classes' | 'constants' | 'enums' | 'interfaces'> {
        classes: ClassJson[];
        enums: EnumJson[];
        interfaces: InterfaceJson[];
        variables: VariableJson[];
      }

      export interface ClassJson extends Omit<MajorFour.MinorZero.ClassJson, 'methods'> {
        typeParameters: MajorTwo.MinorOne.Misc.TypeParameterJson[];
        methods: ClassJson.MethodJson[];
      }

      export namespace ClassJson {
        export interface MethodJson extends Omit<MajorFour.MinorZero.ClassJson.MethodJson, 'comment' | 'signatures'> {
          signatures: Misc.SignatureJson[];
        }
      }

      export interface EnumJson extends Omit<MajorFour.MinorZero.EnumJson, 'properties'> {
        members: EnumJson.MemberJson[];
      }

      export namespace EnumJson {
        export type MemberJson = MajorFour.MinorZero.EnumJson.PropertyJson;
      }

      export interface InterfaceJson extends Omit<MajorFour.MinorZero.InterfaceJson, 'methods'> {
        methods: InterfaceJson.MethodJson[];
      }

      export namespace InterfaceJson {
        export interface MethodJson extends Omit<MajorFour.MinorZero.InterfaceJson.MethodJson, 'comment'> {
          signatures: Misc.SignatureJson[];
        }
      }

      export interface FunctionJson extends Omit<MajorTwo.MinorThree.FunctionJson, 'signatures'> {
        signatures: Misc.SignatureJson[];
      }

      export type VariableJson = MajorThree.MinorZero.ConstantJson;

      export interface NamespaceJson extends Omit<MajorThree.MinorZero.NamespaceJson, 'classes' | 'constants' | 'enums' | 'interfaces'> {
        classes: ClassJson[];
        enums: EnumJson[];
        interfaces: InterfaceJson[];
        variables: VariableJson[];
      }

      export namespace Misc {
        export interface ParameterJson extends MajorTwo.MinorOne.Misc.ParameterJson {
          comment: MajorTwo.MinorOne.Misc.CommentJson;
        }

        export interface SignatureJson extends MajorTwo.MinorOne.Misc.SignatureJson {
          parameters: ParameterJson[];
        }
      }
    }
  }

  export namespace MajorSeven {
    export namespace MinorZero {
      export interface ProjectJson extends Omit<MajorSix.MinorZero.ProjectJson, 'classes' | 'interfaces' | 'functions' | 'namespaces'> {
        classes: ClassJson[];
        interfaces: InterfaceJson[];
        functions: FunctionJson[];
        namespaces: NamespaceJson[];
      }

      export interface NamespaceJson extends Omit<MajorSix.MinorZero.NamespaceJson, 'classes' | 'interfaces' | 'functions'> {
        classes: ClassJson[];
        interfaces: InterfaceJson[];
        functions: FunctionJson[];
      }

      export interface ClassJson extends Omit<MajorSix.MinorZero.ClassJson, 'construct' | 'methods'> {
        construct: ClassJson.ConstructorJson;
        methods: ClassJson.MethodJson[];
      }

      export namespace ClassJson {
        export interface ConstructorJson extends MajorFour.MinorZero.ClassJson.ConstructorJson {
          accessibility: MajorTwo.MinorOne.ClassJson.Accessibility;
        }

        export interface MethodJson extends Omit<MajorSix.MinorZero.ClassJson.MethodJson, 'signatures'> {
          signatures: Misc.SignatureJson[];
        }
      }

      export interface InterfaceJson extends Omit<MajorSix.MinorZero.InterfaceJson, 'methods'> {
        typeParameters: Misc.TypeParameterJson[];
        methods: InterfaceJson.MethodJson[];
      }

      export namespace InterfaceJson {
        export interface MethodJson extends Omit<MajorSix.MinorZero.InterfaceJson.MethodJson, 'signatures'> {
          signatures: Misc.SignatureJson[];
        }
      }

      export interface FunctionJson extends Omit<MajorThree.MinorZero.FunctionJson, 'signatures'> {
        signatures: Misc.SignatureJson[];
      }

      export namespace Misc {
        export interface SignatureJson extends Omit<MajorSix.MinorZero.Misc.SignatureJson, 'typeParameters'> {
          typeParameters: TypeParameterJson[];
        }

        export interface TypeParameterJson extends Omit<MajorTwo.MinorOne.Misc.TypeParameterJson, 'type'> {
          constraint: MajorTwo.MinorOne.TypeJson | null;
        }
      }
    }

    export namespace MinorOne {
      export interface ProjectJson extends Omit<MinorZero.ProjectJson, 'classes' | 'interfaces' | 'functions' | 'namespaces'> {
        classes: ClassJson[];
        interfaces: InterfaceJson[];
        functions: FunctionJson[];
        namespaces: NamespaceJson[];
      }

      export interface NamespaceJson extends Omit<MinorZero.NamespaceJson, 'classes' | 'interfaces' | 'functions'> {
        classes: ClassJson[];
        interfaces: InterfaceJson[];
        functions: FunctionJson[];
      }

      export interface ClassJson extends Omit<MinorZero.ClassJson, 'construct' | 'methods'> {
        construct: ClassJson.ConstructorJson;
        methods: ClassJson.MethodJson[];
      }

      export namespace ClassJson {
        export interface ConstructorJson extends Omit<MinorZero.ClassJson.ConstructorJson, 'signatures'> {
          signatures: Misc.SignatureJson[];
        }

        export interface MethodJson extends Omit<MinorZero.ClassJson.MethodJson, 'signatures'> {
          signatures: Misc.SignatureJson[];
        }
      }

      export interface InterfaceJson extends Omit<MinorZero.InterfaceJson, 'methods'> {
        methods: InterfaceJson.MethodJson[];
      }

      export namespace InterfaceJson {
        export interface MethodJson extends Omit<MinorZero.InterfaceJson.MethodJson, 'signatures'> {
          signatures: Misc.SignatureJson[];
        }
      }

      export interface FunctionJson extends Omit<MinorZero.FunctionJson, 'signatures'> {
        signatures: Misc.SignatureJson[];
      }

      export namespace Misc {
        export interface SignatureJson extends MinorZero.Misc.SignatureJson {
          parameters: ParameterJson[];
        }

        export interface ParameterJson extends MajorSix.MinorZero.Misc.ParameterJson {
          optional: boolean;
        }
      }
    }

    export namespace MinorTwo {
      export interface ProjectJson extends Omit<MinorZero.ProjectJson, 'classes' | 'interfaces' | 'functions' | 'namespaces'> {
        classes: ClassJson[];
        interfaces: InterfaceJson[];
        functions: FunctionJson[];
        namespaces: NamespaceJson[];
      }

      export interface NamespaceJson extends Omit<MinorZero.NamespaceJson, 'classes' | 'interfaces' | 'functions'> {
        classes: ClassJson[];
        interfaces: InterfaceJson[];
        functions: FunctionJson[];
      }

      export interface ClassJson extends Omit<MinorZero.ClassJson, 'construct' | 'methods'> {
        construct: ClassJson.ConstructorJson;
        methods: ClassJson.MethodJson[];
      }

      export namespace ClassJson {
        export interface ConstructorJson extends Omit<MinorZero.ClassJson.ConstructorJson, 'signatures'> {
          signatures: Misc.SignatureJson[];
        }

        export interface MethodJson extends Omit<MinorZero.ClassJson.MethodJson, 'signatures'> {
          signatures: Misc.SignatureJson[];
        }
      }

      export interface InterfaceJson extends Omit<MinorZero.InterfaceJson, 'methods'> {
        methods: InterfaceJson.MethodJson[];
      }

      export namespace InterfaceJson {
        export interface MethodJson extends Omit<MinorZero.InterfaceJson.MethodJson, 'signatures'> {
          signatures: Misc.SignatureJson[];
        }
      }

      export interface FunctionJson extends Omit<MinorZero.FunctionJson, 'signatures'> {
        signatures: Misc.SignatureJson[];
      }

      export namespace Misc {
        export interface SignatureJson extends MinorZero.Misc.SignatureJson {
          parameters: ParameterJson[];
        }

        export interface ParameterJson extends MinorOne.Misc.ParameterJson {
          rest: boolean;
        }
      }
    }

    export namespace MinorThree {
      export interface ProjectJson
        extends Omit<MinorTwo.ProjectJson, 'classes' | 'interfaces' | 'functions' | 'namespaces' | 'variables' | 'enums' | 'typeAliases'> {
        classes: ClassJson[];
        interfaces: InterfaceJson[];
        functions: FunctionJson[];
        namespaces: NamespaceJson[];
        variables: VariableJson[];
        enums: EnumJson[];
        typeAliases: TypeAliasJson[];
      }

      export interface NamespaceJson
        extends Omit<MinorTwo.NamespaceJson, 'classes' | 'interfaces' | 'functions' | 'variables' | 'enums' | 'typeAliases'> {
        classes: ClassJson[];
        interfaces: InterfaceJson[];
        functions: FunctionJson[];
        variables: VariableJson[];
        enums: EnumJson[];
        typeAliases: TypeAliasJson[];
        namespaces: NamespaceJson[];
      }

      export interface ClassJson extends MinorTwo.ClassJson {
        namespaceParentId: string | null;
      }

      export interface InterfaceJson extends MinorTwo.InterfaceJson {
        namespaceParentId: string | null;
      }

      export interface FunctionJson extends MinorTwo.FunctionJson {
        namespaceParentId: string | null;
      }

      export interface VariableJson extends MajorSix.MinorZero.VariableJson {
        namespaceParentId: string | null;
      }

      export interface EnumJson extends MajorSix.MinorZero.EnumJson {
        namespaceParentId: string | null;
      }

      export interface TypeAliasJson extends MajorThree.MinorZero.TypeAliasJson {
        namespaceParentId: string | null;
      }
    }
  }
}
