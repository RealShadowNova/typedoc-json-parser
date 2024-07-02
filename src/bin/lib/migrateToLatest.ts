import type { Tags } from '#bin/lib/types';
import { ProjectParser } from '#lib/structures/ProjectParser';
import { ClassParser } from '#lib/structures/class-parser';

export enum MigrationStatus {
  Success,
  Failed,
  Latest
}

export type MigrationResult = MigrationSuccess | MigrationFailed | MigrationLatest;

export interface MigrationSuccess {
  status: MigrationStatus.Success;
  path: string;
  data: ProjectParser.Json;
}

export interface MigrationFailed {
  status: MigrationStatus.Failed;
  path: string;
  from: string;
  name: string;
  version: string;
}

export interface MigrationLatest {
  status: MigrationStatus.Latest;
  path: string;
  name: string;
  version: string;
}

export function migrateToLatest(projectJson: Record<string, unknown>, path: string): MigrationResult {
  let currentVersion = `v${'typeDocJsonParserVersion' in projectJson ? projectJson.typeDocJsonParserVersion : '2.0.0'}` as string;
  const latestVersion = `v${ProjectParser.version}`;
  let result: MigrationResult | undefined;

  while (currentVersion !== latestVersion) {
    const migration = migrations.find((migration) => migration.from.includes(currentVersion));

    if (!migration) {
      result = {
        status: MigrationStatus.Failed,
        path,
        from: currentVersion,
        name: projectJson.name as string,
        version: projectJson.version as string
      };

      break;
    }

    projectJson = migration.run(projectJson) as Record<string, unknown>;
    currentVersion = migration.to;
  }

  return result ?? { status: MigrationStatus.Success, path, data: projectJson as unknown as ProjectParser.Json };
}

interface Migration {
  from: string[];
  to: string;
  run(projectJson: unknown): unknown;
}

const migrations: Migration[] = [
  {
    from: ['v2.0.0', 'v2.0.1', 'v2.0.2'],
    to: 'v2.1.0',
    run(projectJson: Tags.v2_0_0.ProjectJson | Tags.v2_0_1.ProjectJson | Tags.v2_0_2.ProjectJson): Tags.v2_1_0.ProjectJson {
      return {
        ...projectJson,
        typeDocJsonParserVersion: '2.1.0'
      };
    }
  },
  {
    from: ['v2.1.0'],
    to: 'v2.2.1',
    run(projectJson: Tags.v2_1_0.ProjectJson): Tags.v2_2_0.ProjectJson | Tags.v2_2_1.ProjectJson {
      return {
        ...projectJson,
        typeDocJsonParserVersion: '2.2.1',
        version: null
      };
    }
  },
  {
    from: ['v2.2.0', 'v2.2.1'],
    to: 'v2.3.2',
    run(projectJson: Tags.v2_2_0.ProjectJson | Tags.v2_2_1.ProjectJson): Tags.v2_3_0.ProjectJson | Tags.v2_3_1.ProjectJson | Tags.v2_3_2.ProjectJson {
      function migrateSignatureJson(signatureJson: Tags.v2_2_1.Misc.SignatureJson): Tags.v2_3_2.Misc.SignatureJson {
        return {
          ...signatureJson,
          comment: {
            description: null,
            blockTags: [],
            modifierTags: []
          }
        };
      }

      return {
        ...projectJson,
        typeDocJsonParserVersion: '2.3.2',
        classes: projectJson.classes.map((classJson) => ({
          ...classJson,
          methods: classJson.methods.map((methodJson) => ({
            ...methodJson,
            signatures: methodJson.signatures.map(migrateSignatureJson)
          }))
        })),
        functions: projectJson.functions.map((functionJson) => ({
          ...functionJson,
          signatures: functionJson.signatures.map(migrateSignatureJson)
        }))
      };
    }
  },
  {
    from: ['v2.3.0', 'v2.3.1', 'v2.3.2'],
    to: 'v3.0.0',
    run(projectJson: Tags.v2_3_0.ProjectJson | Tags.v2_3_1.ProjectJson | Tags.v2_3_2.ProjectJson): Tags.v3_0_0.ProjectJson {
      function migrateSourceJson(sourceJson: Tags.v2_3_2.Misc.SourceJson): Tags.v3_0_0.Misc.SourceJson {
        return { ...sourceJson, url: null };
      }

      function migrateClassJson(classJson: Tags.v2_3_0.ClassJson | Tags.v2_3_1.ClassJson | Tags.v2_3_2.ClassJson): Tags.v3_0_0.ClassJson {
        return {
          ...classJson,
          source: migrateSourceJson(classJson.source),
          construct: {
            ...classJson.construct,
            source: migrateSourceJson(classJson.construct.source)
          },
          properties: classJson.properties.map((propertyJson) => ({
            ...propertyJson,
            source: migrateSourceJson(propertyJson.source)
          })),
          methods: classJson.methods.map((methodJson) => ({
            ...methodJson,
            source: migrateSourceJson(methodJson.source)
          }))
        };
      }

      function migrateConstantJson(
        constantJson: Tags.v2_3_0.ConstantJson | Tags.v2_3_1.ConstantJson | Tags.v2_3_2.ConstantJson
      ): Tags.v3_0_0.ConstantJson {
        return { ...constantJson, source: migrateSourceJson(constantJson.source) };
      }

      function migrateEnumJson(enumJson: Tags.v2_3_0.EnumJson | Tags.v2_3_1.EnumJson | Tags.v2_3_2.EnumJson): Tags.v3_0_0.EnumJson {
        return {
          ...enumJson,
          source: migrateSourceJson(enumJson.source),
          properties: enumJson.properties.map((propertyJson) => ({
            ...propertyJson,
            source: migrateSourceJson(propertyJson.source)
          }))
        };
      }

      function migrateFunctionJson(
        functionJson: Tags.v2_3_0.FunctionJson | Tags.v2_3_1.FunctionJson | Tags.v2_3_2.FunctionJson
      ): Tags.v3_0_0.FunctionJson {
        return { ...functionJson, source: migrateSourceJson(functionJson.source) };
      }

      function migrateInterfaceJson(
        interfaceJson: Tags.v2_3_0.InterfaceJson | Tags.v2_3_1.InterfaceJson | Tags.v2_3_2.InterfaceJson
      ): Tags.v3_0_0.InterfaceJson {
        return {
          ...interfaceJson,
          source: migrateSourceJson(interfaceJson.source),
          properties: interfaceJson.properties.map((propertyJson) => ({
            ...propertyJson,
            source: migrateSourceJson(propertyJson.source)
          }))
        };
      }

      function migrateNamespaceJson(
        namespaceJson: Tags.v2_3_0.NamespaceJson | Tags.v2_3_1.NamespaceJson | Tags.v2_3_2.NamespaceJson
      ): Tags.v3_0_0.NamespaceJson {
        return {
          ...namespaceJson,
          source: migrateSourceJson(namespaceJson.source),
          classes: namespaceJson.classes.map(migrateClassJson),
          constants: namespaceJson.constants.map(migrateConstantJson),
          enums: namespaceJson.enums.map(migrateEnumJson),
          functions: namespaceJson.functions.map(migrateFunctionJson),
          interfaces: namespaceJson.interfaces.map(migrateInterfaceJson),
          namespaces: namespaceJson.namespaces.map(migrateNamespaceJson),
          typeAliases: namespaceJson.typeAliases.map(migrateTypeAlias)
        };
      }

      function migrateTypeAlias(
        typeAliasJson: Tags.v2_3_0.TypeAliasJson | Tags.v2_3_1.TypeAliasJson | Tags.v2_3_2.TypeAliasJson
      ): Tags.v3_0_0.TypeAliasJson {
        return { ...typeAliasJson, source: migrateSourceJson(typeAliasJson.source) };
      }

      return {
        ...projectJson,
        typeDocJsonParserVersion: '3.0.0',
        readme: null,
        classes: projectJson.classes.map(migrateClassJson),
        constants: projectJson.constants.map(migrateConstantJson),
        enums: projectJson.enums.map(migrateEnumJson),
        functions: projectJson.functions.map(migrateFunctionJson),
        interfaces: projectJson.interfaces.map(migrateInterfaceJson),
        namespaces: projectJson.namespaces.map(migrateNamespaceJson),
        typeAliases: projectJson.typeAliases.map(migrateTypeAlias)
      };
    }
  },
  {
    from: ['v3.0.0'],
    to: 'v3.1.0',
    run(projectJson: Tags.v3_0_0.ProjectJson): Tags.v3_1_0.ProjectJson {
      function migrateInterfaceJson(interfaceJson: Tags.v3_0_0.InterfaceJson): Tags.v3_1_0.InterfaceJson {
        return { ...interfaceJson, methods: [] };
      }

      function migrateNamespaceJson(namespaceJson: Tags.v3_0_0.NamespaceJson): Tags.v3_1_0.NamespaceJson {
        return {
          ...namespaceJson,
          interfaces: namespaceJson.interfaces.map(migrateInterfaceJson),
          namespaces: namespaceJson.namespaces.map(migrateNamespaceJson)
        };
      }

      return {
        ...projectJson,
        interfaces: projectJson.interfaces.map(migrateInterfaceJson),
        namespaces: projectJson.namespaces.map(migrateNamespaceJson)
      };
    }
  },
  {
    from: ['v3.1.0'],
    to: 'v3.2.0',
    run(projectJson: Tags.v3_1_0.ProjectJson): Tags.v3_2_0.ProjectJson {
      return {
        ...projectJson,
        typeDocJsonParserVersion: '3.2.0',
        changelog: null
      };
    }
  },
  {
    from: ['v3.2.0'],
    to: 'v4.0.0',
    run(projectJson: Tags.v3_2_0.ProjectJson): Tags.v4_0_0.ProjectJson {
      function migrateClassJson(classJson: Tags.v3_2_0.ClassJson): Tags.v4_0_0.ClassJson {
        return {
          ...classJson,
          construct: {
            ...classJson.construct,
            parentId: classJson.id
          },
          properties: classJson.properties.map((propertyJson) => ({
            ...propertyJson,
            parentId: classJson.id
          })),
          methods: classJson.methods.map((methodJson) => ({
            ...methodJson,
            parentId: classJson.id
          }))
        };
      }

      function migrateEnumJson(enumJson: Tags.v3_2_0.EnumJson): Tags.v4_0_0.EnumJson {
        return {
          ...enumJson,
          properties: enumJson.properties.map((propertyJson) => ({
            ...propertyJson,
            parentId: enumJson.id
          }))
        };
      }

      function migrateInterfaceJson(interfaceJson: Tags.v3_2_0.InterfaceJson): Tags.v4_0_0.InterfaceJson {
        return {
          ...interfaceJson,
          properties: interfaceJson.properties.map((propertyJson) => ({
            ...propertyJson,
            parentId: interfaceJson.id
          })),
          methods: interfaceJson.methods.map((methodJson) => ({
            ...methodJson,
            parentId: interfaceJson.id
          }))
        };
      }

      function migrateNamespaceJson(namespaceJson: Tags.v3_2_0.NamespaceJson): Tags.v4_0_0.NamespaceJson {
        return {
          ...namespaceJson,
          classes: namespaceJson.classes.map(migrateClassJson),
          enums: namespaceJson.enums.map(migrateEnumJson),
          interfaces: namespaceJson.interfaces.map(migrateInterfaceJson),
          namespaces: namespaceJson.namespaces.map(migrateNamespaceJson)
        };
      }

      return {
        ...projectJson,
        typeDocJsonParserVersion: '4.0.0',
        classes: projectJson.classes.map(migrateClassJson),
        enums: projectJson.enums.map(migrateEnumJson),
        interfaces: projectJson.interfaces.map(migrateInterfaceJson),
        namespaces: projectJson.namespaces.map(migrateNamespaceJson)
      };
    }
  },
  {
    from: ['v4.0.0', 'v5.0.0', 'v5.0.1', 'v5.1.0', 'v5.2.0'],
    to: 'v6.0.0',
    run(
      projectJson: Tags.v4_0_0.ProjectJson | Tags.v5_0_0.ProjectJson | Tags.v5_0_1.ProjectJson | Tags.v5_1_0.ProjectJson | Tags.v5_2_0.ProjectJson
    ): Tags.v6_0_0.ProjectJson {
      function migrateParameterJson(
        parameterJson:
          | Tags.v4_0_0.Misc.ParameterJson
          | Tags.v5_0_0.Misc.ParameterJson
          | Tags.v5_0_1.Misc.ParameterJson
          | Tags.v5_1_0.Misc.ParameterJson
          | Tags.v5_2_0.Misc.ParameterJson
      ): Tags.v6_0_0.Misc.ParameterJson {
        return {
          ...parameterJson,
          comment: {
            description: null,
            blockTags: [],
            modifierTags: []
          }
        };
      }

      function migrateClassJson(
        classJson: Tags.v4_0_0.ClassJson | Tags.v5_0_0.ClassJson | Tags.v5_0_1.ClassJson | Tags.v5_1_0.ClassJson | Tags.v5_2_0.ClassJson
      ): Tags.v6_0_0.ClassJson {
        return {
          ...classJson,
          typeParameters: [],
          construct: {
            ...classJson.construct,
            parameters: classJson.construct.parameters.map(migrateParameterJson)
          },
          methods: classJson.methods.map((methodJson) => {
            const { id, name, source, parentId, accessibility, abstract, signatures } = methodJson;

            return {
              id,
              name,
              source,
              parentId,
              accessibility,
              abstract,
              static: methodJson.static,
              signatures: signatures.map((signatureJson) => ({
                ...signatureJson,
                parameters: signatureJson.parameters.map(migrateParameterJson)
              }))
            };
          })
        };
      }

      function migrateEnumJson(
        enumJson: Tags.v4_0_0.EnumJson | Tags.v5_0_0.EnumJson | Tags.v5_0_1.EnumJson | Tags.v5_1_0.EnumJson | Tags.v5_2_0.EnumJson
      ): Tags.v6_0_0.EnumJson {
        const { id, name, comment, source, external, properties } = enumJson;

        return {
          id,
          name,
          comment,
          source,
          external,
          members: properties
        };
      }

      function migrateFunctionJson(
        functionJson:
          | Tags.v4_0_0.FunctionJson
          | Tags.v5_0_0.FunctionJson
          | Tags.v5_0_1.FunctionJson
          | Tags.v5_1_0.FunctionJson
          | Tags.v5_2_0.FunctionJson
      ): Tags.v6_0_0.FunctionJson {
        return {
          ...functionJson,
          signatures: functionJson.signatures.map((signatureJson) => ({
            ...signatureJson,
            parameters: signatureJson.parameters.map(migrateParameterJson)
          }))
        };
      }

      function migrateInterfaceJson(
        interfaceJson:
          | Tags.v4_0_0.InterfaceJson
          | Tags.v5_0_0.InterfaceJson
          | Tags.v5_0_1.InterfaceJson
          | Tags.v5_1_0.InterfaceJson
          | Tags.v5_2_0.InterfaceJson
      ): Tags.v6_0_0.InterfaceJson {
        return {
          ...interfaceJson,
          methods: interfaceJson.methods.map((methodJson) => {
            const { id, name, source, parentId, signatures } = methodJson;

            return {
              id,
              name,
              source,
              parentId,
              signatures: signatures.map((signatureJson) => ({
                ...signatureJson,
                parameters: signatureJson.parameters.map(migrateParameterJson)
              }))
            };
          })
        };
      }

      function migrateNamespaceJson(
        namespaceJson:
          | Tags.v4_0_0.NamespaceJson
          | Tags.v5_0_0.NamespaceJson
          | Tags.v5_0_1.NamespaceJson
          | Tags.v5_1_0.NamespaceJson
          | Tags.v5_2_0.NamespaceJson
      ): Tags.v6_0_2.NamespaceJson {
        return {
          ...namespaceJson,
          classes: namespaceJson.classes.map(migrateClassJson),
          enums: namespaceJson.enums.map(migrateEnumJson),
          functions: namespaceJson.functions.map(migrateFunctionJson),
          interfaces: namespaceJson.interfaces.map(migrateInterfaceJson),
          namespaces: namespaceJson.namespaces.map(migrateNamespaceJson),
          typeAliases: namespaceJson.typeAliases,
          variables: namespaceJson.constants
        };
      }

      return {
        ...projectJson,
        typeDocJsonParserVersion: '6.0.0',
        classes: projectJson.classes.map(migrateClassJson),
        enums: projectJson.enums.map(migrateEnumJson),
        functions: projectJson.functions.map(migrateFunctionJson),
        interfaces: projectJson.interfaces.map(migrateInterfaceJson),
        namespaces: projectJson.namespaces.map(migrateNamespaceJson),
        typeAliases: projectJson.typeAliases,
        variables: projectJson.constants
      };
    }
  },
  {
    from: ['v6.0.0', 'v6.0.1', 'v6.0.2'],
    to: 'v7.0.0',
    run(projectJson: Tags.v6_0_0.ProjectJson | Tags.v6_0_1.ProjectJson | Tags.v6_0_2.ProjectJson): Tags.v7_0_0.ProjectJson {
      function migrateTypeParameter(
        typeParameter: Tags.v6_0_0.Misc.TypeParameterJson | Tags.v6_0_1.Misc.TypeParameterJson | Tags.v6_0_2.Misc.TypeParameterJson
      ): Tags.v7_0_0.Misc.TypeParameterJson {
        return {
          ...typeParameter,
          constraint: typeParameter.type
        };
      }

      function migrateClassJson(classJson: Tags.v6_0_0.ClassJson | Tags.v6_0_1.ClassJson | Tags.v6_0_2.ClassJson): Tags.v7_0_0.ClassJson {
        return {
          ...classJson,
          typeParameters: classJson.typeParameters.map(migrateTypeParameter),
          construct: {
            ...classJson.construct,
            accessibility: ClassParser.Accessibility.Public
          },
          methods: classJson.methods.map((methodJson) => ({
            ...methodJson,
            signatures: methodJson.signatures.map((signatureJson) => ({
              ...signatureJson,
              typeParameters: signatureJson.typeParameters.map(migrateTypeParameter)
            }))
          })),
          properties: classJson.properties.map((propertyJson) => ({
            ...propertyJson,
            type: propertyJson.type!
          }))
        };
      }

      function migrateFunctionJson(
        functionJson: Tags.v6_0_0.FunctionJson | Tags.v6_0_1.FunctionJson | Tags.v6_0_2.FunctionJson
      ): Tags.v7_0_0.FunctionJson {
        return {
          ...functionJson,
          signatures: functionJson.signatures.map((signatureJson) => ({
            ...signatureJson,
            typeParameters: signatureJson.typeParameters.map(migrateTypeParameter)
          }))
        };
      }

      function migrateInterfaceJson(
        interfaceJson: Tags.v6_0_0.InterfaceJson | Tags.v6_0_1.InterfaceJson | Tags.v6_0_2.InterfaceJson
      ): Tags.v7_0_0.InterfaceJson {
        return {
          ...interfaceJson,
          typeParameters: [],
          methods: interfaceJson.methods.map((methodJson) => ({
            ...methodJson,
            signatures: methodJson.signatures.map((signatureJson) => ({
              ...signatureJson,
              typeParameters: signatureJson.typeParameters.map(migrateTypeParameter)
            }))
          }))
        };
      }

      function migrateNamespaceJson(
        namespaceJson: Tags.v6_0_0.NamespaceJson | Tags.v6_0_1.NamespaceJson | Tags.v6_0_2.NamespaceJson
      ): Tags.v7_0_0.NamespaceJson {
        return {
          ...namespaceJson,
          classes: namespaceJson.classes.map(migrateClassJson),
          interfaces: namespaceJson.interfaces.map(migrateInterfaceJson),
          functions: namespaceJson.functions.map(migrateFunctionJson),
          namespaces: namespaceJson.namespaces.map(migrateNamespaceJson),
          typeAliases: namespaceJson.typeAliases.map(migrateTypeAliasJson)
        };
      }

      function migrateTypeAliasJson(
        typeAliasJson: Tags.v6_0_0.TypeAliasJson | Tags.v6_0_1.TypeAliasJson | Tags.v6_0_2.TypeAliasJson
      ): Tags.v7_0_0.TypeAliasJson {
        return {
          ...typeAliasJson,
          typeParameters: typeAliasJson.typeParameters.map(migrateTypeParameter)
        };
      }

      return {
        ...projectJson,
        typeDocJsonParserVersion: '7.0.0',
        classes: projectJson.classes.map(migrateClassJson),
        functions: projectJson.functions.map(migrateFunctionJson),
        interfaces: projectJson.interfaces.map(migrateInterfaceJson),
        namespaces: projectJson.namespaces.map(migrateNamespaceJson),
        typeAliases: projectJson.typeAliases.map(migrateTypeAliasJson)
      };
    }
  },
  {
    from: ['v7.0.0', 'v7.0.1', 'v7.0.2'],
    to: 'v7.1.0',
    run(projectJson: Tags.v7_0_0.ProjectJson | Tags.v7_0_1.ProjectJson | Tags.v7_0_2.ProjectJson): Tags.v7_1_0.ProjectJson {
      function migrateParameterJson(
        parameterJson: Tags.v7_0_0.Misc.ParameterJson | Tags.v7_0_1.Misc.ParameterJson | Tags.v7_0_1.Misc.ParameterJson
      ): Tags.v7_1_0.Misc.ParameterJson {
        return { ...parameterJson, optional: false };
      }

      function migrateClassJson(classJson: Tags.v7_0_0.ClassJson | Tags.v7_0_1.ClassJson | Tags.v7_0_2.ClassJson): Tags.v7_1_0.ClassJson {
        return {
          ...classJson,
          construct: {
            ...classJson.construct,
            parameters: classJson.construct.parameters.map(migrateParameterJson)
          },
          methods: classJson.methods.map((methodJson) => ({
            ...methodJson,
            signatures: methodJson.signatures.map((signatureJson) => ({
              ...signatureJson,
              parameters: signatureJson.parameters.map(migrateParameterJson)
            }))
          }))
        };
      }

      function migrateFunctionJson(
        functionJson: Tags.v7_0_0.FunctionJson | Tags.v7_0_1.FunctionJson | Tags.v7_0_2.FunctionJson
      ): Tags.v7_1_0.FunctionJson {
        return {
          ...functionJson,
          signatures: functionJson.signatures.map((signatureJson) => ({
            ...signatureJson,
            parameters: signatureJson.parameters.map(migrateParameterJson)
          }))
        };
      }

      function migrateInterfaceJson(
        interfaceJson: Tags.v7_0_0.InterfaceJson | Tags.v7_0_1.InterfaceJson | Tags.v7_0_2.InterfaceJson
      ): Tags.v7_1_0.InterfaceJson {
        return {
          ...interfaceJson,
          methods: interfaceJson.methods.map((methodJson) => ({
            ...methodJson,
            signatures: methodJson.signatures.map((signatureJson) => ({
              ...signatureJson,
              parameters: signatureJson.parameters.map(migrateParameterJson)
            }))
          }))
        };
      }

      function migrateNamespaceJson(
        namespaceJson: Tags.v7_0_0.NamespaceJson | Tags.v7_0_1.NamespaceJson | Tags.v7_0_2.NamespaceJson
      ): Tags.v7_1_0.NamespaceJson {
        return {
          ...namespaceJson,
          classes: namespaceJson.classes.map(migrateClassJson),
          functions: namespaceJson.functions.map(migrateFunctionJson),
          interfaces: namespaceJson.interfaces.map(migrateInterfaceJson),
          namespaces: namespaceJson.namespaces.map(migrateNamespaceJson)
        };
      }

      return {
        ...projectJson,
        typeDocJsonParserVersion: '7.1.0',
        classes: projectJson.classes.map(migrateClassJson),
        functions: projectJson.functions.map(migrateFunctionJson),
        interfaces: projectJson.interfaces.map(migrateInterfaceJson),
        namespaces: projectJson.namespaces.map(migrateNamespaceJson)
      };
    }
  },
  {
    from: ['v7.1.0'],
    to: 'v7.2.0',
    run(projectJson: Tags.v7_1_0.ProjectJson): Tags.v7_2_0.ProjectJson {
      function migrateParameterJson(parameterJson: Tags.v7_1_0.Misc.ParameterJson): Tags.v7_2_0.Misc.ParameterJson {
        return { ...parameterJson, rest: false };
      }

      function migrateClassJson(classJson: Tags.v7_1_0.ClassJson): Tags.v7_2_0.ClassJson {
        return {
          ...classJson,
          construct: {
            ...classJson.construct,
            parameters: classJson.construct.parameters.map(migrateParameterJson)
          },
          methods: classJson.methods.map((methodJson) => ({
            ...methodJson,
            signatures: methodJson.signatures.map((signatureJson) => ({
              ...signatureJson,
              parameters: signatureJson.parameters.map(migrateParameterJson)
            }))
          }))
        };
      }

      function migrateFunctionJson(functionJson: Tags.v7_1_0.FunctionJson): Tags.v7_2_0.FunctionJson {
        return {
          ...functionJson,
          signatures: functionJson.signatures.map((signatureJson) => ({
            ...signatureJson,
            parameters: signatureJson.parameters.map(migrateParameterJson)
          }))
        };
      }

      function migrateInterfaceJson(interfaceJson: Tags.v7_1_0.InterfaceJson): Tags.v7_2_0.InterfaceJson {
        return {
          ...interfaceJson,
          methods: interfaceJson.methods.map((methodJson) => ({
            ...methodJson,
            signatures: methodJson.signatures.map((signatureJson) => ({
              ...signatureJson,
              parameters: signatureJson.parameters.map(migrateParameterJson)
            }))
          }))
        };
      }

      function migrateNamespaceJson(namespaceJson: Tags.v7_1_0.NamespaceJson): Tags.v7_2_0.NamespaceJson {
        return {
          ...namespaceJson,
          classes: namespaceJson.classes.map(migrateClassJson),
          functions: namespaceJson.functions.map(migrateFunctionJson),
          interfaces: namespaceJson.interfaces.map(migrateInterfaceJson),
          namespaces: namespaceJson.namespaces.map(migrateNamespaceJson)
        };
      }

      return {
        ...projectJson,
        typeDocJsonParserVersion: '7.2.0',
        classes: projectJson.classes.map(migrateClassJson),
        functions: projectJson.functions.map(migrateFunctionJson),
        interfaces: projectJson.interfaces.map(migrateInterfaceJson),
        namespaces: projectJson.namespaces.map(migrateNamespaceJson)
      };
    }
  },
  {
    from: ['v7.2.0'],
    to: 'v7.3.0',
    run(projectJson: Tags.v7_2_0.ProjectJson): Tags.v7_3_0.ProjectJson {
      function migrateClassJson(classJson: Tags.v7_2_0.ClassJson, namespaceParentId: number | null): Tags.v7_3_0.ClassJson {
        return { ...classJson, namespaceParentId };
      }

      function migrateEnumJson(enumJson: Tags.v7_2_0.EnumJson, namespaceParentId: number | null): Tags.v7_3_0.EnumJson {
        return { ...enumJson, namespaceParentId };
      }

      function migrateFunctionJson(functionJson: Tags.v7_2_0.FunctionJson, namespaceParentId: number | null): Tags.v7_3_0.FunctionJson {
        return { ...functionJson, namespaceParentId };
      }

      function migrateInterfaceJson(interfaceJson: Tags.v7_2_0.InterfaceJson, namespaceParentId: number | null): Tags.v7_3_0.InterfaceJson {
        return { ...interfaceJson, namespaceParentId };
      }

      function migrateNamespaceJson(namespaceJson: Tags.v7_2_0.NamespaceJson, namespaceParentId: number | null): Tags.v7_3_0.NamespaceJson {
        return {
          ...namespaceJson,
          classes: namespaceJson.classes.map((classJson) => migrateClassJson(classJson, namespaceJson.id)),
          enums: namespaceJson.enums.map((enumJson) => migrateEnumJson(enumJson, namespaceJson.id)),
          functions: namespaceJson.functions.map((functionJson) => migrateFunctionJson(functionJson, namespaceJson.id)),
          interfaces: namespaceJson.interfaces.map((interfaceJson) => migrateInterfaceJson(interfaceJson, namespaceJson.id)),
          namespaces: namespaceJson.namespaces.map((childNamespaceJson) => migrateNamespaceJson(childNamespaceJson, namespaceJson.id)),
          typeAliases: namespaceJson.typeAliases.map((typeAliasJson) => migrateTypeAliasJson(typeAliasJson, namespaceJson.id)),
          variables: namespaceJson.variables.map((variableJson) => migrateVariableJson(variableJson, namespaceJson.id)),
          namespaceParentId
        };
      }

      function migrateTypeAliasJson(typeAliasJson: Tags.v7_2_0.TypeAliasJson, namespaceParentId: number | null): Tags.v7_3_0.TypeAliasJson {
        return { ...typeAliasJson, namespaceParentId };
      }

      function migrateVariableJson(variableJson: Tags.v7_2_0.VariableJson, namespaceParentId: number | null): Tags.v7_3_0.VariableJson {
        return { ...variableJson, namespaceParentId };
      }

      return {
        ...projectJson,
        typeDocJsonParserVersion: '7.3.0',
        classes: projectJson.classes.map((classJson) => migrateClassJson(classJson, null)),
        enums: projectJson.enums.map((enumJson) => migrateEnumJson(enumJson, null)),
        functions: projectJson.functions.map((functionJson) => migrateFunctionJson(functionJson, null)),
        interfaces: projectJson.interfaces.map((interfaceJson) => migrateInterfaceJson(interfaceJson, null)),
        namespaces: projectJson.namespaces.map((namespaceJson) => migrateNamespaceJson(namespaceJson, null)),
        typeAliases: projectJson.typeAliases.map((typeAliasJson) => migrateTypeAliasJson(typeAliasJson, null)),
        variables: projectJson.variables.map((variableJson) => migrateVariableJson(variableJson, null))
      };
    }
  },
  {
    from: ['v7.3.0', 'v7.3.1', 'v7.3.2', 'v7.4.0', 'v8.0.0', 'v8.0.1', 'v8.1.0', 'v8.1.1', 'v8.1.2'],
    to: 'v8.2.0',
    run(
      projectJson:
        | Tags.v7_3_0.ProjectJson
        | Tags.v7_3_1.ProjectJson
        | Tags.v7_3_2.ProjectJson
        | Tags.v7_4_0.ProjectJson
        | Tags.v8_0_0.ProjectJson
        | Tags.v8_0_1.ProjectJson
        | Tags.v8_1_0.ProjectJson
        | Tags.v8_1_1.ProjectJson
        | Tags.v8_1_2.ProjectJson
    ): Tags.v8_2_0.ProjectJson {
      function migrateInterfaceJson(
        interfaceJson:
          | Tags.v7_3_0.InterfaceJson
          | Tags.v7_3_1.InterfaceJson
          | Tags.v7_3_2.InterfaceJson
          | Tags.v7_4_0.InterfaceJson
          | Tags.v8_0_0.InterfaceJson
          | Tags.v8_0_1.InterfaceJson
          | Tags.v8_1_0.InterfaceJson
          | Tags.v8_1_1.InterfaceJson
          | Tags.v8_1_2.InterfaceJson
      ): Tags.v8_2_0.InterfaceJson {
        return {
          ...interfaceJson,
          properties: interfaceJson.properties.map((propertyJson) => ({
            ...propertyJson,
            optional: false
          }))
        };
      }

      function migrateNamespaceJson(
        namespaceJson:
          | Tags.v7_3_0.NamespaceJson
          | Tags.v7_3_1.NamespaceJson
          | Tags.v7_3_2.NamespaceJson
          | Tags.v7_4_0.NamespaceJson
          | Tags.v8_0_0.NamespaceJson
          | Tags.v8_0_1.NamespaceJson
          | Tags.v8_1_0.NamespaceJson
          | Tags.v8_1_1.NamespaceJson
          | Tags.v8_1_2.NamespaceJson
      ): Tags.v8_2_0.NamespaceJson {
        return {
          ...namespaceJson,
          interfaces: namespaceJson.interfaces.map(migrateInterfaceJson),
          namespaces: namespaceJson.namespaces.map(migrateNamespaceJson)
        };
      }

      return {
        ...projectJson,
        typeDocJsonParserVersion: '8.2.0',
        interfaces: projectJson.interfaces.map(migrateInterfaceJson),
        namespaces: projectJson.namespaces.map(migrateNamespaceJson)
      };
    }
  },
  {
    from: ['v8.2.0', 'v9.0.0', 'v9.0.1', 'v10.0.0'],
    to: 'v10.1.0',
    run(
      projectJson: Tags.v8_2_0.ProjectJson | Tags.v9_0_0.ProjectJson | Tags.v9_0_1.ProjectJson | Tags.v10_0_0.ProjectJson
    ): Tags.v10_1_0.ProjectJson {
      return {
        ...projectJson,
        typeDocJsonParserVersion: '10.1.0',
        dependencies: {}
      };
    }
  },
  {
    from: ['v10.1.0'],
    to: 'v10.1.2',
    run(projectJson: Tags.v10_1_0.ProjectJson | Tags.v10_1_1.ProjectJson): Tags.v10_1_2.ProjectJson {
      return {
        ...projectJson,
        typeDocJsonParserVersion: '10.1.2'
      };
    }
  }
];
