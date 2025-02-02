import { type ResolverConfig } from '@urql/exchange-graphcache';
import { relayPagination } from '@urql/exchange-graphcache/extras';
import { merge } from 'lodash-es';

import scalarResolvers from './scalars/resolvers';

export default merge(scalarResolvers, {
  Query: {
    heldForModeration: relayPagination(),
  },
  Profile: {
    library: relayPagination(),
  },
  Library: {
    all: relayPagination(),
    completed: relayPagination(),
    current: relayPagination(),
    dropped: relayPagination(),
    onHold: relayPagination(),
    planned: relayPagination(),
  },
  Anime: {
    episodes: relayPagination(),
    characters: relayPagination(),
    categories: relayPagination(),
    mappings: relayPagination(),
    productions: relayPagination(),
    quotes: relayPagination(),
    reactions: relayPagination(),
    staff: relayPagination(),
    streamingLinks: relayPagination(),
  },
}) satisfies ResolverConfig;
