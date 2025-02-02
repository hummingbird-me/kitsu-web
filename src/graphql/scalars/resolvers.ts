import { type Resolver, type ResolverConfig } from '@urql/exchange-graphcache';
import {
  type IntrospectionInterfaceType,
  type IntrospectionOutputTypeRef,
  type IntrospectionType,
} from 'graphql';

// Load the types and convert them into a map of name to type
// @todo This should be using the smaller urql schema but it calls all scalars "Any" so we can't use it
// We should fix that!
import schema from '@/graphql/schema.tada.json';

import scalars from './index';

const types = schema.__schema.types;
const keyedTypes: { [key: string]: IntrospectionType } = types.reduce(
  (out, type) => ({ ...out, [type.name]: type }),
  {},
);

// Load the resolvers and create a map of scalar name to resolver function
type ScalarResolver = (value: unknown) => ReturnType<Resolver>;

function resolverFor(type: IntrospectionOutputTypeRef): ScalarResolver | null {
  const scalarResolver =
    'ofType' in type && type.ofType ? resolverFor(type.ofType) : null;
  switch (type.kind) {
    case 'SCALAR':
      // @ts-ignore It doesn't like we're indexing the object with an unknown string key
      return scalars[type.name] as ScalarResolver;
    case 'NON_NULL':
      return scalarResolver;
    case 'LIST':
      return scalarResolver
        ? (list) => {
            return (list as unknown[]).map((v) => scalarResolver(v));
          }
        : null;
    default:
      return null;
  }
}

/*
 * Create a resolver map for rehydrating scalars on all our object types. Typescript is more than a
 * little confused by our introspection JSON so we create a simple schema type to help it out.
 */
const resolvers: ResolverConfig = {};
for (const name of Object.keys(keyedTypes)) {
  const type = keyedTypes[name];
  // If we're an object with fields, find any which are scalars and add them to our resolver map.
  if (type.kind === 'OBJECT') {
    const { fields: baseFields, interfaces: baseInterfaces } = type;
    const fields = baseFields ? [...baseFields] : [];
    const interfaces = baseInterfaces ? [...baseInterfaces] : [];

    // Flatten our interfaces into the fields list
    while (interfaces?.length) {
      const interfaceRef = interfaces.shift();
      const intf =
        interfaceRef &&
        (keyedTypes[interfaceRef.name] as IntrospectionInterfaceType);
      if (intf?.fields) fields.push(...intf.fields);
      if (intf?.interfaces) interfaces.push(...intf.interfaces);
    }

    for (const field of fields) {
      const resolver = resolverFor(field.type);
      if (resolver) {
        resolvers[name] ??= {};
        resolvers[name][field.name] = (parent) => resolver(parent[field.name]);
      }
    }
  }
}

export default resolvers;
