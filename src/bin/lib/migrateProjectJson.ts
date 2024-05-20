import { Version } from '#bin/lib/types';
import { FunctionParser } from '#lib/structures/FunctionParser';
import { NamespaceParser } from '#lib/structures/NamespaceParser';
import { ProjectParser } from '#lib/structures/ProjectParser';
import { TypeAliasParser } from '#lib/structures/TypeAliasParser';
import { VariableParser } from '#lib/structures/VariableParser';
import { ClassConstructorParser, ClassMethodParser, ClassParser, ClassPropertyParser } from '#lib/structures/class-parser';
import { EnumMemberParser, EnumParser } from '#lib/structures/enum-parser';
import { InterfaceMethodParser, InterfaceParser, InterfacePropertyParser } from '#lib/structures/interface-parser';
import {
  CommentParser,
  MethodParser,
  ParameterParser,
  PropertyParser,
  SignatureParser,
  SourceParser,
  TypeParameterParser
} from '#lib/structures/misc';
import { TypeParser } from '#lib/structures/type-parsers';
import { ReflectionKind } from '#lib/types';
import { bold, yellow } from 'colorette';

const currentTypeDocJsonParserVersion = ProjectParser.version
  .split('.')
  // eslint-disable-next-line radix
  .map((x) => parseInt(x))
  .slice(0, 3)
  .join('.');

export function migrateProjectJson(
  projectJson:
    | Version.Two.Zero.ProjectJson
    | Version.Two.One.ProjectJson
    | Version.Two.Two.ProjectJson
    | Version.Two.Three.ProjectJson
    | Version.Three.Zero.ProjectJson
    | Version.Three.One.ProjectJson
    | Version.Three.Two.ProjectJson
    | Version.Four.Zero.ProjectJson
    | Version.Five.Zero.ProjectJson
    | Version.Six.Zero.ProjectJson
    | Version.Seven.Zero.ProjectJson
    | Version.Seven.One.ProjectJson
    | Version.Seven.Two.ProjectJson
    | Version.Seven.Three.ProjectJson
    | Version.Seven.Four.ProjectJson
    | Version.Eight.Zero.ProjectJson
    | Version.Eight.One.ProjectJson
    | Version.Nine.Zero.ProjectJson
    | Version.Ten.Zero.ProjectJson
): ProjectParser.Json | string {
  const typeDocJsonParserVersion = 'typeDocJsonParserVersion' in projectJson ? projectJson.typeDocJsonParserVersion : '2.0.0';

  if (typeDocJsonParserVersion === currentTypeDocJsonParserVersion) {
    return projectJson as ProjectParser.Json;
  }

  // eslint-disable-next-line radix
  const [currentMajor, currentMinor, currentPatch] = currentTypeDocJsonParserVersion.split('.').map((x) => parseInt(x));
  // eslint-disable-next-line radix
  const [major, minor, patch] = typeDocJsonParserVersion.split('.').map((x) => parseInt(x));

  if (
    major > currentMajor ||
    (major === currentMajor && minor > currentMinor) ||
    (major === currentMajor && minor === currentMinor && patch > currentPatch)
  ) {
    return yellow(
      `${bold('[WARN]')} Unknown version of "typedoc-json-parser" encountered. Received "${typeDocJsonParserVersion}" from "${projectJson.name}"${
        'version' in projectJson ? ` with version "${projectJson.version}"` : ''
      }.`
    );
  }

  const { id, name, classes, enums, functions, interfaces, namespaces, typeAliases } = projectJson;

  if (major < 6) {
    const { constants } = projectJson as
      | Version.Two.Zero.ProjectJson
      | Version.Two.One.ProjectJson
      | Version.Two.Two.ProjectJson
      | Version.Two.Three.ProjectJson
      | Version.Three.Zero.ProjectJson
      | Version.Three.One.ProjectJson
      | Version.Three.Two.ProjectJson
      | Version.Four.Zero.ProjectJson
      | Version.Five.Zero.ProjectJson;

    return {
      typeDocJsonParserVersion: currentTypeDocJsonParserVersion,
      id,
      name,
      version: 'version' in projectJson ? projectJson.version : null,
      dependencies: {},
      readme: 'readme' in projectJson ? projectJson.readme : null,
      changelog: 'changelog' in projectJson ? projectJson.changelog : null,
      classes: classes.map((classJson) => migrateClassJson(classJson, null, [major, minor, patch])),
      enums: enums.map((enumJson) => migrateEnumJson(enumJson, null, [major, minor, patch])),
      functions: functions.map((functionJson) => migrateFunctionJson(functionJson, null, [major, minor, patch])),
      interfaces: interfaces.map((interfaceJson) => migrateInterfaceJson(interfaceJson, null, [major, minor, patch])),
      namespaces: namespaces.map((namespaceJson) => migrateNamespaceJson(namespaceJson, null, [major, minor, patch])),
      typeAliases: typeAliases.map((typeAliasJson) => migrateTypeAliasJson(typeAliasJson, null, [major, minor, patch])),
      variables: constants.map((constantJson) => migrateVariableJson(constantJson, null, [major, minor, patch]))
    };
  }

  const { version, readme, changelog, variables } = projectJson as
    | Version.Six.Zero.ProjectJson
    | Version.Seven.Zero.ProjectJson
    | Version.Seven.One.ProjectJson
    | Version.Seven.Two.ProjectJson
    | Version.Seven.Three.ProjectJson
    | Version.Seven.Four.ProjectJson
    | Version.Eight.Zero.ProjectJson
    | Version.Eight.One.ProjectJson
    | Version.Eight.Two.ProjectJson
    | Version.Nine.Zero.ProjectJson
    | Version.Ten.Zero.ProjectJson
    | Version.Ten.One.ProjectJson;

  return {
    typeDocJsonParserVersion: currentTypeDocJsonParserVersion,
    id,
    name,
    version,
    dependencies: 'dependencies' in projectJson ? (projectJson.dependencies as Record<string, string>) : {},
    readme,
    changelog,
    classes: classes.map((classJson) => migrateClassJson(classJson, null, [major, minor, patch])),
    enums: enums.map((enumJson) => migrateEnumJson(enumJson, null, [major, minor, patch])),
    functions: functions.map((functionJson) => migrateFunctionJson(functionJson, null, [major, minor, patch])),
    interfaces: interfaces.map((interfaceJson) => migrateInterfaceJson(interfaceJson, null, [major, minor, patch])),
    namespaces: namespaces.map((namespaceJson) => migrateNamespaceJson(namespaceJson, null, [major, minor, patch])),
    typeAliases: typeAliases.map((typeAliasJson) => migrateTypeAliasJson(typeAliasJson, null, [major, minor, patch])),
    variables: variables.map((variableJson) => migrateVariableJson(variableJson, null, [major, minor, patch]))
  };
}

function migrateClassJson(
  classJson:
    | Version.Two.Zero.ClassJson
    | Version.Two.One.ClassJson
    | Version.Two.Two.ClassJson
    | Version.Two.Three.ClassJson
    | Version.Three.Zero.ClassJson
    | Version.Three.One.ClassJson
    | Version.Three.Two.ClassJson
    | Version.Four.Zero.ClassJson
    | Version.Five.Zero.ClassJson
    | Version.Six.Zero.ClassJson
    | Version.Seven.Zero.ClassJson
    | Version.Seven.One.ClassJson
    | Version.Seven.Two.ClassJson
    | Version.Seven.Three.ClassJson
    | Version.Seven.Four.ClassJson
    | Version.Eight.Zero.ClassJson
    | Version.Eight.One.ClassJson,
  namespaceParentId: number | null,
  typeDocJsonParserVersion: [number, number, number]
): ClassParser.Json {
  const [major] = typeDocJsonParserVersion;
  const { id, name, comment, source, external, abstract, extendsType, implementsType, construct, properties, methods } = classJson;

  if (major < 6) {
    return {
      id,
      name,
      namespaceParentId,
      comment: migrateCommentJson(comment, typeDocJsonParserVersion),
      source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
      external,
      abstract,
      extendsType: extendsType ? migrateTypeJson(extendsType, typeDocJsonParserVersion) : null,
      implementsType: implementsType ? implementsType.map((typeJson) => migrateTypeJson(typeJson, typeDocJsonParserVersion)) : [],
      typeParameters: [],
      construct: migrateClassConstructorJson(construct, id, typeDocJsonParserVersion),
      properties: properties.map((propertyJson) => migrateClassPropertyJson(propertyJson, id, typeDocJsonParserVersion)),
      methods: methods.map((methodJson) => migrateClassMethodJson(methodJson, id, typeDocJsonParserVersion))
    };
  }

  const { typeParameters } = classJson as
    | Version.Six.Zero.ClassJson
    | Version.Seven.Zero.ClassJson
    | Version.Seven.One.ClassJson
    | Version.Seven.Two.ClassJson
    | Version.Seven.Three.ClassJson
    | Version.Seven.Four.ClassJson
    | Version.Eight.Zero.ClassJson
    | Version.Eight.One.ClassJson
    | Version.Eight.Two.ClassJson;

  return {
    id,
    name,
    namespaceParentId,
    comment: migrateCommentJson(comment, typeDocJsonParserVersion),
    source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
    external,
    abstract,
    extendsType: extendsType ? migrateTypeJson(extendsType, typeDocJsonParserVersion) : null,
    implementsType: implementsType ? implementsType.map((typeJson) => migrateTypeJson(typeJson, typeDocJsonParserVersion)) : [],
    typeParameters: typeParameters
      ? typeParameters.map((typeParameterJson) => migrateTypeParameterJson(typeParameterJson, typeDocJsonParserVersion))
      : [],
    construct: migrateClassConstructorJson(construct, id, typeDocJsonParserVersion),
    properties: properties.map((propertyJson) => migrateClassPropertyJson(propertyJson, id, typeDocJsonParserVersion)),
    methods: methods.map((methodJson) => migrateClassMethodJson(methodJson, id, typeDocJsonParserVersion))
  };
}

function migrateClassConstructorJson(
  constructorJson:
    | Version.Two.Zero.ClassJson.ConstructorJson
    | Version.Two.One.ClassJson.ConstructorJson
    | Version.Two.Two.ClassJson.ConstructorJson
    | Version.Two.Three.ClassJson.ConstructorJson
    | Version.Three.Zero.ClassJson.ConstructorJson
    | Version.Three.One.ClassJson.ConstructorJson
    | Version.Three.Two.ClassJson.ConstructorJson
    | Version.Four.Zero.ClassJson.ConstructorJson
    | Version.Five.Zero.ClassJson.ConstructorJson
    | Version.Six.Zero.ClassJson.ConstructorJson
    | Version.Seven.Zero.ClassJson.ConstructorJson
    | Version.Seven.One.ClassJson.ConstructorJson
    | Version.Seven.Two.ClassJson.ConstructorJson
    | Version.Seven.Three.ClassJson.ConstructorJson
    | Version.Seven.Four.ClassJson.ConstructorJson
    | Version.Eight.Zero.ClassJson.ConstructorJson
    | Version.Eight.One.ClassJson.ConstructorJson,
  parentId: number,
  typeDocJsonParserVersion: [number, number, number]
): ClassConstructorParser.Json {
  const [major] = typeDocJsonParserVersion;
  const { id, name, comment, source, parameters } = constructorJson;

  if (major < 7) {
    return {
      id,
      name,
      comment: migrateCommentJson(comment, typeDocJsonParserVersion),
      parentId,
      source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
      accessibility: ClassParser.Accessibility.Public,
      parameters: parameters.map((parameterJson) => migrateParameterJson(parameterJson, typeDocJsonParserVersion))
    };
  }

  const { accessibility } = constructorJson as
    | Version.Seven.Zero.ClassJson.ConstructorJson
    | Version.Seven.One.ClassJson.ConstructorJson
    | Version.Seven.Two.ClassJson.ConstructorJson
    | Version.Seven.Three.ClassJson.ConstructorJson
    | Version.Seven.Four.ClassJson.ConstructorJson
    | Version.Eight.Zero.ClassJson.ConstructorJson
    | Version.Eight.One.ClassJson.ConstructorJson
    | Version.Eight.Two.ClassJson.ConstructorJson;

  return {
    id,
    name,
    comment: migrateCommentJson(comment, typeDocJsonParserVersion),
    parentId,
    source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
    accessibility,
    parameters: parameters.map((parameterJson) => migrateParameterJson(parameterJson, typeDocJsonParserVersion))
  };
}

function migrateClassPropertyJson(
  propertyJson:
    | Version.Two.Zero.ClassJson.PropertyJson
    | Version.Two.One.ClassJson.PropertyJson
    | Version.Two.Two.ClassJson.PropertyJson
    | Version.Two.Three.ClassJson.PropertyJson
    | Version.Three.Zero.ClassJson.PropertyJson
    | Version.Three.One.ClassJson.PropertyJson
    | Version.Three.Two.ClassJson.PropertyJson
    | Version.Four.Zero.ClassJson.PropertyJson
    | Version.Five.Zero.ClassJson.PropertyJson
    | Version.Six.Zero.ClassJson.PropertyJson
    | Version.Seven.Zero.ClassJson.PropertyJson
    | Version.Seven.One.ClassJson.PropertyJson
    | Version.Seven.Two.ClassJson.PropertyJson
    | Version.Seven.Three.ClassJson.PropertyJson
    | Version.Seven.Four.ClassJson.PropertyJson
    | Version.Eight.Zero.ClassJson.PropertyJson
    | Version.Eight.One.ClassJson.PropertyJson,
  parentId: number,
  typeDocJsonParserVersion: [number, number, number]
): ClassPropertyParser.Json {
  const { id, name, comment, source, accessibility, abstract, static: _static, readonly, optional, type } = propertyJson;

  return {
    id,
    name,
    comment: migrateCommentJson(comment, typeDocJsonParserVersion),
    source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
    parentId,
    accessibility,
    abstract,
    static: _static,
    readonly,
    optional,
    type: migrateTypeJson(type!, typeDocJsonParserVersion)
  };
}

function migrateClassMethodJson(
  methodJson:
    | Version.Two.Zero.ClassJson.MethodJson
    | Version.Two.One.ClassJson.MethodJson
    | Version.Two.Two.ClassJson.MethodJson
    | Version.Two.Three.ClassJson.MethodJson
    | Version.Three.Zero.ClassJson.MethodJson
    | Version.Three.One.ClassJson.MethodJson
    | Version.Three.Two.ClassJson.MethodJson
    | Version.Four.Zero.ClassJson.MethodJson
    | Version.Five.Zero.ClassJson.MethodJson
    | Version.Six.Zero.ClassJson.MethodJson
    | Version.Seven.Zero.ClassJson.MethodJson
    | Version.Seven.One.ClassJson.MethodJson
    | Version.Seven.Two.ClassJson.MethodJson
    | Version.Seven.Three.ClassJson.MethodJson
    | Version.Seven.Four.ClassJson.MethodJson
    | Version.Eight.Zero.ClassJson.MethodJson
    | Version.Eight.One.ClassJson.MethodJson,
  parentId: number,
  typeDocJsonParserVersion: [number, number, number]
): ClassMethodParser.Json {
  const { id, name, source, accessibility, abstract, static: _static, signatures } = methodJson;

  return {
    id,
    name,
    source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
    parentId,
    accessibility,
    abstract,
    static: _static,
    signatures: signatures.map((signatureJson) => migrateSignatureJson(signatureJson, typeDocJsonParserVersion))
  };
}

function migrateEnumJson(
  enumJson:
    | Version.Two.Zero.EnumJson
    | Version.Two.One.EnumJson
    | Version.Two.Two.EnumJson
    | Version.Two.Three.EnumJson
    | Version.Three.Zero.EnumJson
    | Version.Three.One.EnumJson
    | Version.Three.Two.EnumJson
    | Version.Four.Zero.EnumJson
    | Version.Five.Zero.EnumJson
    | Version.Six.Zero.EnumJson
    | Version.Seven.Zero.EnumJson
    | Version.Seven.One.EnumJson
    | Version.Seven.Two.EnumJson
    | Version.Seven.Three.EnumJson
    | Version.Seven.Four.EnumJson
    | Version.Eight.Zero.EnumJson
    | Version.Eight.One.EnumJson,
  namespaceParentId: number | null,
  typeDocJsonParserVersion: [number, number, number]
): EnumParser.Json {
  const [major] = typeDocJsonParserVersion;
  const { id, name, comment, source, external } = enumJson;

  if (major < 6) {
    const { properties } = enumJson as
      | Version.Two.Zero.EnumJson
      | Version.Two.One.EnumJson
      | Version.Two.Two.EnumJson
      | Version.Two.Three.EnumJson
      | Version.Three.Zero.EnumJson
      | Version.Three.One.EnumJson
      | Version.Three.Two.EnumJson
      | Version.Four.Zero.EnumJson
      | Version.Five.Zero.EnumJson;

    return {
      id,
      name,
      comment: migrateCommentJson(comment, typeDocJsonParserVersion),
      source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
      namespaceParentId,
      external,
      members: properties.map((propertyJson) => migrateEnumMemberJson(propertyJson, id, typeDocJsonParserVersion))
    };
  }

  const { members } = enumJson as
    | Version.Six.Zero.EnumJson
    | Version.Seven.Zero.EnumJson
    | Version.Seven.One.EnumJson
    | Version.Seven.Two.EnumJson
    | Version.Seven.Three.EnumJson
    | Version.Seven.Four.EnumJson
    | Version.Eight.Zero.EnumJson
    | Version.Eight.One.EnumJson
    | Version.Eight.Two.EnumJson;

  return {
    id,
    name,
    comment: migrateCommentJson(comment, typeDocJsonParserVersion),
    source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
    namespaceParentId,
    external,
    members: members.map((memberJson) => migrateEnumMemberJson(memberJson, id, typeDocJsonParserVersion))
  };
}

function migrateEnumMemberJson(
  enumMemberJson:
    | Version.Two.Zero.EnumJson.PropertyJson
    | Version.Two.One.EnumJson.PropertyJson
    | Version.Two.Two.EnumJson.PropertyJson
    | Version.Two.Three.EnumJson.PropertyJson
    | Version.Three.Zero.EnumJson.PropertyJson
    | Version.Three.One.EnumJson.PropertyJson
    | Version.Three.Two.EnumJson.PropertyJson
    | Version.Four.Zero.EnumJson.PropertyJson
    | Version.Five.Zero.EnumJson.PropertyJson
    | Version.Six.Zero.EnumJson.MemberJson
    | Version.Seven.Zero.EnumJson.MemberJson
    | Version.Seven.One.EnumJson.MemberJson
    | Version.Seven.Two.EnumJson.MemberJson
    | Version.Seven.Three.EnumJson.MemberJson
    | Version.Seven.Four.EnumJson.MemberJson
    | Version.Eight.Zero.EnumJson.MemberJson
    | Version.Eight.One.EnumJson.MemberJson,
  parentId: number,
  typeDocJsonParserVersion: [number, number, number]
): EnumMemberParser.Json {
  const { id, name, comment, source, value } = enumMemberJson;

  return {
    id,
    name,
    comment: migrateCommentJson(comment, typeDocJsonParserVersion),
    source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
    parentId,
    value
  };
}

function migrateInterfaceJson(
  interfaceJson:
    | Version.Two.Zero.InterfaceJson
    | Version.Two.One.InterfaceJson
    | Version.Two.Two.InterfaceJson
    | Version.Two.Three.InterfaceJson
    | Version.Three.Zero.InterfaceJson
    | Version.Three.One.InterfaceJson
    | Version.Three.Two.InterfaceJson
    | Version.Four.Zero.InterfaceJson
    | Version.Five.Zero.InterfaceJson
    | Version.Six.Zero.InterfaceJson
    | Version.Seven.Zero.InterfaceJson
    | Version.Seven.One.InterfaceJson
    | Version.Seven.Two.InterfaceJson
    | Version.Seven.Three.InterfaceJson
    | Version.Seven.Four.InterfaceJson
    | Version.Eight.Zero.InterfaceJson
    | Version.Eight.One.InterfaceJson,
  namespaceParentId: number | null,
  typeDocJsonParserVersion: [number, number, number]
): InterfaceParser.Json {
  const [major, minor] = typeDocJsonParserVersion;
  const { id, name, comment, source, external, properties } = interfaceJson;

  if (major < 4) {
    if (!(major === 3 && minor >= 1)) {
      return {
        id,
        name,
        comment: migrateCommentJson(comment, typeDocJsonParserVersion),
        source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
        namespaceParentId,
        external,
        typeParameters: [],
        properties: properties.map((propertyJson) => migrateInterfacePropertyJson(propertyJson, id, typeDocJsonParserVersion)),
        methods: []
      };
    }
  }

  if (major < 7) {
    if (!(major === 3 && minor <= 1)) {
      const { methods } = interfaceJson as
        | Version.Three.One.InterfaceJson
        | Version.Three.Two.InterfaceJson
        | Version.Four.Zero.InterfaceJson
        | Version.Five.Zero.InterfaceJson
        | Version.Six.Zero.InterfaceJson;

      return {
        id,
        name,
        comment: migrateCommentJson(comment, typeDocJsonParserVersion),
        source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
        namespaceParentId,
        external,
        typeParameters: [],
        properties: properties.map((propertyJson) => migrateInterfacePropertyJson(propertyJson, id, typeDocJsonParserVersion)),
        methods: methods.map((methodJson) => migrateInterfaceMethodJson(methodJson, id, typeDocJsonParserVersion))
      };
    }
  }

  const { typeParameters, methods } = interfaceJson as
    | Version.Seven.Zero.InterfaceJson
    | Version.Seven.One.InterfaceJson
    | Version.Seven.Two.InterfaceJson
    | Version.Seven.Three.InterfaceJson
    | Version.Seven.Four.InterfaceJson
    | Version.Eight.Zero.InterfaceJson
    | Version.Eight.One.InterfaceJson
    | Version.Eight.Two.InterfaceJson;

  return {
    id,
    name,
    comment: migrateCommentJson(comment, typeDocJsonParserVersion),
    source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
    namespaceParentId,
    external,
    typeParameters: typeParameters.map((typeParameterJson) => migrateTypeParameterJson(typeParameterJson, typeDocJsonParserVersion)),
    properties: properties.map((propertyJson) => migrateInterfacePropertyJson(propertyJson, id, typeDocJsonParserVersion)),
    methods: methods.map((methodJson) => migrateInterfaceMethodJson(methodJson, id, typeDocJsonParserVersion))
  };
}

function migrateInterfacePropertyJson(
  propertyJson:
    | Version.Two.Zero.InterfaceJson.PropertyJson
    | Version.Two.One.InterfaceJson.PropertyJson
    | Version.Two.Two.InterfaceJson.PropertyJson
    | Version.Two.Three.InterfaceJson.PropertyJson
    | Version.Three.Zero.InterfaceJson.PropertyJson
    | Version.Three.One.InterfaceJson.PropertyJson
    | Version.Three.Two.InterfaceJson.PropertyJson
    | Version.Four.Zero.InterfaceJson.PropertyJson
    | Version.Five.Zero.InterfaceJson.PropertyJson
    | Version.Six.Zero.InterfaceJson.PropertyJson
    | Version.Seven.Zero.InterfaceJson.PropertyJson
    | Version.Seven.One.InterfaceJson.PropertyJson
    | Version.Seven.Two.InterfaceJson.PropertyJson
    | Version.Seven.Three.InterfaceJson.PropertyJson
    | Version.Seven.Four.InterfaceJson.PropertyJson
    | Version.Eight.Zero.InterfaceJson.PropertyJson
    | Version.Eight.One.InterfaceJson.PropertyJson,
  parentId: number,
  typeDocJsonParserVersion: [number, number, number]
): InterfacePropertyParser.Json {
  const [major, minor] = typeDocJsonParserVersion;
  const { id, name, comment, source, readonly, type } = propertyJson;

  if (major < 9) {
    if (major === 8 && minor < 2) {
      return {
        id,
        name,
        comment: migrateCommentJson(comment, typeDocJsonParserVersion),
        source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
        parentId,
        readonly,
        optional: false,
        type: migrateTypeJson(type!, typeDocJsonParserVersion)
      };
    }
  }

  const { optional } = propertyJson as Version.Eight.Two.InterfaceJson.PropertyJson;

  return {
    id,
    name,
    comment: migrateCommentJson(comment, typeDocJsonParserVersion),
    source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
    parentId,
    readonly,
    optional,
    type: migrateTypeJson(type!, typeDocJsonParserVersion)
  };
}

function migrateInterfaceMethodJson(
  methodJson:
    | Version.Three.One.InterfaceJson.MethodJson
    | Version.Three.Two.InterfaceJson.MethodJson
    | Version.Four.Zero.InterfaceJson.MethodJson
    | Version.Five.Zero.InterfaceJson.MethodJson
    | Version.Six.Zero.InterfaceJson.MethodJson
    | Version.Seven.Zero.InterfaceJson.MethodJson
    | Version.Seven.One.InterfaceJson.MethodJson
    | Version.Seven.Two.InterfaceJson.MethodJson
    | Version.Seven.Three.InterfaceJson.MethodJson
    | Version.Seven.Four.InterfaceJson.MethodJson
    | Version.Eight.Zero.InterfaceJson.MethodJson
    | Version.Eight.One.InterfaceJson.MethodJson,
  parentId: number,
  typeDocJsonParserVersion: [number, number, number]
): InterfaceMethodParser.Json {
  const { id, name, source, signatures } = methodJson;

  return {
    id,
    name,
    source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
    parentId,
    signatures: signatures.map((signatureJson) => migrateSignatureJson(signatureJson, typeDocJsonParserVersion))
  };
}

function migrateCommentJson(
  commentJson:
    | Version.Two.Zero.Misc.CommentJson
    | Version.Two.One.Misc.CommentJson
    | Version.Two.Two.Misc.CommentJson
    | Version.Two.Three.Misc.CommentJson
    | Version.Three.Zero.Misc.CommentJson
    | Version.Three.One.Misc.CommentJson
    | Version.Three.Two.Misc.CommentJson
    | Version.Four.Zero.Misc.CommentJson
    | Version.Five.Zero.Misc.CommentJson
    | Version.Six.Zero.Misc.CommentJson
    | Version.Seven.Zero.Misc.CommentJson
    | Version.Seven.One.Misc.CommentJson
    | Version.Seven.Two.Misc.CommentJson
    | Version.Seven.Three.Misc.CommentJson
    | Version.Seven.Four.Misc.CommentJson
    | Version.Eight.Zero.Misc.CommentJson
    | Version.Eight.One.Misc.CommentJson,
  _typeDocJsonParserVersion: [number, number, number]
): CommentParser.Json {
  return commentJson;
}

function migrateMethodJson(methodJson: Version.Eight.One.Misc.MethodJson, _typeDocJsonParserVersion: [number, number, number]): MethodParser.Json {
  return methodJson;
}

function migrateParameterJson(
  parameterJson:
    | Version.Two.Zero.Misc.ParameterJson
    | Version.Two.One.Misc.ParameterJson
    | Version.Two.Two.Misc.ParameterJson
    | Version.Two.Three.Misc.ParameterJson
    | Version.Three.Zero.Misc.ParameterJson
    | Version.Three.One.Misc.ParameterJson
    | Version.Three.Two.Misc.ParameterJson
    | Version.Four.Zero.Misc.ParameterJson
    | Version.Five.Zero.Misc.ParameterJson
    | Version.Six.Zero.Misc.ParameterJson
    | Version.Seven.Zero.Misc.ParameterJson
    | Version.Seven.One.Misc.ParameterJson
    | Version.Seven.Two.Misc.ParameterJson
    | Version.Seven.Three.Misc.ParameterJson
    | Version.Seven.Four.Misc.ParameterJson
    | Version.Eight.Zero.Misc.ParameterJson
    | Version.Eight.One.Misc.ParameterJson,
  typeDocJsonParserVersion: [number, number, number]
): ParameterParser.Json {
  const [major, minor] = typeDocJsonParserVersion;
  const { id, name, type } = parameterJson;

  if (major < 6) {
    return {
      id,
      name,
      comment: { description: null, blockTags: [], modifierTags: [] },
      rest: false,
      optional: false,
      type: migrateTypeJson(type!, typeDocJsonParserVersion)
    };
  }

  if (major < 8) {
    if (!(major === 7 && minor >= 1)) {
      const { comment } = parameterJson as Version.Six.Zero.Misc.ParameterJson | Version.Seven.Zero.Misc.ParameterJson;

      return {
        id,
        name,
        comment: migrateCommentJson(comment, typeDocJsonParserVersion),
        rest: false,
        optional: false,
        type: migrateTypeJson(type!, typeDocJsonParserVersion)
      };
    }

    if (major === 7 && minor === 1) {
      const { comment, optional } = parameterJson as Version.Seven.One.Misc.ParameterJson;

      return {
        id,
        name,
        comment: migrateCommentJson(comment, typeDocJsonParserVersion),
        rest: false,
        optional,
        type: migrateTypeJson(type!, typeDocJsonParserVersion)
      };
    }
  }

  const { comment, optional, rest } = parameterJson as
    | Version.Seven.Two.Misc.ParameterJson
    | Version.Seven.Three.Misc.ParameterJson
    | Version.Seven.Four.Misc.ParameterJson;

  return {
    id,
    name,
    comment: migrateCommentJson(comment, typeDocJsonParserVersion),
    rest,
    optional,
    type: migrateTypeJson(type!, typeDocJsonParserVersion)
  };
}

function migratePropertyJson(
  propertyJson: Version.Eight.Zero.Misc.PropertyJson | Version.Eight.One.Misc.PropertyJson | Version.Eight.Two.Misc.PropertyJson,
  typeDocJsonParserVersion: [number, number, number]
): PropertyParser.Json {
  const [major, minor] = typeDocJsonParserVersion;
  const { id, name, comment, type } = propertyJson;

  if (major < 9) {
    if (major === 8 && minor < 2) {
      return {
        id,
        name,
        comment: migrateCommentJson(comment, typeDocJsonParserVersion),
        readonly: false,
        optional: false,
        type: migrateTypeJson(type, typeDocJsonParserVersion)
      };
    }
  }

  const { readonly, optional } = propertyJson as Version.Eight.Two.Misc.PropertyJson;

  return {
    id,
    name,
    comment: migrateCommentJson(comment, typeDocJsonParserVersion),
    readonly,
    optional,
    type: migrateTypeJson(type, typeDocJsonParserVersion)
  };
}

function migrateSignatureJson(
  signatureJson:
    | Version.Two.Zero.Misc.SignatureJson
    | Version.Two.One.Misc.SignatureJson
    | Version.Two.Two.Misc.SignatureJson
    | Version.Two.Three.Misc.SignatureJson
    | Version.Three.One.Misc.SignatureJson
    | Version.Three.Two.Misc.SignatureJson
    | Version.Four.Zero.Misc.SignatureJson
    | Version.Five.Zero.Misc.SignatureJson
    | Version.Six.Zero.Misc.SignatureJson
    | Version.Seven.Zero.Misc.SignatureJson
    | Version.Seven.One.Misc.SignatureJson
    | Version.Seven.Two.Misc.SignatureJson
    | Version.Seven.Three.Misc.SignatureJson
    | Version.Seven.Four.Misc.SignatureJson
    | Version.Eight.Zero.Misc.SignatureJson
    | Version.Eight.One.Misc.SignatureJson,
  typeDocJsonParserVersion: [number, number, number]
): SignatureParser.Json {
  const [major] = typeDocJsonParserVersion;
  const { id, name, typeParameters, parameters, returnType } = signatureJson;

  if (major < 3) {
    return {
      id,
      name,
      comment: { description: null, blockTags: [], modifierTags: [] },
      typeParameters: typeParameters.map((typeParameterJson) => migrateTypeParameterJson(typeParameterJson, typeDocJsonParserVersion)),
      parameters: parameters.map((parameterJson) => migrateParameterJson(parameterJson, typeDocJsonParserVersion)),
      returnType: migrateTypeJson(returnType!, typeDocJsonParserVersion)
    };
  }

  const { comment } = signatureJson as
    | Version.Three.One.Misc.SignatureJson
    | Version.Three.Two.Misc.SignatureJson
    | Version.Four.Zero.Misc.SignatureJson
    | Version.Five.Zero.Misc.SignatureJson
    | Version.Six.Zero.Misc.SignatureJson
    | Version.Seven.Zero.Misc.SignatureJson
    | Version.Seven.One.Misc.SignatureJson
    | Version.Seven.Two.Misc.SignatureJson
    | Version.Seven.Three.Misc.SignatureJson
    | Version.Seven.Four.Misc.SignatureJson
    | Version.Eight.Zero.Misc.SignatureJson
    | Version.Eight.One.Misc.SignatureJson
    | Version.Eight.Two.Misc.SignatureJson;

  return {
    id,
    name,
    comment: migrateCommentJson(comment, typeDocJsonParserVersion),
    typeParameters: typeParameters.map((typeParameterJson) => migrateTypeParameterJson(typeParameterJson, typeDocJsonParserVersion)),
    parameters: parameters.map((parameterJson) => migrateParameterJson(parameterJson, typeDocJsonParserVersion)),
    returnType: migrateTypeJson(returnType!, typeDocJsonParserVersion)
  };
}

function migrateSourceJson(
  sourceJson:
    | Version.Two.Zero.Misc.SourceJson
    | Version.Two.One.Misc.SourceJson
    | Version.Two.Two.Misc.SourceJson
    | Version.Two.Three.Misc.SourceJson
    | Version.Three.Zero.Misc.SourceJson
    | Version.Three.One.Misc.SourceJson
    | Version.Three.Two.Misc.SourceJson
    | Version.Four.Zero.Misc.SourceJson
    | Version.Five.Zero.Misc.SourceJson
    | Version.Six.Zero.Misc.SourceJson
    | Version.Seven.Zero.Misc.SourceJson
    | Version.Seven.One.Misc.SourceJson
    | Version.Seven.Two.Misc.SourceJson
    | Version.Seven.Three.Misc.SourceJson
    | Version.Seven.Four.Misc.SourceJson
    | Version.Eight.Zero.Misc.SourceJson
    | Version.Eight.One.Misc.SourceJson,
  typeDocJsonParserVersion: [number, number, number]
): SourceParser.Json {
  const [major] = typeDocJsonParserVersion;
  const { line, file, path } = sourceJson;

  if (major < 3) {
    return { line, file, path, url: null };
  }

  const { url } = sourceJson as
    | Version.Three.Zero.Misc.SourceJson
    | Version.Three.One.Misc.SourceJson
    | Version.Three.Two.Misc.SourceJson
    | Version.Four.Zero.Misc.SourceJson
    | Version.Five.Zero.Misc.SourceJson
    | Version.Six.Zero.Misc.SourceJson
    | Version.Seven.Zero.Misc.SourceJson
    | Version.Seven.One.Misc.SourceJson
    | Version.Seven.Two.Misc.SourceJson
    | Version.Seven.Three.Misc.SourceJson
    | Version.Seven.Four.Misc.SourceJson
    | Version.Eight.Zero.Misc.SourceJson
    | Version.Eight.One.Misc.SourceJson
    | Version.Eight.Two.Misc.SourceJson;

  return { line, file, path, url };
}

function migrateTypeParameterJson(
  typeParameterJson:
    | Version.Two.Zero.Misc.TypeParameterJson
    | Version.Two.One.Misc.TypeParameterJson
    | Version.Two.Two.Misc.TypeParameterJson
    | Version.Two.Three.Misc.TypeParameterJson
    | Version.Three.Zero.Misc.TypeParameterJson
    | Version.Three.One.Misc.TypeParameterJson
    | Version.Three.Two.Misc.TypeParameterJson
    | Version.Four.Zero.Misc.TypeParameterJson
    | Version.Five.Zero.Misc.TypeParameterJson
    | Version.Six.Zero.Misc.TypeParameterJson
    | Version.Seven.Zero.Misc.TypeParameterJson
    | Version.Seven.One.Misc.TypeParameterJson
    | Version.Seven.Two.Misc.TypeParameterJson
    | Version.Seven.Three.Misc.TypeParameterJson
    | Version.Seven.Four.Misc.TypeParameterJson
    | Version.Eight.Zero.Misc.TypeParameterJson
    | Version.Eight.One.Misc.TypeParameterJson,
  typeDocJsonParserVersion: [number, number, number]
): TypeParameterParser.Json {
  const [major] = typeDocJsonParserVersion;
  const { id, name, default: _default } = typeParameterJson;

  if (major < 7) {
    const { type } = typeParameterJson as
      | Version.Two.Zero.Misc.TypeParameterJson
      | Version.Two.One.Misc.TypeParameterJson
      | Version.Two.Two.Misc.TypeParameterJson
      | Version.Two.Three.Misc.TypeParameterJson
      | Version.Three.Zero.Misc.TypeParameterJson
      | Version.Three.One.Misc.TypeParameterJson
      | Version.Three.Two.Misc.TypeParameterJson
      | Version.Four.Zero.Misc.TypeParameterJson
      | Version.Five.Zero.Misc.TypeParameterJson
      | Version.Six.Zero.Misc.TypeParameterJson;

    return {
      id,
      name,
      constraint: type ? migrateTypeJson(type, typeDocJsonParserVersion) : null,
      default: _default ? migrateTypeJson(_default, typeDocJsonParserVersion) : null
    };
  }

  const { constraint } = typeParameterJson as
    | Version.Seven.Zero.Misc.TypeParameterJson
    | Version.Seven.One.Misc.TypeParameterJson
    | Version.Seven.Two.Misc.TypeParameterJson
    | Version.Seven.Three.Misc.TypeParameterJson
    | Version.Seven.Four.Misc.TypeParameterJson
    | Version.Eight.Zero.Misc.TypeParameterJson
    | Version.Eight.One.Misc.TypeParameterJson
    | Version.Eight.Two.Misc.TypeParameterJson;

  return {
    id,
    name,
    constraint: constraint ? migrateTypeJson(constraint, typeDocJsonParserVersion) : null,
    default: _default ? migrateTypeJson(_default, typeDocJsonParserVersion) : null
  };
}

function migrateTypeJson(
  typeJson:
    | Version.Two.Zero.TypeJson
    | Version.Two.One.TypeJson
    | Version.Two.Two.TypeJson
    | Version.Two.Three.TypeJson
    | Version.Three.Zero.TypeJson
    | Version.Three.One.TypeJson
    | Version.Three.Two.TypeJson
    | Version.Four.Zero.TypeJson
    | Version.Five.Zero.TypeJson
    | Version.Six.Zero.TypeJson
    | Version.Seven.Zero.TypeJson
    | Version.Seven.One.TypeJson
    | Version.Seven.Two.TypeJson
    | Version.Seven.Three.TypeJson
    | Version.Seven.Four.TypeJson
    | Version.Eight.Zero.TypeJson
    | Version.Eight.One.TypeJson,
  typeDocJsonParserVersion: [number, number, number]
): TypeParser.Json {
  const [major, minor] = typeDocJsonParserVersion;
  const { kind } = typeJson;

  switch (kind as TypeParser.Kind) {
    case TypeParser.Kind.Array: {
      const { type } = typeJson as
        | Version.Two.Zero.TypeJson.ArrayJson
        | Version.Two.One.TypeJson.ArrayJson
        | Version.Two.Two.TypeJson.ArrayJson
        | Version.Two.Three.TypeJson.ArrayJson
        | Version.Three.Zero.TypeJson.ArrayJson
        | Version.Three.One.TypeJson.ArrayJson
        | Version.Three.Two.TypeJson.ArrayJson
        | Version.Four.Zero.TypeJson.ArrayJson
        | Version.Five.Zero.TypeJson.ArrayJson
        | Version.Six.Zero.TypeJson.ArrayJson
        | Version.Seven.Zero.TypeJson.ArrayJson
        | Version.Seven.One.TypeJson.ArrayJson
        | Version.Seven.Two.TypeJson.ArrayJson
        | Version.Seven.Three.TypeJson.ArrayJson
        | Version.Seven.Four.TypeJson.ArrayJson
        | Version.Eight.Zero.TypeJson.ArrayJson
        | Version.Eight.One.TypeJson.ArrayJson
        | Version.Eight.Two.TypeJson.ArrayJson;

      return { kind, type: migrateTypeJson(type, typeDocJsonParserVersion) } as TypeParser.Json;
    }

    case TypeParser.Kind.Conditional: {
      const { checkType, extendsType, trueType, falseType } = typeJson as
        | Version.Two.Zero.TypeJson.ConditionalJson
        | Version.Two.One.TypeJson.ConditionalJson
        | Version.Two.Two.TypeJson.ConditionalJson
        | Version.Two.Three.TypeJson.ConditionalJson
        | Version.Three.Zero.TypeJson.ConditionalJson
        | Version.Three.One.TypeJson.ConditionalJson
        | Version.Three.Two.TypeJson.ConditionalJson
        | Version.Four.Zero.TypeJson.ConditionalJson
        | Version.Five.Zero.TypeJson.ConditionalJson
        | Version.Six.Zero.TypeJson.ConditionalJson
        | Version.Seven.Zero.TypeJson.ConditionalJson
        | Version.Seven.One.TypeJson.ConditionalJson
        | Version.Seven.Two.TypeJson.ConditionalJson
        | Version.Seven.Three.TypeJson.ConditionalJson
        | Version.Seven.Four.TypeJson.ConditionalJson
        | Version.Eight.Zero.TypeJson.ConditionalJson
        | Version.Eight.One.TypeJson.ConditionalJson
        | Version.Eight.Two.TypeJson.ConditionalJson;

      return {
        kind,
        checkType: migrateTypeJson(checkType, typeDocJsonParserVersion),
        extendsType: migrateTypeJson(extendsType, typeDocJsonParserVersion),
        trueType: migrateTypeJson(trueType, typeDocJsonParserVersion),
        falseType: migrateTypeJson(falseType, typeDocJsonParserVersion)
      } as TypeParser.Json;
    }

    case TypeParser.Kind.IndexedAccess: {
      const { objectType, indexType } = typeJson as
        | Version.Two.Zero.TypeJson.IndexedAccessJson
        | Version.Two.One.TypeJson.IndexedAccessJson
        | Version.Two.Two.TypeJson.IndexedAccessJson
        | Version.Two.Three.TypeJson.IndexedAccessJson
        | Version.Three.Zero.TypeJson.IndexedAccessJson
        | Version.Three.One.TypeJson.IndexedAccessJson
        | Version.Three.Two.TypeJson.IndexedAccessJson
        | Version.Four.Zero.TypeJson.IndexedAccessJson
        | Version.Five.Zero.TypeJson.IndexedAccessJson
        | Version.Six.Zero.TypeJson.IndexedAccessJson
        | Version.Seven.Zero.TypeJson.IndexedAccessJson
        | Version.Seven.One.TypeJson.IndexedAccessJson
        | Version.Seven.Two.TypeJson.IndexedAccessJson
        | Version.Seven.Three.TypeJson.IndexedAccessJson
        | Version.Seven.Four.TypeJson.IndexedAccessJson
        | Version.Eight.Zero.TypeJson.IndexedAccessJson
        | Version.Eight.One.TypeJson.IndexedAccessJson
        | Version.Eight.Two.TypeJson.IndexedAccessJson;

      return {
        kind,
        objectType: migrateTypeJson(objectType, typeDocJsonParserVersion),
        indexType: migrateTypeJson(indexType, typeDocJsonParserVersion)
      } as TypeParser.Json;
    }

    case TypeParser.Kind.Inferred: {
      const { type } = typeJson as
        | Version.Two.Zero.TypeJson.InferredJson
        | Version.Two.One.TypeJson.InferredJson
        | Version.Two.Two.TypeJson.InferredJson
        | Version.Two.Three.TypeJson.InferredJson
        | Version.Three.Zero.TypeJson.InferredJson
        | Version.Three.One.TypeJson.InferredJson
        | Version.Three.Two.TypeJson.InferredJson
        | Version.Four.Zero.TypeJson.InferredJson
        | Version.Five.Zero.TypeJson.InferredJson
        | Version.Six.Zero.TypeJson.InferredJson
        | Version.Seven.Zero.TypeJson.InferredJson
        | Version.Seven.One.TypeJson.InferredJson
        | Version.Seven.Two.TypeJson.InferredJson
        | Version.Seven.Three.TypeJson.InferredJson
        | Version.Seven.Four.TypeJson.InferredJson
        | Version.Eight.Zero.TypeJson.InferredJson
        | Version.Eight.One.TypeJson.InferredJson
        | Version.Eight.Two.TypeJson.InferredJson;

      return { kind, type } as TypeParser.Json;
    }

    case TypeParser.Kind.Intersection: {
      const { types } = typeJson as
        | Version.Two.Zero.TypeJson.IntersectionJson
        | Version.Two.One.TypeJson.IntersectionJson
        | Version.Two.Two.TypeJson.IntersectionJson
        | Version.Two.Three.TypeJson.IntersectionJson
        | Version.Three.Zero.TypeJson.IntersectionJson
        | Version.Three.One.TypeJson.IntersectionJson
        | Version.Three.Two.TypeJson.IntersectionJson
        | Version.Four.Zero.TypeJson.IntersectionJson
        | Version.Five.Zero.TypeJson.IntersectionJson
        | Version.Six.Zero.TypeJson.IntersectionJson
        | Version.Seven.Zero.TypeJson.IntersectionJson
        | Version.Seven.One.TypeJson.IntersectionJson
        | Version.Seven.Two.TypeJson.IntersectionJson
        | Version.Seven.Three.TypeJson.IntersectionJson
        | Version.Seven.Four.TypeJson.IntersectionJson
        | Version.Eight.Zero.TypeJson.IntersectionJson
        | Version.Eight.One.TypeJson.IntersectionJson
        | Version.Eight.Two.TypeJson.IntersectionJson;

      return { kind, types: types.map((type) => migrateTypeJson(type, typeDocJsonParserVersion)) } as TypeParser.Json;
    }

    case TypeParser.Kind.Intrinsic: {
      const { type } = typeJson as
        | Version.Two.Zero.TypeJson.IntrinsicJson
        | Version.Two.One.TypeJson.IntrinsicJson
        | Version.Two.Two.TypeJson.IntrinsicJson
        | Version.Two.Three.TypeJson.IntrinsicJson
        | Version.Three.Zero.TypeJson.IntrinsicJson
        | Version.Three.One.TypeJson.IntrinsicJson
        | Version.Three.Two.TypeJson.IntrinsicJson
        | Version.Four.Zero.TypeJson.IntrinsicJson
        | Version.Five.Zero.TypeJson.IntrinsicJson
        | Version.Six.Zero.TypeJson.IntrinsicJson
        | Version.Seven.Zero.TypeJson.IntrinsicJson
        | Version.Seven.One.TypeJson.IntrinsicJson
        | Version.Seven.Two.TypeJson.IntrinsicJson
        | Version.Seven.Three.TypeJson.IntrinsicJson
        | Version.Seven.Four.TypeJson.IntrinsicJson
        | Version.Eight.Zero.TypeJson.IntrinsicJson
        | Version.Eight.One.TypeJson.IntrinsicJson
        | Version.Eight.Two.TypeJson.IntrinsicJson;

      return { kind, type } as TypeParser.Json;
    }

    case TypeParser.Kind.Literal: {
      const { value } = typeJson as
        | Version.Two.Zero.TypeJson.LiteralJson
        | Version.Two.One.TypeJson.LiteralJson
        | Version.Two.Two.TypeJson.LiteralJson
        | Version.Two.Three.TypeJson.LiteralJson
        | Version.Three.Zero.TypeJson.LiteralJson
        | Version.Three.One.TypeJson.LiteralJson
        | Version.Three.Two.TypeJson.LiteralJson
        | Version.Four.Zero.TypeJson.LiteralJson
        | Version.Five.Zero.TypeJson.LiteralJson
        | Version.Six.Zero.TypeJson.LiteralJson
        | Version.Seven.Zero.TypeJson.LiteralJson
        | Version.Seven.One.TypeJson.LiteralJson
        | Version.Seven.Two.TypeJson.LiteralJson
        | Version.Seven.Three.TypeJson.LiteralJson
        | Version.Seven.Four.TypeJson.LiteralJson
        | Version.Eight.Zero.TypeJson.LiteralJson
        | Version.Eight.One.TypeJson.LiteralJson
        | Version.Eight.Two.TypeJson.LiteralJson;

      return { kind, value } as TypeParser.Json;
    }

    case TypeParser.Kind.Mapped: {
      const { parameter, parameterType, nameType, templateType, readonly, optional } = typeJson as
        | Version.Two.Zero.TypeJson.MappedJson
        | Version.Two.One.TypeJson.MappedJson
        | Version.Two.Two.TypeJson.MappedJson
        | Version.Two.Three.TypeJson.MappedJson
        | Version.Three.Zero.TypeJson.MappedJson
        | Version.Three.One.TypeJson.MappedJson
        | Version.Three.Two.TypeJson.MappedJson
        | Version.Four.Zero.TypeJson.MappedJson
        | Version.Five.Zero.TypeJson.MappedJson
        | Version.Six.Zero.TypeJson.MappedJson
        | Version.Seven.Zero.TypeJson.MappedJson
        | Version.Seven.One.TypeJson.MappedJson
        | Version.Seven.Two.TypeJson.MappedJson
        | Version.Seven.Three.TypeJson.MappedJson
        | Version.Seven.Four.TypeJson.MappedJson
        | Version.Eight.Zero.TypeJson.MappedJson
        | Version.Eight.One.TypeJson.MappedJson
        | Version.Eight.Two.TypeJson.MappedJson;

      return {
        kind,
        parameter,
        parameterType: migrateTypeJson(parameterType, typeDocJsonParserVersion),
        nameType: nameType ? migrateTypeJson(nameType, typeDocJsonParserVersion) : null,
        templateType: migrateTypeJson(templateType, typeDocJsonParserVersion),
        readonly,
        optional
      } as TypeParser.Json;
    }

    case TypeParser.Kind.NamedTupleMember: {
      const { name, type, optional } = typeJson as
        | Version.Two.Zero.TypeJson.NamedTupleMemberJson
        | Version.Two.One.TypeJson.NamedTupleMemberJson
        | Version.Two.Two.TypeJson.NamedTupleMemberJson
        | Version.Two.Three.TypeJson.NamedTupleMemberJson
        | Version.Three.Zero.TypeJson.NamedTupleMemberJson
        | Version.Three.One.TypeJson.NamedTupleMemberJson
        | Version.Three.Two.TypeJson.NamedTupleMemberJson
        | Version.Four.Zero.TypeJson.NamedTupleMemberJson
        | Version.Five.Zero.TypeJson.NamedTupleMemberJson
        | Version.Six.Zero.TypeJson.NamedTupleMemberJson
        | Version.Seven.Zero.TypeJson.NamedTupleMemberJson
        | Version.Seven.One.TypeJson.NamedTupleMemberJson
        | Version.Seven.Two.TypeJson.NamedTupleMemberJson
        | Version.Seven.Three.TypeJson.NamedTupleMemberJson
        | Version.Seven.Four.TypeJson.NamedTupleMemberJson
        | Version.Eight.Zero.TypeJson.NamedTupleMemberJson
        | Version.Eight.One.TypeJson.NamedTupleMemberJson
        | Version.Eight.Two.TypeJson.NamedTupleMemberJson;

      return { kind, name, type: migrateTypeJson(type, typeDocJsonParserVersion), optional } as TypeParser.Json;
    }

    case TypeParser.Kind.Optional: {
      const { type } = typeJson as
        | Version.Two.Zero.TypeJson.OptionalJson
        | Version.Two.One.TypeJson.OptionalJson
        | Version.Two.Two.TypeJson.OptionalJson
        | Version.Two.Three.TypeJson.OptionalJson
        | Version.Three.Zero.TypeJson.OptionalJson
        | Version.Three.One.TypeJson.OptionalJson
        | Version.Three.Two.TypeJson.OptionalJson
        | Version.Four.Zero.TypeJson.OptionalJson
        | Version.Five.Zero.TypeJson.OptionalJson
        | Version.Six.Zero.TypeJson.OptionalJson
        | Version.Seven.Zero.TypeJson.OptionalJson
        | Version.Seven.One.TypeJson.OptionalJson
        | Version.Seven.Two.TypeJson.OptionalJson
        | Version.Seven.Three.TypeJson.OptionalJson
        | Version.Seven.Four.TypeJson.OptionalJson
        | Version.Eight.Zero.TypeJson.OptionalJson
        | Version.Eight.One.TypeJson.OptionalJson
        | Version.Eight.Two.TypeJson.OptionalJson;

      return { kind, type: migrateTypeJson(type, typeDocJsonParserVersion) } as TypeParser.Json;
    }

    case TypeParser.Kind.Predicate: {
      const { name, asserts, type } = typeJson as
        | Version.Two.Zero.TypeJson.PredicateJson
        | Version.Two.One.TypeJson.PredicateJson
        | Version.Two.Two.TypeJson.PredicateJson
        | Version.Two.Three.TypeJson.PredicateJson
        | Version.Three.Zero.TypeJson.PredicateJson
        | Version.Three.One.TypeJson.PredicateJson
        | Version.Three.Two.TypeJson.PredicateJson
        | Version.Four.Zero.TypeJson.PredicateJson
        | Version.Five.Zero.TypeJson.PredicateJson
        | Version.Six.Zero.TypeJson.PredicateJson
        | Version.Seven.Zero.TypeJson.PredicateJson
        | Version.Seven.One.TypeJson.PredicateJson
        | Version.Seven.Two.TypeJson.PredicateJson
        | Version.Seven.Three.TypeJson.PredicateJson
        | Version.Seven.Four.TypeJson.PredicateJson
        | Version.Eight.Zero.TypeJson.PredicateJson
        | Version.Eight.One.TypeJson.PredicateJson
        | Version.Eight.Two.TypeJson.PredicateJson;

      return { kind, name, asserts, type: type ? migrateTypeJson(type, typeDocJsonParserVersion) : null } as TypeParser.Json;
    }

    case TypeParser.Kind.Query: {
      const { queryType } = typeJson as
        | Version.Two.Zero.TypeJson.QueryJson
        | Version.Two.One.TypeJson.QueryJson
        | Version.Two.Two.TypeJson.QueryJson
        | Version.Two.Three.TypeJson.QueryJson
        | Version.Three.Zero.TypeJson.QueryJson
        | Version.Three.One.TypeJson.QueryJson
        | Version.Three.Two.TypeJson.QueryJson
        | Version.Four.Zero.TypeJson.QueryJson
        | Version.Five.Zero.TypeJson.QueryJson
        | Version.Six.Zero.TypeJson.QueryJson
        | Version.Seven.Zero.TypeJson.QueryJson
        | Version.Seven.One.TypeJson.QueryJson
        | Version.Seven.Two.TypeJson.QueryJson
        | Version.Seven.Three.TypeJson.QueryJson
        | Version.Seven.Four.TypeJson.QueryJson
        | Version.Eight.Zero.TypeJson.QueryJson
        | Version.Eight.One.TypeJson.QueryJson
        | Version.Eight.Two.TypeJson.QueryJson;

      return { kind, queryType: migrateTypeJson(queryType, typeDocJsonParserVersion) } as TypeParser.Json;
    }

    case TypeParser.Kind.Reference: {
      const { id, name, packageName, typeArguments } = typeJson as
        | Version.Two.Zero.TypeJson.ReferenceJson
        | Version.Two.One.TypeJson.ReferenceJson
        | Version.Two.Two.TypeJson.ReferenceJson
        | Version.Two.Three.TypeJson.ReferenceJson
        | Version.Three.Zero.TypeJson.ReferenceJson
        | Version.Three.One.TypeJson.ReferenceJson
        | Version.Three.Two.TypeJson.ReferenceJson
        | Version.Four.Zero.TypeJson.ReferenceJson
        | Version.Five.Zero.TypeJson.ReferenceJson
        | Version.Six.Zero.TypeJson.ReferenceJson
        | Version.Seven.Zero.TypeJson.ReferenceJson
        | Version.Seven.One.TypeJson.ReferenceJson
        | Version.Seven.Two.TypeJson.ReferenceJson
        | Version.Seven.Three.TypeJson.ReferenceJson
        | Version.Seven.Four.TypeJson.ReferenceJson
        | Version.Eight.Zero.TypeJson.ReferenceJson
        | Version.Eight.One.TypeJson.ReferenceJson
        | Version.Eight.Two.TypeJson.ReferenceJson;

      return {
        kind,
        id,
        name,
        packageName,
        typeArguments: typeArguments.map((typeArgument) => migrateTypeJson(typeArgument, typeDocJsonParserVersion))
      } as TypeParser.Json;
    }

    case TypeParser.Kind.Reflection: {
      if (major < 8) {
        const { reflection } = typeJson as
          | Version.Two.Zero.TypeJson.ReflectionJson
          | Version.Two.One.TypeJson.ReflectionJson
          | Version.Two.Two.TypeJson.ReflectionJson
          | Version.Two.Three.TypeJson.ReflectionJson
          | Version.Three.Zero.TypeJson.ReflectionJson
          | Version.Three.One.TypeJson.ReflectionJson
          | Version.Three.Two.TypeJson.ReflectionJson
          | Version.Four.Zero.TypeJson.ReflectionJson
          | Version.Five.Zero.TypeJson.ReflectionJson
          | Version.Six.Zero.TypeJson.ReflectionJson
          | Version.Seven.Zero.TypeJson.ReflectionJson
          | Version.Seven.One.TypeJson.ReflectionJson
          | Version.Seven.Two.TypeJson.ReflectionJson
          | Version.Seven.Three.TypeJson.ReflectionJson
          | Version.Seven.Four.TypeJson.ReflectionJson;

        return {
          kind,
          properties:
            reflection?.children
              ?.filter((child) => child.kind === ReflectionKind.Property)
              .map((child) => PropertyParser.generateFromTypeDoc(child).toJSON()) ?? null,
          signatures: reflection?.signatures?.map((signature) => SignatureParser.generateFromTypeDoc(signature).toJSON()) ?? null,
          methods:
            reflection?.children
              ?.filter((child) => child.kind === ReflectionKind.Method)
              .map((child) => MethodParser.generateFromTypeDoc(child).toJSON()) ?? null
        } as TypeParser.Json;
      }

      if (major === 8 && minor === 0) {
        const { properties, signatures } = typeJson as Version.Eight.Zero.TypeJson.ReflectionJson;

        return {
          kind,
          properties: properties?.map((property) => migratePropertyJson(property, typeDocJsonParserVersion)) ?? null,
          signatures: signatures?.map((signature) => migrateSignatureJson(signature, typeDocJsonParserVersion)) ?? null
        } as TypeParser.Json;
      }

      const { properties, signatures, methods } = typeJson as Version.Eight.One.TypeJson.ReflectionJson;

      return {
        kind,
        properties: properties?.map((property) => migratePropertyJson(property, typeDocJsonParserVersion)) ?? null,
        signatures: signatures?.map((signature) => migrateSignatureJson(signature, typeDocJsonParserVersion)) ?? null,
        methods: methods?.map((method) => migrateMethodJson(method, typeDocJsonParserVersion)) ?? null
      } as TypeParser.Json;
    }

    case TypeParser.Kind.Rest: {
      const { type } = typeJson as
        | Version.Two.Zero.TypeJson.RestJson
        | Version.Two.One.TypeJson.RestJson
        | Version.Two.Two.TypeJson.RestJson
        | Version.Two.Three.TypeJson.RestJson
        | Version.Three.Zero.TypeJson.RestJson
        | Version.Three.One.TypeJson.RestJson
        | Version.Three.Two.TypeJson.RestJson
        | Version.Four.Zero.TypeJson.RestJson
        | Version.Five.Zero.TypeJson.RestJson
        | Version.Six.Zero.TypeJson.RestJson
        | Version.Seven.Zero.TypeJson.RestJson
        | Version.Seven.One.TypeJson.RestJson
        | Version.Seven.Two.TypeJson.RestJson
        | Version.Seven.Three.TypeJson.RestJson
        | Version.Seven.Four.TypeJson.RestJson
        | Version.Eight.Zero.TypeJson.RestJson
        | Version.Eight.One.TypeJson.RestJson
        | Version.Eight.Two.TypeJson.RestJson;

      return { kind, type: migrateTypeJson(type, typeDocJsonParserVersion) } as TypeParser.Json;
    }

    case TypeParser.Kind.TemplateLiteral: {
      const { head, tail } = typeJson as
        | Version.Two.Zero.TypeJson.TemplateLiteralJson
        | Version.Two.One.TypeJson.TemplateLiteralJson
        | Version.Two.Two.TypeJson.TemplateLiteralJson
        | Version.Two.Three.TypeJson.TemplateLiteralJson
        | Version.Three.Zero.TypeJson.TemplateLiteralJson
        | Version.Three.One.TypeJson.TemplateLiteralJson
        | Version.Three.Two.TypeJson.TemplateLiteralJson
        | Version.Four.Zero.TypeJson.TemplateLiteralJson
        | Version.Five.Zero.TypeJson.TemplateLiteralJson
        | Version.Six.Zero.TypeJson.TemplateLiteralJson
        | Version.Seven.Zero.TypeJson.TemplateLiteralJson
        | Version.Seven.One.TypeJson.TemplateLiteralJson
        | Version.Seven.Two.TypeJson.TemplateLiteralJson
        | Version.Seven.Three.TypeJson.TemplateLiteralJson
        | Version.Seven.Four.TypeJson.TemplateLiteralJson
        | Version.Eight.Zero.TypeJson.TemplateLiteralJson
        | Version.Eight.One.TypeJson.TemplateLiteralJson
        | Version.Eight.Two.TypeJson.TemplateLiteralJson;

      return {
        kind,
        head,
        tail: tail.map(({ text, type }) => ({ type: migrateTypeJson(type, typeDocJsonParserVersion), text }))
      } as TypeParser.Json;
    }

    case TypeParser.Kind.Tuple: {
      const { types } = typeJson as
        | Version.Two.Zero.TypeJson.TupleJson
        | Version.Two.One.TypeJson.TupleJson
        | Version.Two.Two.TypeJson.TupleJson
        | Version.Two.Three.TypeJson.TupleJson
        | Version.Three.Zero.TypeJson.TupleJson
        | Version.Three.One.TypeJson.TupleJson
        | Version.Three.Two.TypeJson.TupleJson
        | Version.Four.Zero.TypeJson.TupleJson
        | Version.Five.Zero.TypeJson.TupleJson
        | Version.Six.Zero.TypeJson.TupleJson
        | Version.Seven.Zero.TypeJson.TupleJson
        | Version.Seven.One.TypeJson.TupleJson
        | Version.Seven.Two.TypeJson.TupleJson
        | Version.Seven.Three.TypeJson.TupleJson
        | Version.Seven.Four.TypeJson.TupleJson
        | Version.Eight.Zero.TypeJson.TupleJson
        | Version.Eight.One.TypeJson.TupleJson
        | Version.Eight.Two.TypeJson.TupleJson;

      return { kind, types: types.map((type) => migrateTypeJson(type, typeDocJsonParserVersion)) } as TypeParser.Json;
    }

    case TypeParser.Kind.TypeOperator: {
      const { operator, type } = typeJson as
        | Version.Two.Zero.TypeJson.TypeOperatorJson
        | Version.Two.One.TypeJson.TypeOperatorJson
        | Version.Two.Two.TypeJson.TypeOperatorJson
        | Version.Two.Three.TypeJson.TypeOperatorJson
        | Version.Three.Zero.TypeJson.TypeOperatorJson
        | Version.Three.One.TypeJson.TypeOperatorJson
        | Version.Three.Two.TypeJson.TypeOperatorJson
        | Version.Four.Zero.TypeJson.TypeOperatorJson
        | Version.Five.Zero.TypeJson.TypeOperatorJson
        | Version.Six.Zero.TypeJson.TypeOperatorJson
        | Version.Seven.Zero.TypeJson.TypeOperatorJson
        | Version.Seven.One.TypeJson.TypeOperatorJson
        | Version.Seven.Two.TypeJson.TypeOperatorJson
        | Version.Seven.Three.TypeJson.TypeOperatorJson
        | Version.Seven.Four.TypeJson.TypeOperatorJson
        | Version.Eight.Zero.TypeJson.TypeOperatorJson
        | Version.Eight.One.TypeJson.TypeOperatorJson
        | Version.Eight.Two.TypeJson.TypeOperatorJson;

      return { kind, operator, type: migrateTypeJson(type, typeDocJsonParserVersion) } as TypeParser.Json;
    }

    case TypeParser.Kind.Union: {
      const { types } = typeJson as
        | Version.Two.Zero.TypeJson.UnionJson
        | Version.Two.One.TypeJson.UnionJson
        | Version.Two.Two.TypeJson.UnionJson
        | Version.Two.Three.TypeJson.UnionJson
        | Version.Three.Zero.TypeJson.UnionJson
        | Version.Three.One.TypeJson.UnionJson
        | Version.Three.Two.TypeJson.UnionJson
        | Version.Four.Zero.TypeJson.UnionJson
        | Version.Five.Zero.TypeJson.UnionJson
        | Version.Six.Zero.TypeJson.UnionJson
        | Version.Seven.Zero.TypeJson.UnionJson
        | Version.Seven.One.TypeJson.UnionJson
        | Version.Seven.Two.TypeJson.UnionJson
        | Version.Seven.Three.TypeJson.UnionJson
        | Version.Seven.Four.TypeJson.UnionJson
        | Version.Eight.Zero.TypeJson.UnionJson
        | Version.Eight.One.TypeJson.UnionJson
        | Version.Eight.Two.TypeJson.UnionJson;

      return { kind, types: types.map((type) => migrateTypeJson(type, typeDocJsonParserVersion)) } as TypeParser.Json;
    }

    case TypeParser.Kind.Unknown: {
      const { name } = typeJson as
        | Version.Two.Zero.TypeJson.UnknownJson
        | Version.Two.One.TypeJson.UnknownJson
        | Version.Two.Two.TypeJson.UnknownJson
        | Version.Two.Three.TypeJson.UnknownJson
        | Version.Three.Zero.TypeJson.UnknownJson
        | Version.Three.One.TypeJson.UnknownJson
        | Version.Three.Two.TypeJson.UnknownJson
        | Version.Four.Zero.TypeJson.UnknownJson
        | Version.Five.Zero.TypeJson.UnknownJson
        | Version.Six.Zero.TypeJson.UnknownJson
        | Version.Seven.Zero.TypeJson.UnknownJson
        | Version.Seven.One.TypeJson.UnknownJson
        | Version.Seven.Two.TypeJson.UnknownJson
        | Version.Seven.Three.TypeJson.UnknownJson
        | Version.Seven.Four.TypeJson.UnknownJson
        | Version.Eight.Zero.TypeJson.UnknownJson
        | Version.Eight.One.TypeJson.UnknownJson
        | Version.Eight.Two.TypeJson.UnknownJson;

      return { kind, name } as TypeParser.Json;
    }
  }
}

function migrateFunctionJson(
  functionJson:
    | Version.Two.Zero.FunctionJson
    | Version.Two.One.FunctionJson
    | Version.Two.Two.FunctionJson
    | Version.Two.Three.FunctionJson
    | Version.Three.Zero.FunctionJson
    | Version.Three.One.FunctionJson
    | Version.Three.Two.FunctionJson
    | Version.Four.Zero.FunctionJson
    | Version.Five.Zero.FunctionJson
    | Version.Six.Zero.FunctionJson
    | Version.Seven.Zero.FunctionJson
    | Version.Seven.One.FunctionJson
    | Version.Seven.Two.FunctionJson
    | Version.Seven.Three.FunctionJson
    | Version.Seven.Four.FunctionJson
    | Version.Eight.Zero.FunctionJson
    | Version.Eight.One.FunctionJson,
  namespaceParentId: number | null,
  typeDocJsonParserVersion: [number, number, number]
): FunctionParser.Json {
  const { id, name, comment, source, external, signatures } = functionJson;

  return {
    id,
    name,
    comment: migrateCommentJson(comment, typeDocJsonParserVersion),
    source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
    namespaceParentId,
    external,
    signatures: signatures.map((signatureJson) => migrateSignatureJson(signatureJson, typeDocJsonParserVersion))
  };
}

function migrateNamespaceJson(
  namespaceJson:
    | Version.Two.Zero.NamespaceJson
    | Version.Two.One.NamespaceJson
    | Version.Two.Two.NamespaceJson
    | Version.Two.Three.NamespaceJson
    | Version.Three.Zero.NamespaceJson
    | Version.Three.One.NamespaceJson
    | Version.Three.Two.NamespaceJson
    | Version.Four.Zero.NamespaceJson
    | Version.Five.Zero.NamespaceJson
    | Version.Six.Zero.NamespaceJson
    | Version.Seven.Zero.NamespaceJson
    | Version.Seven.One.NamespaceJson
    | Version.Seven.Two.NamespaceJson
    | Version.Seven.Three.NamespaceJson
    | Version.Seven.Four.NamespaceJson
    | Version.Eight.Zero.NamespaceJson
    | Version.Eight.One.NamespaceJson,
  namespaceParentId: number | null,
  typeDocJsonParserVersion: [number, number, number]
): NamespaceParser.Json {
  const [major] = typeDocJsonParserVersion;
  const { id, name, comment, source, external, classes, enums, functions, interfaces, namespaces, typeAliases } = namespaceJson;

  if (major < 6) {
    const { constants } = namespaceJson as
      | Version.Two.Zero.NamespaceJson
      | Version.Two.One.NamespaceJson
      | Version.Two.Two.NamespaceJson
      | Version.Two.Three.NamespaceJson
      | Version.Three.Zero.NamespaceJson
      | Version.Three.One.NamespaceJson
      | Version.Three.Two.NamespaceJson
      | Version.Four.Zero.NamespaceJson
      | Version.Five.Zero.NamespaceJson;

    return {
      id,
      name,
      comment: migrateCommentJson(comment, typeDocJsonParserVersion),
      source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
      namespaceParentId,
      external,
      classes: classes.map((classJson) => migrateClassJson(classJson, id, typeDocJsonParserVersion)),
      enums: enums.map((enumJson) => migrateEnumJson(enumJson, id, typeDocJsonParserVersion)),
      functions: functions.map((functionJson) => migrateFunctionJson(functionJson, id, typeDocJsonParserVersion)),
      interfaces: interfaces.map((interfaceJson) => migrateInterfaceJson(interfaceJson, id, typeDocJsonParserVersion)),
      namespaces: namespaces.map((namespaceJson) => migrateNamespaceJson(namespaceJson, id, typeDocJsonParserVersion)),
      typeAliases: typeAliases.map((typeAliasJson) => migrateTypeAliasJson(typeAliasJson, id, typeDocJsonParserVersion)),
      variables: constants.map((constantJson) => migrateVariableJson(constantJson, id, typeDocJsonParserVersion))
    };
  }

  const { variables } = namespaceJson as
    | Version.Six.Zero.NamespaceJson
    | Version.Seven.Zero.NamespaceJson
    | Version.Seven.One.NamespaceJson
    | Version.Seven.Two.NamespaceJson
    | Version.Seven.Three.NamespaceJson
    | Version.Seven.Four.NamespaceJson
    | Version.Eight.Zero.NamespaceJson
    | Version.Eight.One.NamespaceJson
    | Version.Eight.Two.NamespaceJson;

  return {
    id,
    name,
    comment: migrateCommentJson(comment, typeDocJsonParserVersion),
    source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
    namespaceParentId,
    external,
    classes: classes.map((classJson) => migrateClassJson(classJson, id, typeDocJsonParserVersion)),
    enums: enums.map((enumJson) => migrateEnumJson(enumJson, id, typeDocJsonParserVersion)),
    functions: functions.map((functionJson) => migrateFunctionJson(functionJson, id, typeDocJsonParserVersion)),
    interfaces: interfaces.map((interfaceJson) => migrateInterfaceJson(interfaceJson, id, typeDocJsonParserVersion)),
    namespaces: namespaces.map((namespaceJson) => migrateNamespaceJson(namespaceJson, id, typeDocJsonParserVersion)),
    typeAliases: typeAliases.map((typeAliasJson) => migrateTypeAliasJson(typeAliasJson, id, typeDocJsonParserVersion)),
    variables: variables.map((variableJson) => migrateVariableJson(variableJson, id, typeDocJsonParserVersion))
  };
}

function migrateTypeAliasJson(
  typeAliasJson:
    | Version.Two.Zero.TypeAliasJson
    | Version.Two.One.TypeAliasJson
    | Version.Two.Two.TypeAliasJson
    | Version.Two.Three.TypeAliasJson
    | Version.Three.Zero.TypeAliasJson
    | Version.Three.One.TypeAliasJson
    | Version.Three.Two.TypeAliasJson
    | Version.Four.Zero.TypeAliasJson
    | Version.Five.Zero.TypeAliasJson
    | Version.Six.Zero.TypeAliasJson
    | Version.Seven.Zero.TypeAliasJson
    | Version.Seven.One.TypeAliasJson
    | Version.Seven.Two.TypeAliasJson
    | Version.Seven.Three.TypeAliasJson
    | Version.Seven.Four.TypeAliasJson
    | Version.Eight.Zero.TypeAliasJson
    | Version.Eight.One.TypeAliasJson,
  namespaceParentId: number | null,
  typeDocJsonParserVersion: [number, number, number]
): TypeAliasParser.Json {
  const { id, name, comment, source, external, typeParameters, type } = typeAliasJson;

  return {
    id,
    name,
    comment: migrateCommentJson(comment, typeDocJsonParserVersion),
    source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
    namespaceParentId,
    external,
    typeParameters: typeParameters.map((typeParameterJson) => migrateTypeParameterJson(typeParameterJson, typeDocJsonParserVersion)),
    type: migrateTypeJson(type, typeDocJsonParserVersion)
  };
}

function migrateVariableJson(
  variableJson:
    | Version.Two.Zero.ConstantJson
    | Version.Two.One.ConstantJson
    | Version.Two.Two.ConstantJson
    | Version.Two.Three.ConstantJson
    | Version.Three.Zero.ConstantJson
    | Version.Three.One.ConstantJson
    | Version.Three.Two.ConstantJson
    | Version.Four.Zero.ConstantJson
    | Version.Five.Zero.ConstantJson
    | Version.Six.Zero.VariableJson
    | Version.Seven.Zero.VariableJson
    | Version.Seven.One.VariableJson
    | Version.Seven.Two.VariableJson
    | Version.Seven.Three.VariableJson
    | Version.Seven.Four.VariableJson
    | Version.Eight.Zero.VariableJson
    | Version.Eight.One.VariableJson,
  namespaceParentId: number | null,
  typeDocJsonParserVersion: [number, number, number]
): VariableParser.Json {
  const { id, name, comment, source, external, type, value } = variableJson;

  return {
    id,
    name,
    comment: migrateCommentJson(comment, typeDocJsonParserVersion),
    source: source ? migrateSourceJson(source, typeDocJsonParserVersion) : null,
    namespaceParentId,
    external,
    type: migrateTypeJson(type, typeDocJsonParserVersion),
    value
  };
}
