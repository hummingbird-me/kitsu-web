import React from 'react';
import { FormattedMessage } from 'react-intl';

import { AnimeSubtypeEnum, MangaSubtypeEnum } from 'app/graphql/types';

export default function FormattedSubtype({
  subtype,
}: {
  subtype: AnimeSubtypeEnum | MangaSubtypeEnum;
}): JSX.Element {
  switch (subtype) {
    case AnimeSubtypeEnum.Movie:
      return <FormattedMessage defaultMessage="Movie" />;
    case AnimeSubtypeEnum.Music:
      return <FormattedMessage defaultMessage="Music" />;
    case AnimeSubtypeEnum.Ona:
      return <FormattedMessage defaultMessage="ONA" />;
    case AnimeSubtypeEnum.Ova:
      return <FormattedMessage defaultMessage="OVA" />;
    case AnimeSubtypeEnum.Special:
      return <FormattedMessage defaultMessage="Special" />;
    case AnimeSubtypeEnum.Tv:
      return <FormattedMessage defaultMessage="TV" />;
    case MangaSubtypeEnum.Doujin:
      return <FormattedMessage defaultMessage="Doujin" />;
    case MangaSubtypeEnum.Manga:
      return <FormattedMessage defaultMessage="Manga" />;
    case MangaSubtypeEnum.Manhua:
      return <FormattedMessage defaultMessage="Manhua" />;
    case MangaSubtypeEnum.Manhwa:
      return <FormattedMessage defaultMessage="Manhwa" />;
    case MangaSubtypeEnum.Novel:
      return <FormattedMessage defaultMessage="Novel" />;
    case MangaSubtypeEnum.Oel:
      return <FormattedMessage defaultMessage="OEL" />;
    case MangaSubtypeEnum.Oneshot:
      return <FormattedMessage defaultMessage="One-shot" />;
  }
}
