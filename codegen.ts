import { CodegenConfig } from '@graphql-codegen/cli';

export default {
  schema: 'https://kitsu.io/api/graphql',
  documents: 'src/**/*.gql',
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
  generates: {
    'src/graphql/schema.json': {
      plugins: ['introspection'],
      config: {
        includeScalars: true,
        includeEnums: true,
        includeInputs: true,
      },
    },
    'src/graphql/types.ts': {
      plugins: ['typescript'],
      config: {
        immutableTypes: true,
        scalars: {
          Map: 'Record<string, string>',
          JSON: 'unknown',
          Date: 'Date',
          ISO8601Date: 'Date',
          ISO8601DateTime: 'Date',
        },
      },
    },
    'src/': {
      preset: 'near-operation-file',
      presetConfig: {
        extension: '-gql.ts',
        baseTypesPath: 'graphql/types.ts',
      },
      config: {
        documentMode: 'documentNodeImportFragments',
        skipTypename: true,
        dedupeOperationSuffix: true,
        dedupeFragments: true,
        skipDocumentsValidation: {
          skipDuplicateValidation: true,
          ignoreRules: ['UniqueFragmentNames'],
        },
        scalars: {
          Map: 'Record<string, string>',
          JSON: 'unknown',
          Date: 'Date',
          ISO8601Date: 'Date',
          ISO8601DateTime: 'Date',
        },
      },
      plugins: ['typescript-operations', 'typescript-urql'],
    },
  },
} satisfies CodegenConfig;
