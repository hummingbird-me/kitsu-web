import { type IntrospectionSchema } from 'graphql';

import schemaJson from './schema.urql.json';

// Cast through unknown to fix the type
const schema = schemaJson as unknown as {
  __schema: IntrospectionSchema;
};

export default schema;
