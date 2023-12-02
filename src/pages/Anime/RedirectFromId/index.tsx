import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

import { useFindAnimeSlugByIdQuery } from './findAnimeSlugById-gql';

export default function AnimePageRedirectFromId(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const [{ data }] = useFindAnimeSlugByIdQuery({ variables: { id: id! } });

  return <Navigate to={`/anime/${data?.findAnimeById?.slug}`} />;
}
