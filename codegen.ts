import { type CodegenConfig } from '@graphql-codegen/cli';

export default {
  schema: {
    'https://kitsu.io/api/graphql': {
      headers: {
        'X-Schema-Visible': 'all',
      },
    },
  },
  documents: 'src/**/*.gql',
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
  generates: {
    'src/graphql/schema.json': {
      plugins: ['urql-introspection'],
      config: {
        includeScalars: true,
        includeEnums: true,
        includeInputs: true,
      },
    },
  },
} satisfies CodegenConfig;
