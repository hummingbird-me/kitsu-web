import React from 'react';
import { FormattedMessage } from 'react-intl';

export default function FormattedEpisodeCount({
  episodeCount,
}: {
  episodeCount: number;
}) {
  return (
    <FormattedMessage
      defaultMessage="{count, plural, one {# Episode} other {# Episodes}}"
      values={{ count: episodeCount }}
    />
  );
}
