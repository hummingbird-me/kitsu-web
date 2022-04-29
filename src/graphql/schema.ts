import { IntrospectionSchema } from 'graphql';
import schemaJson from './schema.json';

// Cast through unknown to fix the type
const schema = schemaJson as unknown as {
  __schema: IntrospectionSchema;
};

export default schema;
