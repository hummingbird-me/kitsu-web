import React from 'react';
import { Route } from 'react-router-dom';

import { Path, PathBuilder, pathTree } from 'app/utils/routes';

import AnimeSummaryPage from './Summary';

export const pages = (
  <Route path="anime">
    <Route path=":slug">
      <Route path="" element={<AnimeSummaryPage />} />
    </Route>
  </Route>
);

export const paths = ((slug: string) => {
  const path = new Path(`/anime/${slug}`);

  return pathTree(path, {
    episodes: () => new Path(`${path}/episodes`),
    episode: (number: string) => new Path(`${path}/episodes/${number}`),
    characters: () => new Path(`${path}/characters`),
    staff: () => new Path(`${path}/staff`),
    reactions: () => new Path(`${path}/reactions`),
    franchise: () => new Path(`${path}/franchise`),
    quotes: () => new Path(`${path}/quotes`),
    quote: (id: string) => new Path(`${path}/quotes/${id}`),
  });
}) satisfies PathBuilder;
