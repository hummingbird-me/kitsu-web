import React from 'react';
import { FormattedMessage } from 'react-intl';

export default function FormattedSubtype({
  subtype,
}: {
  subtype:
    | 'MOVIE'
    | 'MUSIC'
    | 'ONA'
    | 'OVA'
    | 'SPECIAL'
    | 'TV'
    | 'DOUJIN'
    | 'MANGA'
    | 'MANHUA'
    | 'MANHWA'
    | 'NOVEL'
    | 'OEL'
    | 'ONESHOT';
}) {
  switch (subtype) {
    case 'MOVIE':
      return <FormattedMessage defaultMessage="Movie" />;
    case 'MUSIC':
      return <FormattedMessage defaultMessage="Music" />;
    case 'ONA':
      return <FormattedMessage defaultMessage="ONA" />;
    case 'OVA':
      return <FormattedMessage defaultMessage="OVA" />;
    case 'SPECIAL':
      return <FormattedMessage defaultMessage="Special" />;
    case 'TV':
      return <FormattedMessage defaultMessage="TV" />;
    case 'DOUJIN':
      return <FormattedMessage defaultMessage="Doujin" />;
    case 'MANGA':
      return <FormattedMessage defaultMessage="Manga" />;
    case 'MANHUA':
      return <FormattedMessage defaultMessage="Manhua" />;
    case 'MANHWA':
      return <FormattedMessage defaultMessage="Manhwa" />;
    case 'NOVEL':
      return <FormattedMessage defaultMessage="Novel" />;
    case 'OEL':
      return <FormattedMessage defaultMessage="OEL" />;
    case 'ONESHOT':
      return <FormattedMessage defaultMessage="One-shot" />;
  }
}
